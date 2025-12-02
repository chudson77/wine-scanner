import React, { useState, useEffect } from 'react';
import { Star, Trash2, Calendar, Wine } from 'lucide-react';
import { getReviews, deleteReview } from '../services/reviewService';

export function ReviewList() {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        setReviews(getReviews());
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            const updated = deleteReview(id);
            setReviews(updated);
        }
    };

    if (reviews.length === 0) {
        return (
            <div className="text-center py-12 animate-in fade-in">
                <div className="bg-stone-100 dark:bg-stone-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Wine className="w-10 h-10 text-stone-300" />
                </div>
                <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-2">No reviews yet</h3>
                <p className="text-stone-500 dark:text-stone-400">Scan a wine to add your first review!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            {reviews.map((review) => (
                <div key={review.id} className="bg-white dark:bg-stone-800 rounded-3xl p-5 shadow-sm border border-stone-100 dark:border-stone-700 flex gap-5">
                    {/* Thumbnail (if we had images, for now just an icon or placeholder) */}
                    <div className="flex-shrink-0 w-16 h-16 bg-sage-50 dark:bg-sage-900/30 rounded-2xl flex items-center justify-center border border-sage-100 dark:border-sage-800">
                        <Wine className="w-8 h-8 text-sage-600 dark:text-sage-400" />
                    </div>

                    <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-stone-900 dark:text-white truncate pr-2 text-lg font-serif">
                                    {review.wine.name}
                                </h3>
                                <p className="text-xs text-stone-500 dark:text-stone-400 mb-2 font-medium uppercase tracking-wide">
                                    {review.wine.region} • {review.wine.type}
                                </p>
                            </div>
                            <button
                                onClick={() => handleDelete(review.id)}
                                className="text-stone-300 hover:text-red-500 transition-colors p-1"
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
    );
}

export default ReviewList;
