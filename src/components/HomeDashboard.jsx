import React, { useEffect, useState } from 'react';
import { Wine, List, Camera, ArrowRight } from 'lucide-react';
import { getReviews, getCellarWines } from '../services/reviewService';

const HomeDashboard = ({ onViewChange }) => {
    const [stats, setStats] = useState({ reviews: 0, cellar: 0 });

    useEffect(() => {
        setStats({
            reviews: getReviews().length,
            cellar: getCellarWines().length
        });
    }, []);

    return (
        <div className="w-full max-w-md mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center py-6">
                <h2 className="text-3xl font-bold text-stone-800 dark:text-stone-100 font-serif mb-2">
                    Welcome Back
                </h2>
                <p className="text-stone-500 dark:text-stone-400">
                    Your personal wine journey continues.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div
                    onClick={() => onViewChange('cellar')}
                    className="bg-white dark:bg-stone-800 p-5 rounded-3xl border border-stone-100 dark:border-stone-700 shadow-sm cursor-pointer hover:shadow-md transition-all group"
                >
                    <div className="w-10 h-10 bg-terracotta-50 dark:bg-terracotta-900/20 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Wine className="w-5 h-5 text-terracotta-500" />
                    </div>
                    <p className="text-3xl font-bold text-stone-800 dark:text-stone-100 mb-1">
                        {stats.cellar}
                    </p>
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                        In Cellar
                    </p>
                </div>

                <div
                    onClick={() => onViewChange('reviews')}
                    className="bg-white dark:bg-stone-800 p-5 rounded-3xl border border-stone-100 dark:border-stone-700 shadow-sm cursor-pointer hover:shadow-md transition-all group"
                >
                    <div className="w-10 h-10 bg-sage-50 dark:bg-sage-900/20 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <List className="w-5 h-5 text-sage-600" />
                    </div>
                    <p className="text-3xl font-bold text-stone-800 dark:text-stone-100 mb-1">
                        {stats.reviews}
                    </p>
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                        Total Reviews
                    </p>
                </div>
            </div>

            <button
                onClick={() => onViewChange('scan')}
                className="w-full bg-stone-900 dark:bg-white text-white dark:text-stone-900 p-6 rounded-3xl shadow-xl flex items-center justify-between group hover:scale-[1.02] transition-transform"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 dark:bg-black/10 rounded-2xl flex items-center justify-center">
                        <Camera className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                        <p className="font-bold text-lg">Scan a Wine</p>
                        <p className="text-sm opacity-70">Identify & Review</p>
                    </div>
                </div>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
};

export default HomeDashboard;
