export default function AdSensePlaceholder() {
    return (
        <div className="w-full my-8 bg-slate-800/50 border border-slate-700 border-dashed rounded-lg flex items-center justify-center min-h-[100px] text-slate-500 text-sm">
            [Google AdSense Placeholder]
        </div>
    );
}

export function AffiliateWidget() {
    return (
        <div className="w-full my-6 bg-orange-900/20 border border-orange-500/30 rounded-xl p-6 flex items-center justify-between">
            <div>
                <h4 className="font-bold text-orange-500 mb-1">Recommended Movie Merch</h4>
                <p className="text-sm text-slate-400">Get the latest gear on Amazon.</p>
            </div>
            <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-sm">
                Shop Now
            </button>
        </div>
    );
}
