const express = require('express');
const Article = require('../models/Article');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { category, q, limit = 50 } = req.query;
        let query = {};

        // 🛡️ Sentinel: Enforce string types and escape RegExp characters to prevent ReDoS and NoSQL Injection
        if (category && typeof category === 'string' && category !== 'trending' && category !== 'home') {
            const safeCategory = category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            query.category = new RegExp(`^${safeCategory}$`, 'i');
        }

        // 🛡️ Sentinel: Enforce string types and escape RegExp characters to prevent ReDoS and NoSQL Injection
        if (q && typeof q === 'string') {
            const safeQ = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            query.$or = [
                { title: new RegExp(safeQ, 'i') },
                { tags: new RegExp(safeQ, 'i') }
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
