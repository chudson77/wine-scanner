import React from 'react';
import { X, Star, MapPin, Wine, UtensilsCrossed, Leaf, Clock, Package, Calendar } from 'lucide-react';
import WineImage from './WineImage';

const TasteBar = ({ leftLabel, rightLabel, value }) => {
    const pct = value != null
        ? Math.min(100, Math.max(0, Math.round(((value - 1) / 9) * 100)))
        : 50;
    return (
        <div>
            <div className="flex justify-between text-xs text-stone-400 dark:text-stone-500 mb-1.5">
                <span>{leftLabel}</span>
                <span>{rightLabel}</span>
            </div>
            <div className="h-2 bg-stone-100 dark:bg-stone-700 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-sage-300 to-sage-600 rounded-full"
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
};

const WineDetailSheet = ({ review, onClose }) => {
    const { wine, rating, notes, quantity, purchaseDate, date, inCellar } = review;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/50 flex items-end animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="w-full max-h-[92vh] bg-white dark:bg-stone-900 rounded-t-3xl overflow-y-auto animate-in slide-in-from-bottom-4 duration-300"
                onClick={e => e.stopPropagation()}
            >
                {/* Handle + close */}
                <div className="sticky top-0 bg-white dark:bg-stone-900 pt-3 pb-2 px-6 flex items-center justify-between z-10 border-b border-stone-100 dark:border-stone-800">
                    <div className="w-10 h-1 bg-stone-200 dark:bg-stone-700 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-3" />
                    <div className="w-8" />
                    <div className="w-8 h-1" />
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 hover:bg-stone-200 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Image */}
                <div className="relative h-52 bg-stone-100 dark:bg-stone-800">
                    <WineImage imageId={wine.imageId} name={wine.name} />
                    {wine.rating != null && (
                        <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                            <Star className="w-3.5 h-3.5 text-terracotta-500 fill-terracotta-500" />
                            <span className="font-bold text-sm text-stone-800 dark:text-stone-100">{wine.rating}</span>
                        </div>
                    )}
                </div>

                <div className="p-6 space-y-6">
                    {/* Name + region */}
                    <div>
                        <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 font-serif leading-tight mb-1">
                            {wine.name}
                        </h2>
                        <div className="flex items-center text-stone-500 dark:text-stone-400 text-sm">
                            <MapPin className="w-3.5 h-3.5 mr-1 text-sage-500" />
                            {wine.region}
                        </div>
                    </div>

                    {/* Type + vintage chips */}
                    <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-sage-50 text-sage-700 dark:bg-sage-900/30 dark:text-sage-300 border border-sage-100 dark:border-sage-800">
                            <Wine className="w-3 h-3 mr-1.5" />
                            {wine.type}
                        </span>
                        {wine.vintage && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-300">
                                {wine.vintage}
                            </span>
                        )}
                    </div>

                    {/* Grapes */}
                    {wine.grapes?.length > 0 && (
                        <div>
                            <p className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                <Leaf className="w-3 h-3" /> Grape Varieties
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {wine.grapes.map((g, i) => (
                                    <span key={i} className="px-3 py-1 bg-stone-50 dark:bg-stone-700/50 text-stone-600 dark:text-stone-300 text-xs rounded-full border border-stone-200 dark:border-stone-600">
                                        {g}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sommelier's notes */}
                    {wine.vintageNote && (
                        <div>
                            <p className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-2">Sommelier's Notes</p>
                            <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed">{wine.vintageNote}</p>
                        </div>
                    )}

                    {/* Taste profile */}
                    {wine.tasteProfile && (
                        <div>
                            <p className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-3">Taste Profile</p>
                            <div className="space-y-3">
                                <TasteBar leftLabel="Sweet" rightLabel="Dry" value={wine.tasteProfile.dry} />
                                <TasteBar leftLabel="Light" rightLabel="Bold" value={wine.tasteProfile.bold} />
                                <TasteBar leftLabel="Soft" rightLabel="Acidic" value={wine.tasteProfile.acidic} />
                            </div>
                        </div>
                    )}

                    {/* Drinking window */}
                    {wine.drinkingWindow && (
                        <div className="p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl border border-stone-100 dark:border-stone-700">
                            <div className="flex items-center gap-1.5 mb-1">
                                <Clock className="w-3.5 h-3.5 text-sage-500" />
                                <p className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">Drinking Window</p>
                            </div>
                            <p className="text-base font-bold text-stone-700 dark:text-stone-200">{wine.drinkingWindow}</p>
                        </div>
                    )}

                    {/* Food pairings */}
                    {wine.foodPairings?.length > 0 && (
                        <div>
                            <p className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                <UtensilsCrossed className="w-3 h-3" /> Food Pairings
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {wine.foodPairings.map((f, i) => (
                                    <span key={i} className="px-3 py-1 bg-terracotta-50 dark:bg-terracotta-900/20 text-terracotta-700 dark:text-terracotta-300 text-xs rounded-full border border-terracotta-100 dark:border-terracotta-800">
                                        {f}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Divider */}
                    <div className="border-t border-stone-100 dark:border-stone-800" />

                    {/* Your review */}
                    <div>
                        <p className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-3">Your Review</p>
                        <div className="flex items-center gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map(star => (
                                <Star key={star} className={`w-5 h-5 ${star <= rating ? 'text-terracotta-400 fill-terracotta-400' : 'text-stone-200 dark:text-stone-700'}`} />
                            ))}
                            <span className="text-xs text-stone-400 ml-2 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(date).toLocaleDateString()}
                            </span>
                        </div>
                        {notes && (
                            <p className="text-sm text-stone-600 dark:text-stone-300 bg-stone-50 dark:bg-stone-800 p-3 rounded-xl italic border border-stone-100 dark:border-stone-700 mb-3">
                                "{notes}"
                            </p>
                        )}
                        {inCellar && (
                            <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-300">
                                <Package className="w-4 h-4 text-stone-400" />
                                <span>{quantity ?? 1} bottle{(quantity ?? 1) !== 1 ? 's' : ''} in cellar</span>
                                {purchaseDate && (
                                    <span className="text-stone-400 text-xs">· added {new Date(purchaseDate).toLocaleDateString()}</span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800">
                        <div>
                            <p className="text-xs text-stone-400 uppercase tracking-widest font-bold mb-1">Estimated Price</p>
                            <p className="text-2xl font-bold text-stone-800 dark:text-stone-100">
                                <span className="text-sage-500 mr-1">£</span>
                                {wine.price?.value?.toLocaleString() ?? '—'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WineDetailSheet;
