import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import Parser from "rss-parser";
import * as cheerio from "cheerio";
import { DateTime } from "luxon";
import helmet from "helmet";
import admin from "firebase-admin";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Firebase Admin Setup ---
const firebaseConfigPath = path.join(process.cwd(), "firebase-applet-config.json");
const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, "utf8"));

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const db = admin.firestore();
// Use the exact databaseId if specified in config, otherwise default
const firestore = firebaseConfig.firestoreDatabaseId 
  ? admin.firestore().databaseId === firebaseConfig.firestoreDatabaseId 
    ? admin.firestore() 
    : (admin.firestore() as any).database(firebaseConfig.firestoreDatabaseId)
  : admin.firestore();

const newsCollection = db.collection("articles");
const statsDoc = db.collection("stats").doc("global");

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
  seoData: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    schema: any;
  };
  viralScore: number;
}

// --- Data Store (Synced to Firestore) ---
// In-memory store removed in favor of Firestore persistence.

// --- AI Service (Server-side) ---
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

const aiService = {
  async processArticle(rawArticle: any): Promise<NewsArticle | null> {
    if (!genAI) return null;
    
    try {
      const model = (genAI as any).getGenerativeModel({ model: "gemini-3-flash-preview" });
      
      const prompt = `
        Act as a professional entertainment journalist and SEO expert. 
        Rewrite the following news article to be 100% plagiarism-free, engaging, and highly optimized for SEO.
        Requirements:
        - Article length: Around 800 words with deep insights.
        - Tone: Casual yet professional.
        - Output format: JSON
        - Content must include: 
          - A viral-ready headline (metaTitle)
          - Engaging summary (metaDescription)
          - Full rich text article (content) with sections
          - Keywords for SEO
          - Sentiment score (0-100)
          - Viral Score (0-100) based on current trends.

        Original Title: ${rawArticle.title}
        Original Content: ${rawArticle.content || rawArticle.description}
        Category: ${rawArticle.category}
      `;

      const result = await model.generateContent(prompt);
      const data = JSON.parse(result.response.text().replace(/```json|```/g, ""));

      return {
        id: Math.random().toString(36).substr(2, 9),
        title: data.metaTitle || rawArticle.title,
        description: data.metaDescription || rawArticle.description,
        content: data.content || rawArticle.content,
        author: "CinePulse AI Editor",
        category: rawArticle.category,
        tags: data.keywords || [],
        imageUrl: rawArticle.imageUrl || "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000",
        publishedAt: new Date().toISOString(),
        slug: rawArticle.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        seoData: {
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          keywords: data.keywords,
          schema: {
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "headline": data.metaTitle,
            "image": [rawArticle.imageUrl],
            "datePublished": new Date().toISOString()
          }
        },
        viralScore: data.viralScore || 50
      };
    } catch (error) {
      console.error("[AI-SERVICE] Error processing article:", error);
      return null;
    }
  }
};

// --- Scraping Engine ---
const parser = new Parser();
const rssSources = [
  { url: "https://news.google.com/rss/search?q=bollywood+news&hl=en-IN&gl=IN&ceid=IN:en", category: "Bollywood" as const },
  { url: "https://news.google.com/rss/search?q=hollywood+news&hl=en-US&gl=US&ceid=US:en", category: "Hollywood" as const },
  { url: "https://www.bollywoodhungama.com/rss/news.xml", category: "Bollywood" as const },
  { url: "https://www.pinkvilla.com/rss/bollywood", category: "Bollywood" as const },
  { url: "https://variety.com/feed/", category: "Hollywood" as const }
];

// --- Aggregator Service ---
const aggregatorService = {
  async fetchAndProcess() {
    console.log("[AGGREGATOR] Starting Global Sync...");
    for (const source of rssSources) {
      try {
        const feed = await parser.parseURL(source.url);
        for (const item of feed.items.slice(0, 3)) {
          if (!item.title) continue;

          // Duplicate check using Firestore
          const duplicateCheck = await newsCollection.where("title", "==", item.title).limit(1).get();
          if (!duplicateCheck.empty) continue;

          console.log(`[AGGREGATOR] New Story Found: ${item.title}`);
          let imageUrl = item.enclosure?.url || "";
          if (!imageUrl && item.content) {
            const $ = cheerio.load(item.content);
            imageUrl = $("img").first().attr("src") || "";
          }

          const article = await aiService.processArticle({
            title: item.title,
            description: item.contentSnippet,
            content: item.content,
            category: source.category,
            imageUrl: imageUrl
          });

          if (article) {
            await newsCollection.doc(article.id).set(article);
            console.log(`[AGGREGATOR] Published: ${article.title}`);
            
            // Update global stats
            await statsDoc.set({
              totalArticles: admin.firestore.FieldValue.increment(1),
              lastRefreshed: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
          }
        }
      } catch (e) {
        console.error(`[AGGREGATOR] Source failed: ${source.url}`, e);
      }
    }
  }
};

// --- Social & Notification ---
const socialService = {
  async broadcast(article: NewsArticle) {
    console.log(`[SOCIAL] AUTO-PUBLISH: ${article.title}`);
    // Mocked API calls
  }
};

// --- Initialization & Intervals ---
setInterval(() => aggregatorService.fetchAndProcess(), 1800000); // Every 30 mins

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(helmet({
    contentSecurityPolicy: false, // For development ease
  }));
  app.use(express.json());

  // SEO: Sitemap
  app.get("/sitemap.xml", async (req, res) => {
    res.header("Content-Type", "application/xml");
    const snapshot = await newsCollection.orderBy("publishedAt", "desc").limit(100).get();
    const urls = snapshot.docs.map(doc => {
      const n = doc.data();
      return `
        <url>
          <loc>https://cinepulse.ai/news/${n.slug}</loc>
          <lastmod>${n.publishedAt.split("T")[0]}</lastmod>
        </url>
      `;
    }).join("");
    res.send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
  });

  // API News
  app.get("/api/news", async (req, res) => {
    try {
      const { category, q } = req.query;
      let query: admin.firestore.Query = newsCollection;

      if (category && category !== "trending") {
        // Normalize category naming
        const cat = (category as string).charAt(0).toUpperCase() + (category as string).slice(1);
        query = query.where("category", "==", cat);
      }
      
      const snapshot = await query.orderBy("publishedAt", "desc").limit(50).get();
      let newsList = snapshot.docs.map(doc => doc.data() as NewsArticle);

      if (category === "trending") {
        newsList = newsList.filter(n => n.viralScore >= 70).sort((a, b) => b.viralScore - a.viralScore);
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
      res.status(500).json({ error: "Intelligence sync failure" });
    }
  });

  app.get("/api/admin/stats", async (req, res) => {
    try {
      const statsSnap = await statsDoc.get();
      const meta = statsSnap.data() || { totalArticles: 0, lastRefreshed: new Date().toISOString() };
      
      const latestSnap = await newsCollection.orderBy("publishedAt", "desc").limit(5).get();
      const trending = latestSnap.docs.map(doc => doc.data().title);

      res.json({
        totalArticles: meta.totalArticles,
        trending,
        seo: { health: 99, indexingStatus: "Connected" },
        monetization: { monthlyEst: (meta.totalArticles * 0.45).toFixed(2), adSense: "Verified" },
        social: {
          pages: [
            { name: "CinePulse Social Nodes", status: "Active", followers: "128k Combined" }
          ]
        }
      });
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.post("/api/admin/refresh", async (req, res) => {
    await aggregatorService.fetchAndProcess();
    res.json({ success: true });
  });

  // Vite
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CinePulse Heavy-Duty AI Engine online at :${PORT}`);
    aggregatorService.fetchAndProcess();
  });
}

startServer();
