const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
    title: { type: String, required: true, maxlength: 500 },
    slug: { type: String, required: true, unique: true, maxlength: 500 },
    content: { type: String, required: true, maxlength: 50000 },
    description: { type: String, maxlength: 2000 },
    author: { type: String, default: 'CinePulse AI Bot', maxlength: 200 },
    category: { type: String, default: 'News', maxlength: 100 },
    tags: [{ type: String, maxlength: 100 }],
    imageUrl: { type: String, maxlength: 2048 },
    sourceUrl: { type: String, unique: true, sparse: true, maxlength: 2048 }, // For anti-duplicate
    publishedAt: { type: Date, default: Date.now },
    viralScore: { type: Number, default: 0 },
    seoData: {
        metaTitle: { type: String, maxlength: 500 },
        metaDescription: { type: String, maxlength: 2000 },
        keywords: [{ type: String, maxlength: 100 }]
    }
});

// Indexes for faster querying
ArticleSchema.index({ publishedAt: -1 });
ArticleSchema.index({ viralScore: -1 });
ArticleSchema.index({ category: 1, publishedAt: -1 });

module.exports = mongoose.model('Article', ArticleSchema);
