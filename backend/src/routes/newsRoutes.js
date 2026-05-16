const express = require('express');
const Article = require('../models/Article');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { category, q, limit = 50 } = req.query;
        let query = {};

        if (category && category !== 'trending' && category !== 'home') {
            query.category = new RegExp(`^${category}$`, 'i');
        }

        if (q) {
            query.$or = [
                { title: new RegExp(q, 'i') },
                { tags: new RegExp(q, 'i') }
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
