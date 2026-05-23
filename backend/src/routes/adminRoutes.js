const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { requireAuth } = require('../config/authMiddleware');
const Article = require('../models/Article');
const { runScrapers } = require('../services/scraperService');

const router = express.Router();

// Admin Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Validate inputs to prevent NoSQL injection or object type issues
    if (typeof username !== 'string' || typeof password !== 'string') {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD || !process.env.JWT_SECRET) {
        console.error("CRITICAL: Missing admin credentials or JWT secret in environment variables.");
        return res.status(500).json({ error: 'Server configuration error' });
    }

    // Use timingSafeEqual to prevent timing attacks
    const envUserBuffer = Buffer.from(process.env.ADMIN_USERNAME);
    const envPassBuffer = Buffer.from(process.env.ADMIN_PASSWORD);
    const reqUserBuffer = Buffer.from(username);
    const reqPassBuffer = Buffer.from(password);

    // Ensure buffers are of the same length before comparing
    const isUserEqual = envUserBuffer.length === reqUserBuffer.length && crypto.timingSafeEqual(envUserBuffer, reqUserBuffer);
    const isPassEqual = envPassBuffer.length === reqPassBuffer.length && crypto.timingSafeEqual(envPassBuffer, reqPassBuffer);

    if (isUserEqual && isPassEqual) {
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
