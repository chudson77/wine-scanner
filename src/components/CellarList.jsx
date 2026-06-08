import React, { useEffect, useState } from 'react';
import { Wine, Star, Trash2, Package, Download } from 'lucide-react';
import { getCellarWines, deleteReview, updateReview, exportReviews } from '../services/reviewService';
import WineImage from './WineImage';
import ConfirmDialog from './ConfirmDialog';

const CellarList = () => {
    const [wines, setWines] = useState([]);
    const [confirmId, setConfirmId] = useState(null);

    const loadWines = () => setWines(getCellarWines());

    useEffect(() => { loadWines(); }, []);

    const handleDelete = async () => {
        await deleteReview(confirmId);
        setConfirmId(null);
        loadWines();
    };

    const updateQuantity = (id, delta) => {
        const item = wines.find(w => w.id === id);
        if (!item) return;
        const newQty = Math.max(1, (item.quantity ?? 1) + delta);
        updateReview(id, { quantity: newQty });
        loadWines();
    };

    const handleExport = () => {
        const data = exportReviews().filter(r => r.inCellar);
        const headers = ['Name', 'Region', 'Type', 'My Rating', 'AI Rating', 'Price (GBP)', 'Quantity', 'Purchase Date', 'Food Pairings', 'Notes'];
        const rows = data.map(r => [
            `"${r.name}"`,
            `"${r.region}"`,
            `"${r.type}"`,
            r.myRating,
            r.aiRating ?? '',
            r.priceGBP ?? '',
            r.quantity ?? 1,
            r.purchaseDate ? new Date(r.purchaseDate).toLocaleDateString() : '',
            `"${r.foodPairings}"`,
            `"${r.notes ?? ''}"`,
        ].join(','));
        const csv = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cellar.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    if (wines.length === 0) {
        return (
            <div className="text-center py-12 animate-in fade-in">
                <div className="bg-terracotta-50 dark:bg-terracotta-900/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Wine className="w-10 h-10 text-terracotta-400" />
                </div>
                <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-2">Your Cellar is Empty</h3>
                <p className="text-stone-500 dark:text-stone-400">Add wines to your cellar when reviewing them.</p>
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
                    Export CSV
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 pb-24">
                {wines.map((item) => (
                    <div key={item.id} className="bg-white dark:bg-stone-800 rounded-3xl p-4 shadow-sm border border-stone-100 dark:border-stone-700 flex flex-col relative group">
                        <button
                            onClick={() => setConfirmId(item.id)}
                            className="absolute top-3 right-3 z-10 p-2 bg-white/80 dark:bg-black/20 backdrop-blur-sm rounded-full text-stone-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="aspect-square bg-stone-100 dark:bg-stone-900/50 rounded-2xl mb-3 overflow-hidden">
                            <WineImage imageId={item.wine.imageId} name={item.wine.name} />
                        </div>

                        <div className="flex-grow">
                            <h3 className="font-bold text-stone-900 dark:text-white text-sm font-serif line-clamp-2 mb-1">
                                {item.wine.name}
                            </h3>
                            <p className="text-xs text-stone-500 dark:text-stone-400 mb-2 truncate">
                                {item.wine.region}
                            </p>

                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-1 bg-terracotta-50 dark:bg-terracotta-900/20 px-2 py-1 rounded-lg">
                                    <Star className="w-3 h-3 text-terracotta-500 fill-terracotta-500" />
                                    <span className="text-xs font-bold text-terracotta-700 dark:text-terracotta-400">{item.rating}</span>
                                </div>
                                <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                                    £{item.wine.price?.value ?? '—'}
                                </span>
                            </div>

                            <div className="flex items-center gap-1.5 mt-2 bg-stone-50 dark:bg-stone-900/50 rounded-xl px-2 py-1.5">
                                <Package className="w-3 h-3 text-stone-400 flex-shrink-0" />
                                <button
                                    onClick={() => updateQuantity(item.id, -1)}
                                    className="w-5 h-5 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 text-xs font-bold flex items-center justify-center hover:bg-stone-300 transition-colors"
                                >
                                    −
                                </button>
                                <span className="text-xs font-bold text-stone-700 dark:text-stone-300 flex-1 text-center">
                                    {item.quantity ?? 1}
                                </span>
                                <button
                                    onClick={() => updateQuantity(item.id, 1)}
                                    className="w-5 h-5 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 text-xs font-bold flex items-center justify-center hover:bg-stone-300 transition-colors"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {confirmId && (
                <ConfirmDialog
                    message="Remove this wine from your cellar?"
                    confirmLabel="Remove"
                    onConfirm={handleDelete}
                    onCancel={() => setConfirmId(null)}
                />
            )}
        </>
    );
};

export default CellarList;
