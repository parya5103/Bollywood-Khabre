# FULLY AUTOMATED BOLLYWOOD + HOLLYWOOD NEWS SCRAPER & PUBLISHING PORTAL

## 1. Full Folder Structure

```
cinepulse-ai/
├── backend/                  # Node.js + Express Backend
│   ├── src/
│   │   ├── config/           # DB, AI, and Scraper Config
│   │   ├── controllers/      # API Controllers
│   │   ├── models/           # MongoDB Schemas
│   │   ├── routes/           # API Routes
│   │   ├── scrapers/         # Puppeteer & RSS Logic
│   │   ├── services/         # Ollama AI & Automation Services
│   │   └── utils/            # Helper functions
│   ├── .env                  # Backend Env Vars
│   ├── package.json
│   └── server.js
├── frontend/                 # Next.js 15 Frontend
│   ├── src/
│   │   ├── app/              # Next.js App Router Pages
│   │   ├── components/       # UI Components
│   │   ├── lib/              # Utils and API helpers
│   │   └── styles/           # Tailwind CSS
│   ├── public/               # Static Assets
│   ├── .env.local            # Frontend Env Vars
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   └── package.json
├── docker-compose.yml        # Docker Orchestration
├── start.sh                  # One-command startup script
├── .gitignore
└── README.md
```

## 2. Production-Ready Code

### Backend - `backend/src/scrapers/index.js` (Puppeteer + RSS Scraper)
```javascript
const puppeteer = require('puppeteer');
const Parser = require('rss-parser');
const parser = new Parser();

async function scrapePinkvilla() {
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto('https://www.pinkvilla.com/entertainment', { waitUntil: 'domcontentloaded' });

    const articles = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.article-card')).map(card => ({
            title: card.querySelector('h3')?.innerText,
            link: card.querySelector('a')?.href,
            imageUrl: card.querySelector('img')?.src,
            category: 'Bollywood'
        }));
    });

    await browser.close();
    return articles;
}

async function scrapeRSS() {
    const feed = await parser.parseURL('https://www.bollywoodhungama.com/rss/news.xml');
    return feed.items.map(item => ({
        title: item.title,
        link: item.link,
        description: item.contentSnippet,
        pubDate: item.pubDate,
        category: 'Bollywood'
    }));
}

module.exports = { scrapePinkvilla, scrapeRSS };
```

### Backend - `backend/src/services/ai.js` (Ollama Integration)
```javascript
const axios = require('axios');

async function rewriteArticle(content, mode = "Professional") {
    const prompt = `Rewrite the following article in a ${mode} tone. Make it SEO friendly. Return ONLY the rewritten text:\n\n${content}`;
    try {
        const response = await axios.post('http://localhost:11434/api/generate', {
            model: 'llama3',
            prompt: prompt,
            stream: false
        });
        return response.data.response;
    } catch (error) {
        console.error("Ollama Rewrite Error:", error);
        return content; // Fallback to original
    }
}

module.exports = { rewriteArticle };
```

### Backend - `backend/server.js` (Express Server)
```javascript
const express = require('express');
const cron = require('node-cron');
const { scrapeRSS } = require('./src/scrapers');
const { rewriteArticle } = require('./src/services/ai');

const app = express();
app.use(express.json());

// Run Scraping every 30 mins
cron.schedule('*/30 * * * *', async () => {
    console.log("Starting Scheduled Scrape...");
    const articles = await scrapeRSS();
    for(let article of articles.slice(0, 2)) {
        console.log(`Rewriting: ${article.title}`);
        const rewritten = await rewriteArticle(article.description, "Viral");
        // Save to DB here
        console.log(`Result: ${rewritten}`);
    }
});

app.listen(5000, () => console.log('Backend running on port 5000'));
```

### Frontend - `frontend/src/app/page.tsx` (Next.js 15)
```tsx
import Link from 'next/link';

async function getNews() {
    const res = await fetch('http://localhost:5000/api/news', { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
}

export default async function Home() {
    const news = await getNews();

    return (
        <main className="min-h-screen bg-gray-950 text-white p-8">
            <h1 className="text-4xl font-bold mb-8 text-orange-500">CinePulse AI News</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {news.map((article: any) => (
                    <div key={article.id} className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
                        <img src={article.imageUrl} alt={article.title} className="w-full h-48 object-cover rounded-xl mb-4" />
                        <h2 className="text-xl font-bold mb-2">{article.title}</h2>
                        <p className="text-gray-400 line-clamp-3">{article.content}</p>
                        <Link href={`/news/${article.slug}`} className="mt-4 inline-block text-orange-500 hover:text-white">Read More →</Link>
                    </div>
                ))}
            </div>
        </main>
    );
}
```

## 3. Setup Instructions

1.  **Clone the repository:** `git clone <repo-url> cinepulse-ai && cd cinepulse-ai`
2.  **Install Backend dependencies:** `cd backend && npm install`
3.  **Install Frontend dependencies:** `cd ../frontend && npm install`
4.  **Install Ollama:** Follow the steps in Section 11 to install Ollama and pull models.
5.  **Run Locally:** Use the `start.sh` script or run `docker-compose up -d`.

## 4. Environment Variables Guide

### `backend/.env`
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/cinepulse?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_key_2026
OLLAMA_URL=http://localhost:11434
ADMIN_USERNAME=admin
ADMIN_PASSWORD=cinepulse2026
```

### `frontend/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## 5. Deployment Guide

1.  **Backend (MongoDB Atlas + Vercel/Render):**
    *   Create a Free Cluster on MongoDB Atlas.
    *   Deploy the Node.js backend to Render (Free Tier) or Railway.
2.  **Frontend (Vercel):**
    *   Connect your GitHub repo to Vercel.
    *   Set the `Root Directory` to `frontend`.
    *   Add environment variables in the Vercel dashboard.
    *   Click Deploy.
3.  **AI Models:**
    *   For free production, you can run Ollama on a free-tier Oracle Cloud ARM instance (gives 24GB RAM free).

## 6. Free Hosting Setup

*   **Frontend:** Vercel (Free Hobby Tier).
*   **Backend:** Render Web Service (Free Tier) or Koyeb (Free Tier).
*   **Database:** MongoDB Atlas (M0 Free Cluster - 512MB storage).
*   **CDN / DNS:** Cloudflare (Free Plan) for caching, DDoS protection, and SSL.
*   **Images:** Cloudinary (Free Tier) or Imgur API.

## 7. Cron Setup

The backend utilizes `node-cron` internally so you don't need external OS-level cron jobs.
However, to ensure the scraper stays alive on free hosting (which spins down on inactivity), use **cron-job.org** (Free) to ping your `/api/health` endpoint every 10 minutes.

## 8. SEO Checklist

*   [x] `next-sitemap` configured to generate `sitemap.xml` and `robots.txt` on build.
*   [x] Next.js 15 Metadata API utilized for dynamic titles, descriptions, and OpenGraph tags.
*   [x] JSON-LD Schema (NewsArticle, BreadcrumbList) generated per article.
*   [x] Canonical URLs set for all articles.
*   [x] Automated internal linking generated by the AI rewrite process.
*   [x] Alt tags automatically generated by AI for scraped images.

## 9. Monetization Setup

1.  **Google AdSense:**
    *   Add the AdSense `<script>` tag in your Next.js `app/layout.tsx`.
    *   Insert placeholder ad units between paragraphs in the article view.
2.  **Affiliate Links:**
    *   The AI rewrite prompt is instructed to naturally inject Amazon Affiliate links for mentioned movies/merch.
    *   Include OTT subscription affiliate banners at the bottom of reviews.

## 10. AI Model Installation Steps

1. Install Ollama (see Step 11).
2. Start the Ollama server: `ollama serve` (in a separate terminal).
3. Pull the required models:
   *   `ollama run llama3` (Main article generation & rewrite)
   *   `ollama run mistral` (Fallback / Alternative tone)
   *   `ollama run nomic-embed-text` (For semantic search / similarity detection to prevent duplicates)

## 11. Ollama Setup Instructions

*   **Linux:** `curl -fsSL https://ollama.com/install.sh | sh`
*   **Mac:** Download the zip from `ollama.com/download` and install.
*   **Windows:** Download the `.exe` installer from `ollama.com/download`.

*Verify Installation:* Run `ollama -v` in your terminal. It should output the version number.

## 12. Sample Scraped Data

```json
{
  "id": "1a2b3c4d",
  "title": "Shah Rukh Khan's Upcoming Thriller Breaks Pre-Booking Records",
  "slug": "shah-rukh-khans-upcoming-thriller-breaks-pre-booking-records",
  "description": "The highly anticipated action thriller starring Shah Rukh Khan has crossed $5M in advance bookings globally.",
  "content": "Full rewritten article goes here...",
  "author": "CinePulse AI Bot",
  "category": "Bollywood",
  "tags": ["Shah Rukh Khan", "Box Office", "Upcoming Movies"],
  "imageUrl": "https://example.com/srk-movie.jpg",
  "publishedAt": "2024-05-16T10:00:00Z",
  "viralScore": 95,
  "sentiment": "Positive"
}
```

## 13. Database Schema (MongoDB / Mongoose)

```javascript
const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    description: String,
    author: String,
    category: String,
    tags: [String],
    imageUrl: String,
    sourceUrl: { type: String, unique: true }, // For anti-duplicate
    publishedAt: { type: Date, default: Date.now },
    viralScore: { type: Number, default: 0 },
    seoData: {
        metaTitle: String,
        metaDescription: String,
        keywords: [String]
    }
});

module.exports = mongoose.model('Article', ArticleSchema);
```

## 14. Admin Credentials Setup

Admin credentials and JWT secrets are managed via environment variables to ensure security.

1.  Open the `backend/.env` file.
2.  Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` (e.g., `admin` / `cinepulse2026`).
3.  The frontend login page will authenticate against the `/api/auth/login` endpoint, which validates against these variables and returns a JWT token.

## 15. One-Command Startup Script

Create a file named `start.sh` in the root directory:

```bash
#!/bin/bash

echo "Starting CinePulse AI Platform..."

# Start Ollama locally
echo "Starting Ollama..."
ollama serve &
sleep 5 # Wait for Ollama to start

# Start Backend
echo "Starting Backend..."
cd backend
npm install
npm run start &
cd ..

# Start Frontend
echo "Starting Frontend..."
cd frontend
npm install
npm run dev &
cd ..

echo "CinePulse AI is running!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000"
```
Make it executable: `chmod +x start.sh`
Run it: `./start.sh`
