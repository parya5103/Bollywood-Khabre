const express = require('express');
const jwt = require('jsonwebtoken');
const { rateLimit } = require('express-rate-limit');
const { requireAuth } = require('../config/authMiddleware');
const Article = require('../models/Article');
const { runScrapers } = require('../services/scraperService');

const router = express.Router();

// Rate limiter for admin login to prevent brute-force attacks
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
    message: { error: 'Too many login attempts from this IP, please try again after 15 minutes' },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Admin Login
router.post('/login', loginLimiter, (req, res) => {
    const { username, password } = req.body;

    if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD || !process.env.JWT_SECRET) {
        console.error("CRITICAL: Missing admin credentials or JWT secret in environment variables.");
        return res.status(500).json({ error: 'Server configuration error' });
    }

    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '24h' });
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
