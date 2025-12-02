import React from 'react';
import { Home, Wine, Camera, List } from 'lucide-react';

const BottomNav = ({ currentView, onViewChange }) => {
    const navItems = [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'cellar', label: 'Cellar', icon: Wine },
        { id: 'scan', label: 'Scan', icon: Camera },
        { id: 'reviews', label: 'Reviews', icon: List },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800 pb-safe pt-2 px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
            <div className="flex justify-between items-center max-w-md mx-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onViewChange(item.id)}
                            className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 ${isActive
                                    ? 'text-sage-600 dark:text-sage-400 transform -translate-y-1'
                                    : 'text-stone-400 dark:text-stone-600 hover:text-stone-600 dark:hover:text-stone-400'
                                }`}
                        >
                            <Icon
                                className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`}
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                            <span className="text-[10px] font-medium tracking-wide">
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;
