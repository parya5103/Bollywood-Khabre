const express = require('express');
const Article = require('../models/Article');
const router = express.Router();

// Escapes special characters for use in a regular expression
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

router.get('/', async (req, res) => {
    try {
        const { category, q, limit = 50 } = req.query;
        let query = {};

        if (category && category !== 'trending' && category !== 'home') {
            const escapedCategory = escapeRegex(category);
            query.category = new RegExp(`^${escapedCategory}$`, 'i');
        }

        if (q) {
            const escapedQ = escapeRegex(q);
            query.$or = [
                { title: new RegExp(escapedQ, 'i') },
                { tags: new RegExp(escapedQ, 'i') }
            ];
        }

        let articles = await Article.find(query).sort({ publishedAt: -1 }).limit(Number(limit));

        if (category === 'trending') {
             articles = await Article.find().sort({ viralScore: -1 }).limit(Number(limit));
        }

        res.json(articles);
    } catch (error) {
        console.error("Error fetching news:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/:slug', async (req, res) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug });
        if (!article) return res.status(404).json({ error: 'Not found' });
        res.json(article);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
