

import AdSensePlaceholder, { AffiliateWidget } from '@/components/Monetization';

async function getNews() {
    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${API_URL}/news`, { cache: 'no-store' });
        if (!res.ok) return [];
        return await res.json();
    } catch (error) {
        console.error("Error fetching news:", error);
        return [];
    }
}

export default async function Home() {
    const news = await getNews();

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-10">
                <h2 className="text-4xl font-bold mb-4">Latest Top Stories</h2>
                <p className="text-slate-400">Autonomously curated and rewritten by AI.</p>
            </div>

            <AdSensePlaceholder />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {news.length === 0 && (
                    <div className="col-span-full py-20 text-center text-slate-500">
                        No articles found. Make sure the backend is running and the scrapers have successfully run.
                    </div>
                )}
                {news.map((article: { slug: string; imageUrl?: string; title: string; category: string; description: string; viralScore: number }) => (
                    <div key={article.slug} className="bg-slate-900 rounded-3xl overflow-hidden border border-white/5 hover:border-orange-500/50 transition-colors flex flex-col">
                        {article.imageUrl && (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={article.imageUrl} alt={article.title} className="w-full h-48 object-cover" />
                        )}
                        <div className="p-6 flex flex-col flex-1">
                            <div className="text-xs font-bold text-orange-500 mb-3 uppercase tracking-wider">{article.category}</div>
                            <h3 className="text-xl font-bold mb-3">{article.title}</h3>
                            <p className="text-slate-400 text-sm mb-6 line-clamp-3 flex-1">{article.description}</p>

                            <div className="flex items-center justify-between mt-auto">
                                <span className="text-xs text-slate-500">Viral Score: {article.viralScore}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <AffiliateWidget />
        </div>
    );
}
