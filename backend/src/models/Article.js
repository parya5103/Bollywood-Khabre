const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    description: String,
    author: { type: String, default: 'CinePulse AI Bot' },
    category: { type: String, default: 'News' },
    tags: [String],
    imageUrl: String,
    sourceUrl: { type: String, unique: true, sparse: true }, // For anti-duplicate
    publishedAt: { type: Date, default: Date.now },
    viralScore: { type: Number, default: 0 },
    seoData: {
        metaTitle: String,
        metaDescription: String,
        keywords: [String]
    }
});

// Indexes for faster querying
ArticleSchema.index({ publishedAt: -1 });
ArticleSchema.index({ viralScore: -1 });
ArticleSchema.index({ category: 1, publishedAt: -1 });

module.exports = mongoose.model('Article', ArticleSchema);
