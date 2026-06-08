import React, { useState } from 'react';
import { Star, MapPin, Wine, Share2, MessageSquarePlus, Check, UtensilsCrossed } from 'lucide-react';
import { clsx } from 'clsx';
import { saveReview } from '../services/reviewService';
import WineImage from './WineImage';

export function WineCard({ wine, onReset }) {
    const [isReviewing, setIsReviewing] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [userNotes, setUserNotes] = useState('');
    const [inCellar, setInCellar] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [saved, setSaved] = useState(false);
    const [ratingError, setRatingError] = useState(false);

    if (!wine) return null;

    const handleShare = async () => {
        const text = `I just scanned ${wine.name} (${wine.region}) with SommelierAI!\n\nMy Rating: ${userRating}/5${userNotes ? `\nNotes: ${userNotes}` : ''}\n\n${wine.review}`;
        if (navigator.share) {
            try {
                await navigator.share({ title: `Review: ${wine.name}`, text, url: window.location.href });
            } catch (err) {
                if (err.name !== 'AbortError') console.error('Share error:', err);
            }
        } else {
            navigator.clipboard?.writeText(text);
        }
    };

    const handleSaveReview = () => {
        if (userRating === 0) {
            setRatingError(true);
            return;
        }
        setRatingError(false);
        saveReview(wine, userRating, userNotes, inCellar, quantity);
        setSaved(true);
        setIsReviewing(false);
    };

    return (
        <div className="w-full max-w-md bg-white dark:bg-stone-800 rounded-4xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 border border-stone-100 dark:border-stone-700 mb-24">
            <div className="relative h-72 bg-stone-100 dark:bg-stone-700">
                <WineImage imageId={wine.imageId} name={wine.name} />
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                    <Star className="w-4 h-4 text-terracotta-500 fill-terracotta-500" />
                    <span className="font-bold text-sm text-stone-800 dark:text-stone-100">{wine.rating}</span>
                </div>
            </div>

            <div className="p-8 text-left">
                <div className="mb-3">
                    <h2 className="text-3xl font-bold text-stone-800 dark:text-stone-100 leading-tight mb-2 font-serif tracking-tight">
                        {wine.name}
                    </h2>
                    <div className="flex items-center text-stone-500 dark:text-stone-400 text-sm font-medium">
                        <MapPin className="w-4 h-4 mr-1.5 text-sage-500" />
                        {wine.region}
                    </div>
                </div>

                <div className="flex items-center gap-2 mb-8">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-sage-50 text-sage-700 dark:bg-sage-900/30 dark:text-sage-300 border border-sage-100 dark:border-sage-800">
                        <Wine className="w-3 h-3 mr-1.5" />
                        {wine.type}
                    </span>
                </div>

                <div className="mb-8">
                    <h3 className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-3">
                        Sommelier's Notes
                    </h3>
                    <p className="text-stone-600 dark:text-stone-300 text-base leading-relaxed font-light">
                        {wine.review}
                    </p>
                </div>

                {wine.foodPairings?.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                            <UtensilsCrossed className="w-3 h-3" />
                            Food Pairings
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {wine.foodPairings.map((food, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-1 bg-terracotta-50 dark:bg-terracotta-900/20 text-terracotta-700 dark:text-terracotta-300 text-xs rounded-full border border-terracotta-100 dark:border-terracotta-800"
                                >
                                    {food}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* User Review Section */}
                <div className="mb-8 pt-8 border-t border-stone-100 dark:border-stone-700">
                    {!isReviewing && !saved ? (
                        <button
                            onClick={() => setIsReviewing(true)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-stone-50 dark:bg-stone-700/50 text-stone-600 dark:text-stone-200 rounded-2xl font-medium hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
                        >
                            <MessageSquarePlus className="w-5 h-5" />
                            Add Personal Review
                        </button>
                    ) : saved ? (
                        <div className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-sage-50 dark:bg-sage-900/20 text-sage-600 dark:text-sage-400 rounded-2xl font-medium border border-sage-100 dark:border-sage-800">
                            <Check className="w-5 h-5" />
                            Review Saved!
                        </div>
                    ) : (
                        <div className="space-y-5 animate-in fade-in slide-in-from-top-2">
                            <div>
                                <label className="block text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-2">
                                    Your Rating
                                </label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => { setUserRating(star); setRatingError(false); }}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star className={clsx(
                                                "w-8 h-8",
                                                star <= userRating
                                                    ? "text-terracotta-400 fill-terracotta-400"
                                                    : "text-stone-200 dark:text-stone-700"
                                            )} />
                                        </button>
                                    ))}
                                </div>
                                {ratingError && (
                                    <p className="text-xs text-red-500 mt-1">Please select a star rating before saving.</p>
                                )}
                            </div>

                            <label className="flex items-center gap-3 p-3 bg-stone-50 dark:bg-stone-900 rounded-2xl cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${inCellar ? 'border-terracotta-500 bg-terracotta-500' : 'border-stone-300 dark:border-stone-600'}`}>
                                    {inCellar && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <input
                                    type="checkbox"
                                    checked={inCellar}
                                    onChange={(e) => setInCellar(e.target.checked)}
                                    className="hidden"
                                />
                                <span className="text-sm font-medium text-stone-700 dark:text-stone-300">Add to Cellar</span>
                            </label>

                            {inCellar && (
                                <div>
                                    <label className="block text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-2">
                                        Quantity (Bottles)
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                            className="w-9 h-9 rounded-full bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold text-lg flex items-center justify-center hover:bg-stone-200 transition-colors"
                                        >
                                            −
                                        </button>
                                        <span className="text-lg font-bold text-stone-800 dark:text-stone-100 w-8 text-center">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => setQuantity(q => q + 1)}
                                            className="w-9 h-9 rounded-full bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold text-lg flex items-center justify-center hover:bg-stone-200 transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-2">
                                    Your Notes
                                </label>
                                <textarea
                                    value={userNotes}
                                    onChange={(e) => setUserNotes(e.target.value)}
                                    placeholder="What did you think? (e.g., Great with steak!)"
                                    className="w-full px-4 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-500 transition-all placeholder:text-stone-300"
                                    rows={3}
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleSaveReview}
                                    className="flex-1 py-3 bg-sage-600 text-white rounded-2xl font-medium hover:bg-sage-700 transition-colors shadow-lg shadow-sage-600/20"
                                >
                                    Save Review
                                </button>
                                <button
                                    onClick={() => { setIsReviewing(false); setRatingError(false); }}
                                    className="px-6 py-3 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-2xl font-medium hover:bg-stone-200 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-stone-100 dark:border-stone-700">
                    <div>
                        <p className="text-xs text-stone-400 dark:text-stone-500 mb-1 uppercase tracking-widest font-bold">Estimated Price</p>
                        <div className="flex items-center text-2xl font-bold text-stone-800 dark:text-stone-100">
                            <span className="text-sage-500 mr-1">£</span>
                            {wine.price?.value?.toLocaleString() ?? '—'}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleShare}
                            className="p-3.5 bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-2xl hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
                            title="Share"
                        >
                            <Share2 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={onReset}
                            className="px-8 py-3.5 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-2xl font-medium text-sm hover:bg-stone-800 dark:hover:bg-stone-100 transition-colors shadow-lg"
                        >
                            Scan Another
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WineCard;
