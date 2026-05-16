const express = require('express');
const jwt = require('jsonwebtoken');
const { requireAuth } = require('../config/authMiddleware');
const Article = require('../models/Article');
const { runScrapers } = require('../services/scraperService');

const router = express.Router();

// Admin Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // In production, validate against process.env.ADMIN_USERNAME and process.env.ADMIN_PASSWORD
    if (username === (process.env.ADMIN_USERNAME || 'admin') && password === (process.env.ADMIN_PASSWORD || 'cinepulse2026')) {
        const token = jwt.sign({ username }, process.env.JWT_SECRET || 'super_secret_jwt_key_2026', { expiresIn: '24h' });
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Admin Dashboard Stats
router.get('/stats', requireAuth, async (req, res) => {
    try {
        const totalArticles = await Article.countDocuments();
        res.json({ totalArticles });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

// Manual Scraper Trigger
router.post('/trigger-scrape', requireAuth, async (req, res) => {
    // Run scraper in the background
    runScrapers().catch(console.error);
    res.json({ message: 'Scraping triggered manually.' });
});

module.exports = router;
