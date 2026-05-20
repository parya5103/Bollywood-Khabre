const { scrapePinkvilla, scrapeRSS } = require('../scrapers');
const { rewriteArticle } = require('./aiService');
const Article = require('../models/Article');

const RSS_SOURCES = [
    { url: "https://news.google.com/rss/search?q=bollywood+news&hl=en-IN&gl=IN&ceid=IN:en", category: "Bollywood" },
    { url: "https://news.google.com/rss/search?q=hollywood+news&hl=en-US&gl=US&ceid=US:en", category: "Hollywood" },
    { url: "https://www.bollywoodhungama.com/rss/news.xml", category: "Bollywood" },
    { url: "https://variety.com/feed/", category: "Hollywood" }
];

async function processAndSaveArticle(rawArticle, skipDuplicateCheck = false) {
    try {
        if (!skipDuplicateCheck) {
            const exists = await Article.findOne({ sourceUrl: rawArticle.link });
            if (exists) return; // Skip duplicates
        }

        let aiData = await rewriteArticle(rawArticle.description || rawArticle.title, "Viral");

        let articleData = {
            title: aiData ? aiData.headline : rawArticle.title,
            slug: (aiData ? aiData.headline : rawArticle.title).toLowerCase().replace(/[^a-z0-9]+/g, "-") + '-' + Math.random().toString(36).substr(2, 5),
            content: aiData ? aiData.full_article : (rawArticle.description || "Content unavailable"),
            description: aiData ? aiData.summary : rawArticle.description,
            category: rawArticle.category,
            tags: aiData ? aiData.keywords : [],
            imageUrl: rawArticle.imageUrl || "https://images.unsplash.com/photo-1485846234645-a62644f84728",
            sourceUrl: rawArticle.link,
            viralScore: aiData ? aiData.score : Math.floor(Math.random() * 100),
            seoData: {
                metaTitle: aiData ? aiData.headline : rawArticle.title,
                metaDescription: aiData ? aiData.summary : (rawArticle.description || "").substring(0, 160),
                keywords: aiData ? aiData.keywords : []
            }
        };

        const article = new Article(articleData);
        await article.save();
        console.log(`Saved new article: ${article.title}`);

        // Trigger social automation
        const { runSocialAutomation } = require('./socialAutomation');
        await runSocialAutomation(articleData);
    } catch (error) {
        console.error(`Error saving article ${rawArticle.link}:`, error.message);
    }
}

async function runScrapers() {
    console.log("Starting full scrape cycle...");
    let allRawArticles = [];

    // Run RSS scrapers
    for (const source of RSS_SOURCES) {
        const items = await scrapeRSS(source.url, source.category);
        allRawArticles = allRawArticles.concat(items);
    }

    // Fetch all existing URLs to prevent N+1 query issue
    const validArticles = allRawArticles.filter(a => a.title && a.link);
    const sourceUrls = validArticles.map(a => a.link);
    const existingArticles = await Article.find({ sourceUrl: { $in: sourceUrls } }).select('sourceUrl').lean();
    const existingUrlSet = new Set(existingArticles.map(a => a.sourceUrl));

    // Process articles sequentially to not overload Ollama
    for (const rawArticle of validArticles) {
        if (existingUrlSet.has(rawArticle.link)) continue;

        // Add to set to prevent processing duplicates within the same batch
        existingUrlSet.add(rawArticle.link);

        await processAndSaveArticle(rawArticle, true);
    }
    console.log("Scrape cycle complete.");
}

module.exports = { runScrapers };
