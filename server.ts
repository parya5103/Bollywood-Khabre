import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Parser from "rss-parser";
import * as cheerio from "cheerio";
import { DateTime } from "luxon";
import helmet from "helmet";
import admin from "firebase-admin";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Firebase Admin Setup ---
let adminDb: admin.firestore.Firestore;
let fbError: string | null = null;

function initFirebase() {
  try {
    const firebaseConfigPath = path.join(process.cwd(), "firebase-applet-config.json");
    if (!fs.existsSync(firebaseConfigPath)) {
      throw new Error("firebase-applet-config.json not found");
    }
    
    const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, "utf8"));
    
    console.log(`[FIREBASE] Connecting to: ${firebaseConfig.projectId}`);

    admin.initializeApp({
      projectId: firebaseConfig.projectId
    });

    adminDb = admin.firestore(firebaseConfig.firestoreDatabaseId);
    console.log("[FIREBASE] Autonomous Admin Connection Ready");
    fbError = null;
  } catch (err: any) {
    console.error("[FIREBASE] Initialization Error:", err.message);
    fbError = err.message;
  }
}

// --- Models ---

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  category: "Bollywood" | "Hollywood" | "Trending" | "Reviews";
  tags: string[];
  imageUrl: string;
  publishedAt: string;
  slug: string;
  viralScore: number;
  sentiment: "Positive" | "Neutral" | "Negative";
  language: "Bilingual" | "English" | "Hindi";
  seoData: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    schema: any;
  };
}

// --- Data Store (Synced to Firestore) ---
// In-memory store removed in favor of Firestore persistence.

// --- AI Service (Server-side) ---
const GEMINI_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_KEY) {
  console.error("[AI-SERVICE] CRITICAL: GEMINI_API_KEY is missing from environment.");
} else {
  console.log(`[AI-SERVICE] API Key detected (prefix: ${GEMINI_KEY.substring(0, 4)}..., length: ${GEMINI_KEY.length})`);
}

const genAI = GEMINI_KEY ? new GoogleGenerativeAI(GEMINI_KEY) : null;

const aiService = {
  getRawArticle(rawArticle: any): NewsArticle {
    const slug = (rawArticle.title || "news").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return {
      id: Math.random().toString(36).substr(2, 9),
      title: rawArticle.title,
      description: rawArticle.description || "",
      content: rawArticle.content || rawArticle.description || "",
      author: "CinePulse Central",
      category: rawArticle.category,
      tags: [],
      imageUrl: rawArticle.imageUrl || "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000",
      publishedAt: new Date().toISOString(),
      slug: slug,
      sentiment: "Neutral",
      language: "Bilingual",
      viralScore: 50,
      seoData: {
        metaTitle: `${rawArticle.title} | CinePulse AI News`,
        metaDescription: (rawArticle.description || "").substring(0, 160),
        keywords: [rawArticle.category, "News", "Latest Updates"],
        schema: {}
      }
    };
  },

  async processArticle(rawArticle: any): Promise<NewsArticle | null> {
    if (!genAI) return this.getRawArticle(rawArticle);
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `
        Act as a professional SEO journalist. Rewrite this news for CinePulse.ai.
        REQUIREMENTS:
        1. Professional English tone.
        2. Format: Headline, 2-3 detailed paragraphs.
        3. Provide a separate "hindi_summary" with a 2-sentence gist.
        4. Sentiment: Positive/Neutral/Negative.
        5. Keywords: 5 relevant entertainment keywords.
        
        OUTPUT JSON ONLY:
        {
          "headline": "SEO Catchy Title",
          "summary": "160 char summary",
          "full_article": "Markdown formatted news",
          "hindi_summary": "2 sentences in Hindi about the story",
          "keywords": ["tag1", "tag2"],
          "sentiment": "Neutral",
          "score": 90
        }

        NEWS: ${rawArticle.title} - ${rawArticle.description}
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      // Improved JSON extraction
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found in response");
      
      const data = JSON.parse(jsonMatch[0].trim());

      const base = this.getRawArticle(rawArticle);
      return {
        ...base,
        title: data.headline || base.title,
        description: data.summary || base.description,
        content: data.full_article || base.content,
        summaryHindi: data.hindi_summary || "",
        tags: data.keywords || [],
        sentiment: data.sentiment || "Neutral",
        viralScore: data.score || 70,
        seoData: {
          metaTitle: data.headline,
          metaDescription: data.summary,
          keywords: data.keywords,
          schema: {
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "headline": data.headline,
            "datePublished": base.publishedAt
          }
        }
      };
    } catch (error: any) {
      console.warn("[AI-SERVICE] Processing failed, using raw data.", error.message);
      return this.getRawArticle(rawArticle);
    }
  }
};

// --- Scraping Engine ---
const parser = new Parser();
const rssSources = [
  { url: "https://news.google.com/rss/search?q=bollywood+news&hl=en-IN&gl=IN&ceid=IN:en", category: "Bollywood" as const },
  { url: "https://news.google.com/rss/search?q=hollywood+news&hl=en-US&gl=US&ceid=US:en", category: "Hollywood" as const },
  { url: "https://www.bollywoodhungama.com/rss/news.xml", category: "Bollywood" as const },
  { url: "https://variety.com/feed/", category: "Hollywood" as const },
  { url: "https://www.filmcompanion.in/feed", category: "Reviews" as const },
  { url: "https://www.hollywoodreporter.com/feed/", category: "Hollywood" as const }
];

// --- Aggregator Service ---
const aggregatorService = {
  lastScrapeTime: 0,
  cache: [] as NewsArticle[],

  async fetchAndProcess() {
    if (Date.now() - this.lastScrapeTime < 10 * 60 * 1000 && this.cache.length > 0) {
      return this.cache;
    }

    console.log("[AGGREGATOR] Autonomous Scraping Triggered...");
    let newArticles: NewsArticle[] = [];

    const activeSources = rssSources.slice(0, 3);
    for (const source of activeSources) {
      try {
        const feed = await parser.parseURL(source.url);
        for (const item of feed.items.slice(0, 4)) {
          if (!item.title) continue;

          const existing = this.cache.find(a => a.title === item.title);
          if (existing) continue;

          const article = await aiService.processArticle({
            title: item.title,
            description: item.contentSnippet || item.content || "",
            category: source.category,
            imageUrl: item.enclosure?.url || ""
          });

          if (article) {
            newArticles.push(article);
            if (adminDb) {
              try {
                await adminDb.collection("articles").doc(article.id).set(article);
              } catch (e: any) {
                console.error("[DB] Save failed:", e.message);
              }
            }
          }
        }
      } catch (e) {
        console.error(`[AGGREGATOR] Failed source: ${source.url}`);
      }
    }

    this.cache = [...newArticles, ...this.cache].slice(0, 100);
    this.lastScrapeTime = Date.now();
    return this.cache;
  }
};

// --- Initialization ---

async function startServer() {
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "development";
  }
  
  initFirebase();

  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Security Enhancement: Add Helmet for security headers
  app.use(helmet({ contentSecurityPolicy: false })); // Disabled CSP to avoid breaking inline scripts/styles in dev

  // SEO Infrastructure
  app.get("/robots.txt", (req, res) => {
    res.type("text/plain");
    res.send("User-agent: *\nAllow: /\nSitemap: /sitemap.xml");
  });

  app.get("/sitemap.xml", async (req, res) => {
    res.header("Content-Type", "application/xml");
    try {
      if (!adminDb) throw new Error("DB offline");
      const snapshot = await adminDb.collection("articles").orderBy("publishedAt", "desc").limit(100).get();
      const urls = snapshot.docs.map((d: any) => {
        const art = d.data();
        return `<url><loc>https://cinepulse.ai/news/${art.slug}</loc><lastmod>${art.publishedAt.split("T")[0]}</lastmod></url>`;
      }).join("");
      res.send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
    } catch (e) {
      res.send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`);
    }
  });

  // API News - Autonomous endpoint
  app.get("/api/news", async (req, res) => {
    try {
      const { category, q, refresh } = req.query;
      
      let newsList: NewsArticle[] = [];

      // If Firestore is working, try reading from there first
      if (adminDb) {
        try {
          const snapshot = await adminDb.collection("articles").orderBy("publishedAt", "desc").limit(50).get();
          newsList = snapshot.docs.map((d: any) => d.data() as NewsArticle);
        } catch (e: any) {
          console.warn("[API] DB Read failed:", e.message);
        }
      }

      // If no news in DB or forced refresh, trigger autonomous scrape
      if (newsList.length === 0 || refresh === "true") {
        newsList = await aggregatorService.fetchAndProcess();
      }

      // Filtering
      if (category && category !== "trending" && category !== "home") {
        const cat = (category as string).toLowerCase();
        newsList = newsList.filter(n => n.category.toLowerCase() === cat);
      }

      if (category === "trending") {
        newsList = newsList.filter(n => n.viralScore > 60).sort((a, b) => b.viralScore - a.viralScore);
      }

      if (q) {
        const search = (q as string).toLowerCase();
        newsList = newsList.filter(n => 
          n.title.toLowerCase().includes(search) || 
          n.tags.some(t => t.toLowerCase().includes(search))
        );
      }
      res.json(newsList);
    } catch (e) {
      console.error("[API] Error fetching news:", e);
      res.status(500).json({ error: "Autonomous scrap failure" });
    }
  });

  // Health check
  app.get("/api/health", async (req, res) => {
    res.json({ status: "online", mode: process.env.NODE_ENV });
  });

  // Vite & Catch-all
  let viteMiddleware: any = (req: any, res: any, next: any) => next();
  app.use((req, res, next) => viteMiddleware(req, res, next));

  if (process.env.NODE_ENV === "production") {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CinePulse Autonomous AI Engine online at http://0.0.0.0:${PORT}`);
    
    if (process.env.NODE_ENV !== "production") {
      createViteServer({ 
        server: { middlewareMode: true }, 
        appType: "spa" 
      }).then(vite => {
        viteMiddleware = vite.middlewares;
      });
    }

    // Trigger initial scrape after 10s
    setTimeout(() => {
      aggregatorService.fetchAndProcess().catch(console.error);
    }, 10000);
  });
}

startServer();
