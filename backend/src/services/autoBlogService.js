const { rewriteArticle } = require('./aiService');
const Article = require('../models/Article');

async function runAutoBlogMode() {
    console.log("Running Auto Blog Mode...");

    // In a real implementation, we would scrape Google Trends or Reddit here.
    // For this demonstration, we use a static trending topic.
    const trendingTopic = "Shah Rukh Khan's Next Big Movie Announcement";

    const aiData = await rewriteArticle(`Write a comprehensive top 10 explainer blog post about ${trendingTopic}.`, "Cinematic");

    if (aiData) {
        const articleData = {
            title: aiData.headline,
            slug: aiData.headline.toLowerCase().replace(/[^a-z0-9]+/g, "-") + '-' + Math.random().toString(36).substr(2, 5),
            content: aiData.full_article,
            description: aiData.summary,
            category: "Trending",
            tags: aiData.keywords || ["Trending", "AutoBlog"],
            imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728", // Placeholder
            viralScore: aiData.score || 95,
            seoData: {
                metaTitle: aiData.headline,
                metaDescription: aiData.summary,
                keywords: aiData.keywords || []
            }
        };

        try {
            const article = new Article(articleData);
            await article.save();
            console.log(`Auto Blog Created: ${article.title}`);
        } catch (error) {
             console.error("Auto Blog Save Error:", error.message);
        }
    }
}

module.exports = { runAutoBlogMode };
