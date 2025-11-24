import React from 'react';
import { Star, DollarSign, MapPin, Wine } from 'lucide-react';
import { clsx } from 'clsx';

export function WineCard({ wine, onReset }) {
    if (!wine) return null;

    return (
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="relative h-64 bg-gray-100 dark:bg-gray-700">
                <img
                    src={wine.image}
                    alt={wine.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-sm">{wine.rating}</span>
                </div>
            </div>

            <div className="p-6 text-left">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight mb-1">
                            {wine.name}
                        </h2>
                        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                            <MapPin className="w-3 h-3 mr-1" />
                            {wine.region}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 mb-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-wine-100 text-wine-800 dark:bg-wine-900 dark:text-wine-200">
                        <Wine className="w-3 h-3 mr-1" />
                        {wine.type}
                    </span>
                </div>

                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2">
                        Review
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {wine.review}
                    </p>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-700">
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Estimated Price</p>
                        <div className="flex items-center text-xl font-bold text-gray-900 dark:text-white">
                            <DollarSign className="w-5 h-5 text-green-500" />
                            {wine.price.value.toLocaleString()}
                        </div>
                    </div>

                    <button
                        onClick={onReset}
                        className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                    >
                        Scan Another
                    </button>
                </div>
            </div>
        </div>
    );
}
