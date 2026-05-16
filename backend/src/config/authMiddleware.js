const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    if (!process.env.JWT_SECRET) {
        console.error("CRITICAL: Missing JWT secret in environment variables.");
        return res.status(500).json({ error: 'Server configuration error' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Forbidden: Invalid token' });
    }
}

module.exports = { requireAuth };
