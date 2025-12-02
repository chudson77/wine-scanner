import React, { useState } from 'react';
import { Star, DollarSign, MapPin, Wine, Share2, MessageSquarePlus, Check } from 'lucide-react';
import { clsx } from 'clsx';
import { saveReview } from '../services/reviewService';

export function WineCard({ wine, onReset }) {
    const [isReviewing, setIsReviewing] = useState(false);
    const [userRating, setUserRating] = useState(5);
    const [userNotes, setUserNotes] = useState('');
    const [saved, setSaved] = useState(false);

    if (!wine) return null;

    const handleShare = async () => {
        const shareData = {
            title: `Review: ${wine.name}`,
            text: `🍷 I just tried ${wine.name} (${wine.region})!\n\nMy Rating: ${userRating}/5\nPrice: £${wine.price.value}\n\n${userNotes || wine.review}`,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback for desktop/unsupported
            navigator.clipboard.writeText(shareData.text);
            alert('Review copied to clipboard!');
        }
    };

    const handleSaveReview = () => {
        saveReview(wine, userRating, userNotes);
        setSaved(true);
        setIsReviewing(false);
        // Reset after a delay so they can review again if needed, or just keep it saved state
        setTimeout(() => setSaved(false), 3000);
    };

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
                        Sommelier's Notes
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {wine.review}
                    </p>
                </div>

                {wine.scannedText && (
                    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                            Detected Text (OCR)
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-300 font-mono break-words">
                            {wine.scannedText}
                        </p>
                    </div>
                )}

                {/* User Review Section */}
                <div className="mb-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                    {!isReviewing && !saved ? (
                        <button
                            onClick={() => setIsReviewing(true)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            <MessageSquarePlus className="w-5 h-5" />
                            Add Personal Review
                        </button>
                    ) : saved ? (
                        <div className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl font-medium animate-in fade-in">
                            <Check className="w-5 h-5" />
                            Review Saved!
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Your Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setUserRating(star)}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={clsx(
                                                    "w-8 h-8",
                                                    star <= userRating
                                                        ? "text-yellow-400 fill-yellow-400"
                                                        : "text-gray-300 dark:text-gray-600"
                                                )}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Your Notes</label>
                                <textarea
                                    value={userNotes}
                                    onChange={(e) => setUserNotes(e.target.value)}
                                    placeholder="What did you think? (e.g., Great with steak!)"
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-wine-500"
                                    rows={3}
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSaveReview}
                                    className="flex-1 py-2 bg-wine-600 text-white rounded-xl font-medium hover:bg-wine-700 transition-colors"
                                >
                                    Save Review
                                </button>
                                <button
                                    onClick={() => setIsReviewing(false)}
                                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-700">
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Estimated Price</p>
                        <div className="flex items-center text-xl font-bold text-gray-900 dark:text-white">
                            <span className="text-green-500 mr-1">£</span>
                            {wine.price.value.toLocaleString()}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleShare}
                            className="p-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            title="Share with friends"
                        >
                            <Share2 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={onReset}
                            className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                        >
                            Scan Another
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
