const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Article = require('./Article');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Article.deleteMany({});
});

describe('Article Model - Input Length Constraints', () => {
  it('should create an article with valid length inputs', async () => {
    const validArticle = new Article({
      title: 'Valid Title',
      slug: 'valid-slug',
      content: 'Valid content that is not too long.',
      description: 'A brief description',
      author: 'Author Name',
      category: 'News',
      tags: ['tag1', 'tag2'],
      imageUrl: 'http://example.com/image.jpg',
      sourceUrl: 'http://example.com/source',
      seoData: {
        metaTitle: 'Meta Title',
        metaDescription: 'Meta Description',
        keywords: ['keyword1']
      }
    });

    const savedArticle = await validArticle.save();
    expect(savedArticle._id).toBeDefined();
  });

  it('should fail validation if title exceeds maxlength of 500', async () => {
    const article = new Article({
      title: 'a'.repeat(501),
      slug: 'slug',
      content: 'content'
    });

    let error;
    try {
      await article.validate();
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.errors.title).toBeDefined();
    expect(error.errors.title.kind).toBe('maxlength');
  });

  it('should fail validation if slug exceeds maxlength of 500', async () => {
    const article = new Article({
      title: 'title',
      slug: 'a'.repeat(501),
      content: 'content'
    });

    let error;
    try {
      await article.validate();
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.errors.slug).toBeDefined();
    expect(error.errors.slug.kind).toBe('maxlength');
  });

  it('should fail validation if content exceeds maxlength of 50000', async () => {
    const article = new Article({
      title: 'title',
      slug: 'slug',
      content: 'a'.repeat(50001)
    });

    let error;
    try {
      await article.validate();
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.errors.content).toBeDefined();
    expect(error.errors.content.kind).toBe('maxlength');
  });

  it('should fail validation if description exceeds maxlength of 2000', async () => {
    const article = new Article({
      title: 'title',
      slug: 'slug',
      content: 'content',
      description: 'a'.repeat(2001)
    });

    let error;
    try {
      await article.validate();
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.errors.description).toBeDefined();
    expect(error.errors.description.kind).toBe('maxlength');
  });
});
