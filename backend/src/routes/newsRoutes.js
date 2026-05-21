const express = require('express');
const Article = require('../models/Article');
const router = express.Router();

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

router.get('/', async (req, res) => {
    try {
        const { category, q } = req.query;
        let limit = parseInt(req.query.limit, 10);
        if (isNaN(limit) || limit < 1) {
            limit = 50;
        } else if (limit > 100) {
            limit = 100;
        }

        let query = {};

        if (category && category !== 'trending' && category !== 'home') {
            const escapedCategory = escapeRegExp(category);
            query.category = new RegExp(`^${escapedCategory}$`, 'i');
        }

        if (q) {
            const escapedQ = escapeRegExp(q);
            query.$or = [
                { title: new RegExp(escapedQ, 'i') },
                { tags: new RegExp(escapedQ, 'i') }
            ];
        }

        // ⚡ Bolt: Added .lean() to bypass document instantiation for read-only query
        let articles = await Article.find(query).sort({ publishedAt: -1 }).limit(limit).lean();

        if (category === 'trending') {
             // ⚡ Bolt: Added .lean() to bypass document instantiation for read-only query
             articles = await Article.find().sort({ viralScore: -1 }).limit(limit).lean();
        }

        res.json(articles);
    } catch (error) {
        console.error("Error fetching news:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/:slug', async (req, res) => {
    try {
        // ⚡ Bolt: Added .lean() to bypass document instantiation for read-only query
        const article = await Article.findOne({ slug: req.params.slug }).lean();
        if (!article) return res.status(404).json({ error: 'Not found' });
        res.json(article);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
