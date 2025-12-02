import React, { useEffect, useState } from 'react';
import { Wine, MapPin, Star, Trash2 } from 'lucide-react';
import { getCellarWines, deleteReview } from '../services/reviewService';

const CellarList = () => {
    const [wines, setWines] = useState([]);

    const loadWines = () => {
        setWines(getCellarWines());
    };

    useEffect(() => {
        loadWines();
    }, []);

    const handleDelete = (id) => {
        if (confirm('Remove this wine from your cellar?')) {
            deleteReview(id);
            loadWines();
        }
    };

    if (wines.length === 0) {
        return (
            <div className="text-center py-12 animate-in fade-in">
                <div className="bg-terracotta-50 dark:bg-terracotta-900/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Wine className="w-10 h-10 text-terracotta-400" />
                </div>
                <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-2">Your Cellar is Empty</h3>
                <p className="text-stone-500 dark:text-stone-400">
                    Add wines to your cellar when reviewing them.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 pb-24">
            {wines.map((item) => (
                <div key={item.id} className="bg-white dark:bg-stone-800 rounded-3xl p-4 shadow-sm border border-stone-100 dark:border-stone-700 flex flex-col relative group">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.id);
                        }}
                        className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-black/20 backdrop-blur-sm rounded-full text-stone-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="aspect-square bg-stone-100 dark:bg-stone-900/50 rounded-2xl mb-3 overflow-hidden">
                        <img src={item.wine.image} alt={item.wine.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-grow">
                        <h3 className="font-bold text-stone-900 dark:text-white text-sm font-serif line-clamp-2 mb-1">
                            {item.wine.name}
                        </h3>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mb-2 truncate">
                            {item.wine.region}
                        </p>

                        <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-1 bg-terracotta-50 dark:bg-terracotta-900/20 px-2 py-1 rounded-lg">
                                <Star className="w-3 h-3 text-terracotta-500 fill-terracotta-500" />
                                <span className="text-xs font-bold text-terracotta-700 dark:text-terracotta-400">{item.rating}</span>
                            </div>
                            <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                                £{item.wine.price.value}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CellarList;
