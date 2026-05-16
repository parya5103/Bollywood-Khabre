require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cron = require('node-cron');
const newsRoutes = require('./src/routes/newsRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const { runScrapers } = require('./src/services/scraperService');
const { runAutoBlogMode } = require('./src/services/autoBlogService');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/news', newsRoutes);
app.use('/api/admin', adminRoutes);
app.get('/api/health', (req, res) => res.json({ status: 'online' }));

// Database connection
async function connectDB() {
    try {
        if (process.env.NODE_ENV !== 'production' && !process.env.MONGODB_URI) {
            console.log('No MONGODB_URI provided and not in production. Using MongoMemoryServer...');
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongoServer = await MongoMemoryServer.create();
            const mongoUri = mongoServer.getUri();
            await mongoose.connect(mongoUri);
            console.log(`Connected to MongoDB Memory Server at ${mongoUri}`);
        } else {
            const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cinepulse';
            await mongoose.connect(MONGODB_URI);
            console.log('Connected to MongoDB');
        }
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
}
connectDB();

// Scheduled jobs
cron.schedule('*/30 * * * *', async () => {
    console.log('Running scheduled scraper...');
    await runScrapers();
});

// Auto Blog Mode (Runs once a day)
cron.schedule('0 12 * * *', async () => {
    console.log('Running Auto Blog Generator...');
    await runAutoBlogMode();
});

app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
    // Run initial scrape immediately in dev or if required
    setTimeout(runScrapers, 5000);
});
