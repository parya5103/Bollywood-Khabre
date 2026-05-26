const express = require('express');
const jwt = require('jsonwebtoken');
const { requireAuth } = require('../config/authMiddleware');
const Article = require('../models/Article');
const { runScrapers } = require('../services/scraperService');

const router = express.Router();

// Simple in-memory rate limiter for login
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_WINDOW = 15 * 60 * 1000; // 15 minutes

// Admin Login
router.post('/login', (req, res) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const attempt = loginAttempts.get(ip) || { count: 0, firstAttempt: now };

    // Check if IP is locked out
    if (attempt.count >= MAX_ATTEMPTS) {
        if (now - attempt.firstAttempt < LOCKOUT_WINDOW) {
            return res.status(429).json({ error: 'Too many login attempts. Please try again later.' });
        }
        // Reset after lockout window
        attempt.count = 0;
        attempt.firstAttempt = now;
    }

    const { username, password } = req.body;

    // Validate inputs
    if (typeof username !== 'string' || typeof password !== 'string') {
        attempt.count++;
        loginAttempts.set(ip, attempt);
        return res.status(400).json({ error: 'Invalid input format' });
    }

    if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD || !process.env.JWT_SECRET) {
        console.error("CRITICAL: Missing admin credentials or JWT secret in environment variables.");
        return res.status(500).json({ error: 'Server configuration error' });
    }

    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        loginAttempts.delete(ip); // Reset attempts on success
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token });
    } else {
        attempt.count++;
        loginAttempts.set(ip, attempt);
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
