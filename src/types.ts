export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  category: "Bollywood" | "Hollywood" | "Trending" | "Reviews";
  tags: string[];
  imageUrl: string;
  publishedAt: string;
  slug: string;
  viralScore: number;
  seoData?: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

export interface UserPreferences {
  favoriteActors: string[];
  favoriteDirectors: string[];
  preferredCategories: string[];
  language: string;
  darkMode: boolean;
}
