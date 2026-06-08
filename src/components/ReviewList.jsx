import React, { useState, useEffect } from 'react';
import { Star, Trash2, Calendar, Download, Search } from 'lucide-react';
import { getReviews, deleteReview, exportReviews } from '../services/reviewService';
import WineImage from './WineImage';
import ConfirmDialog from './ConfirmDialog';
import WineDetailSheet from './WineDetailSheet';

const TYPES = ['All', 'Red', 'White', 'Sparkling', 'Rosé', 'Dessert', 'Fortified'];

export function ReviewList() {
    const [reviews, setReviews] = useState([]);
    const [confirmId, setConfirmId] = useState(null);
    const [detailReview, setDetailReview] = useState(null);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [minRating, setMinRating] = useState(0);

    useEffect(() => { setReviews(getReviews()); }, []);

    const handleDelete = async () => {
        const updated = await deleteReview(confirmId);
        setReviews(updated);
        setConfirmId(null);
    };

    const handleExport = () => {
        const data = exportReviews();
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'wine-reviews.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const filtered = reviews.filter(r => {
        const matchType = typeFilter === 'All' || r.wine.type === typeFilter;
        const matchRating = r.rating >= minRating;
        const matchSearch = !search ||
            r.wine.name.toLowerCase().includes(search.toLowerCase()) ||
            r.wine.region.toLowerCase().includes(search.toLowerCase());
        return matchType && matchRating && matchSearch;
    });

    if (reviews.length === 0) {
        return (
            <div className="text-center py-12 animate-in fade-in">
                <div className="bg-stone-100 dark:bg-stone-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Star className="w-10 h-10 text-stone-300" />
                </div>
                <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-2">No reviews yet</h3>
                <p className="text-stone-500 dark:text-stone-400">Scan a wine to add your first review!</p>
            </div>
        );
    }

    return (
        <>
            <div className="flex justify-end mb-4">
                <button
                    onClick={handleExport}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-2xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 transition-colors"
                >
                    <Download className="w-3.5 h-3.5" />
                    Export JSON
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by name or region…"
                    className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-500 transition-all"
                />
            </div>

            {/* Type filter pills */}
            <div className="flex gap-2 flex-wrap mb-3">
                {TYPES.map(t => (
                    <button
                        key={t}
                        onClick={() => setTypeFilter(t)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                            typeFilter === t
                                ? 'bg-sage-600 text-white'
                                : 'bg-white dark:bg-stone-800 text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-700'
                        }`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* Min rating filter */}
            <div className="flex items-center gap-2 mb-5">
                <span className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">Min Rating</span>
                <div className="flex gap-1">
                    {[0, 1, 2, 3, 4, 5].map(n => (
                        <button
                            key={n}
                            onClick={() => setMinRating(n)}
                            className={`w-7 h-7 rounded-full text-xs font-bold transition-colors ${
                                minRating === n
                                    ? 'bg-terracotta-500 text-white'
                                    : 'bg-white dark:bg-stone-800 text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-700'
                            }`}
                        >
                            {n === 0 ? 'All' : `${n}★`}
                        </button>
                    ))}
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-8 text-stone-400 dark:text-stone-500 text-sm">
                    No reviews match your filters.
                </div>
            ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 pb-24">
                    {filtered.map((review) => (
                        <div key={review.id} className="bg-white dark:bg-stone-800 rounded-3xl p-5 shadow-sm border border-stone-100 dark:border-stone-700 flex gap-4 cursor-pointer active:scale-[0.99] transition-transform" onClick={() => setDetailReview(review)}>
                            <div className="flex-shrink-0 w-16 h-16 bg-sage-50 dark:bg-sage-900/30 rounded-2xl overflow-hidden border border-sage-100 dark:border-sage-800">
                                <WineImage imageId={review.wine.imageId} name={review.wine.name} />
                            </div>

                            <div className="flex-grow min-w-0">
                                <div className="flex justify-between items-start">
                                    <div className="min-w-0 pr-2">
                                        <h3 className="font-bold text-stone-900 dark:text-white truncate text-lg font-serif">
                                            {review.wine.name}
                                        </h3>
                                        <p className="text-xs text-stone-500 dark:text-stone-400 mb-2 font-medium uppercase tracking-wide truncate">
                                            {review.wine.vintage ? `${review.wine.vintage} · ` : ''}{review.wine.region} · {review.wine.type}
                                        </p>
                                    </div>
                                    <button
                                        onClick={e => { e.stopPropagation(); setConfirmId(review.id); }}
                                        className="text-stone-300 hover:text-red-500 transition-colors p-1 flex-shrink-0"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex items-center gap-1 mb-3">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-3.5 h-3.5 ${star <= review.rating
                                                ? "text-terracotta-400 fill-terracotta-400"
                                                : "text-stone-200 dark:text-stone-700"
                                            }`}
                                        />
                                    ))}
                                    <span className="text-xs text-stone-400 ml-2 flex items-center font-medium">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {new Date(review.date).toLocaleDateString()}
                                    </span>
                                </div>

                                {review.notes && (
                                    <p className="text-sm text-stone-600 dark:text-stone-300 bg-stone-50 dark:bg-stone-900/50 p-3 rounded-xl italic border border-stone-100 dark:border-stone-800">
                                        "{review.notes}"
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {confirmId && (
                <ConfirmDialog
                    message="Delete this review permanently?"
                    onConfirm={handleDelete}
                    onCancel={() => setConfirmId(null)}
                />
            )}

            {detailReview && (
                <WineDetailSheet review={detailReview} onClose={() => setDetailReview(null)} />
            )}
        </>
    );
}

export default ReviewList;
