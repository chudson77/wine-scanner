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
                <div className="bg-gray-100 dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wine className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No reviews yet</h3>
                <p className="text-gray-500 dark:text-gray-400">Scan a wine to add your first review!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            {reviews.map((review) => (
                <div key={review.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4">
                    {/* Thumbnail (if we had images, for now just an icon or placeholder) */}
                    <div className="flex-shrink-0 w-16 h-16 bg-wine-100 dark:bg-wine-900/30 rounded-xl flex items-center justify-center">
                        <Wine className="w-8 h-8 text-wine-600 dark:text-wine-400" />
                    </div>

                    <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white truncate pr-2">
                                    {review.wine.name}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                    {review.wine.region} • {review.wine.type}
                                </p>
                            </div>
                            <button
                                onClick={() => handleDelete(review.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex items-center gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-3 h-3 ${star <= review.rating
                                            ? "text-yellow-400 fill-yellow-400"
                                            : "text-gray-300 dark:text-gray-600"
                                        }`}
                                />
                            ))}
                            <span className="text-xs text-gray-400 ml-2 flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(review.date).toLocaleDateString()}
                            </span>
                        </div>

                        {review.notes && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg italic">
                                "{review.notes}"
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
