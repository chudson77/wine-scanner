import React, { useState, useEffect } from 'react';
import { Check, ChevronLeft } from 'lucide-react';
import { getReviews } from '../services/reviewService';
import WineImage from './WineImage';

const StatRow = ({ label, valueA, valueB, winner }) => (
    <div className="bg-white dark:bg-stone-800 rounded-2xl p-4 border border-stone-100 dark:border-stone-700">
        <p className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-3">{label}</p>
        <div className="grid grid-cols-2 gap-3">
            {[{ val: valueA, side: 'a' }, { val: valueB, side: 'b' }].map(({ val, side }) => (
                <div
                    key={side}
                    className={`text-center p-2 rounded-xl ${winner === side ? 'bg-sage-50 dark:bg-sage-900/20' : ''}`}
                >
                    <p className={`font-bold text-sm ${winner === side ? 'text-sage-600 dark:text-sage-400' : 'text-stone-700 dark:text-stone-300'}`}>
                        {val}
                    </p>
                    {winner === side && <p className="text-xs text-sage-500 mt-0.5">Winner</p>}
                </div>
            ))}
        </div>
    </div>
);

const CompareView = () => {
    const [reviews, setReviews] = useState([]);
    const [selected, setSelected] = useState([]);

    useEffect(() => { setReviews(getReviews()); }, []);

    const toggle = (id) => {
        setSelected(prev =>
            prev.includes(id)
                ? prev.filter(s => s !== id)
                : prev.length < 2 ? [...prev, id] : [prev[1], id]
        );
    };

    const wineA = reviews.find(r => r.id === selected[0]);
    const wineB = reviews.find(r => r.id === selected[1]);
    const comparing = wineA && wineB;

    if (reviews.length < 2) {
        return (
            <div className="w-full max-w-md mx-auto text-center py-12 animate-in fade-in">
                <div className="bg-stone-100 dark:bg-stone-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-stone-300" />
                </div>
                <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-2">Not enough wines</h3>
                <p className="text-stone-500 dark:text-stone-400">Review at least 2 wines to compare them.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto space-y-4 pb-24">
            {!comparing && (
                <>
                    <p className="text-sm text-stone-500 dark:text-stone-400 text-center pb-2">
                        {selected.length === 0 ? 'Select two wines to compare' : 'Select one more wine'}
                    </p>
                    <div className="space-y-3">
                        {reviews.map(review => {
                            const isSelected = selected.includes(review.id);
                            return (
                                <button
                                    key={review.id}
                                    onClick={() => toggle(review.id)}
                                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                                        isSelected
                                            ? 'border-sage-400 bg-sage-50 dark:bg-sage-900/20 dark:border-sage-700'
                                            : 'border-stone-100 dark:border-stone-700 bg-white dark:bg-stone-800'
                                    }`}
                                >
                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-700 flex-shrink-0">
                                        <WineImage imageId={review.wine.imageId} name={review.wine.name} />
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <p className="font-bold text-stone-800 dark:text-stone-100 text-sm truncate">{review.wine.name}</p>
                                        <p className="text-xs text-stone-500 dark:text-stone-400 truncate">{review.wine.region} • {review.wine.type}</p>
                                    </div>
                                    {isSelected && (
                                        <div className="w-6 h-6 bg-sage-500 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Check className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}

            {comparing && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                    <button
                        onClick={() => setSelected([])}
                        className="flex items-center gap-1 text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Choose different wines
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                        {[wineA, wineB].map((w, i) => (
                            <div key={i} className="bg-white dark:bg-stone-800 rounded-3xl overflow-hidden border border-stone-100 dark:border-stone-700">
                                <div className="h-28 bg-stone-100 dark:bg-stone-700">
                                    <WineImage imageId={w.wine.imageId} name={w.wine.name} />
                                </div>
                                <div className="p-3">
                                    <p className="font-bold text-xs font-serif text-stone-800 dark:text-stone-100 line-clamp-2 leading-snug">{w.wine.name}</p>
                                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 truncate">{w.wine.region}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <StatRow
                        label="Your Rating"
                        valueA={`${wineA.rating}/5 ★`}
                        valueB={`${wineB.rating}/5 ★`}
                        winner={wineA.rating > wineB.rating ? 'a' : wineB.rating > wineA.rating ? 'b' : null}
                    />
                    <StatRow
                        label="AI Score"
                        valueA={wineA.wine.rating ?? '—'}
                        valueB={wineB.wine.rating ?? '—'}
                        winner={
                            (wineA.wine.rating ?? 0) > (wineB.wine.rating ?? 0) ? 'a' :
                            (wineB.wine.rating ?? 0) > (wineA.wine.rating ?? 0) ? 'b' : null
                        }
                    />
                    <StatRow
                        label="Estimated Price"
                        valueA={`£${wineA.wine.price?.value ?? '—'}`}
                        valueB={`£${wineB.wine.price?.value ?? '—'}`}
                        winner={null}
                    />
                    <StatRow
                        label="Type"
                        valueA={wineA.wine.type}
                        valueB={wineB.wine.type}
                        winner={null}
                    />

                    {(wineA.notes || wineB.notes) && (
                        <div className="bg-white dark:bg-stone-800 rounded-2xl p-4 border border-stone-100 dark:border-stone-700">
                            <p className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-3">Your Notes</p>
                            <div className="grid grid-cols-2 gap-3">
                                <p className="text-xs text-stone-600 dark:text-stone-300 italic leading-relaxed">{wineA.notes || '—'}</p>
                                <p className="text-xs text-stone-600 dark:text-stone-300 italic leading-relaxed">{wineB.notes || '—'}</p>
                            </div>
                        </div>
                    )}

                    {(wineA.wine.foodPairings?.length > 0 || wineB.wine.foodPairings?.length > 0) && (
                        <div className="bg-white dark:bg-stone-800 rounded-2xl p-4 border border-stone-100 dark:border-stone-700">
                            <p className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-3">Food Pairings</p>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1">
                                    {(wineA.wine.foodPairings ?? []).map((f, i) => (
                                        <span key={i} className="text-xs text-stone-600 dark:text-stone-300">• {f}</span>
                                    ))}
                                </div>
                                <div className="flex flex-col gap-1">
                                    {(wineB.wine.foodPairings ?? []).map((f, i) => (
                                        <span key={i} className="text-xs text-stone-600 dark:text-stone-300">• {f}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CompareView;
