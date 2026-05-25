const express = require('express');
const jwt = require('jsonwebtoken');
const { requireAuth } = require('../config/authMiddleware');
const Article = require('../models/Article');
const { runScrapers } = require('../services/scraperService');

const router = express.Router();

// Simple in-memory rate limiting
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

// Periodic cleanup to prevent memory leaks
setInterval(() => {
    const now = Date.now();
    for (const [ip, attemptData] of loginAttempts.entries()) {
        if (now - attemptData.firstAttempt > LOCKOUT_TIME) {
            loginAttempts.delete(ip);
        }
    }
}, LOCKOUT_TIME);

// Admin Login
router.post('/login', (req, res) => {
    const ip = req.ip;
    const now = Date.now();
    const attemptData = loginAttempts.get(ip) || { count: 0, firstAttempt: now };

    if (now - attemptData.firstAttempt > LOCKOUT_TIME) {
        attemptData.count = 0;
        attemptData.firstAttempt = now;
    }

    if (attemptData.count >= MAX_ATTEMPTS) {
        return res.status(429).json({ error: 'Too many login attempts. Please try again later.' });
    }

    const { username, password } = req.body;

    if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD || !process.env.JWT_SECRET) {
        console.error("CRITICAL: Missing admin credentials or JWT secret in environment variables.");
        return res.status(500).json({ error: 'Server configuration error' });
    }

    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        loginAttempts.delete(ip); // Reset on success
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token });
    } else {
        attemptData.count++;
        loginAttempts.set(ip, attemptData);
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
