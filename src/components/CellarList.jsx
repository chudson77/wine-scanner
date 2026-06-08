import React, { useEffect, useState } from 'react';
import { Wine, Star, Trash2, Package, Download, Search, Clock } from 'lucide-react';
import { getCellarWines, deleteReview, updateReview, exportReviews } from '../services/reviewService';
import WineImage from './WineImage';
import ConfirmDialog from './ConfirmDialog';

const TYPES = ['All', 'Red', 'White', 'Sparkling', 'Rosé', 'Dessert', 'Fortified'];

const CellarList = () => {
    const [wines, setWines] = useState([]);
    const [confirmId, setConfirmId] = useState(null);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');

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
        const headers = ['Name', 'Vintage', 'Region', 'Type', 'Grapes', 'My Rating', 'AI Rating', 'Price (GBP)', 'Quantity', 'Drinking Window', 'Purchase Date', 'Food Pairings', 'Notes'];
        const rows = data.map(r => [
            `"${r.name}"`,
            r.vintage ?? '',
            `"${r.region}"`,
            `"${r.type}"`,
            `"${r.grapes}"`,
            r.myRating,
            r.aiRating ?? '',
            r.priceGBP ?? '',
            r.quantity ?? 1,
            `"${r.drinkingWindow ?? ''}"`,
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

    const totalValue = wines.reduce((sum, w) => sum + (w.wine.price?.value ?? 0) * (w.quantity ?? 1), 0);

    const filtered = wines.filter(w => {
        const matchType = typeFilter === 'All' || w.wine.type === typeFilter;
        const matchSearch = !search || w.wine.name.toLowerCase().includes(search.toLowerCase());
        return matchType && matchSearch;
    });

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
            {/* Header: value + export */}
            <div className="flex items-end justify-between mb-5">
                <div>
                    <p className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-0.5">Collection Value</p>
                    <p className="text-2xl font-bold text-stone-800 dark:text-stone-100">
                        £{totalValue.toLocaleString()}
                    </p>
                </div>
                <button
                    onClick={handleExport}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-2xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 transition-colors"
                >
                    <Download className="w-3.5 h-3.5" />
                    Export CSV
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search wines…"
                    className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-500 transition-all"
                />
            </div>

            {/* Type filter pills */}
            <div className="flex gap-2 flex-wrap mb-5">
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

            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 pb-24">
                {filtered.map((item) => (
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
                                {item.wine.vintage ? `${item.wine.vintage} · ` : ''}{item.wine.region}
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

                            {item.wine.drinkingWindow && (
                                <div className="flex items-center gap-1 mb-2 text-xs text-stone-500 dark:text-stone-400">
                                    <Clock className="w-3 h-3 flex-shrink-0" />
                                    <span className="truncate">{item.wine.drinkingWindow}</span>
                                </div>
                            )}

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
