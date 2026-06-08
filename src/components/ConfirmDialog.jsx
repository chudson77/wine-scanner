import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({
    message,
    onConfirm,
    onCancel,
    confirmLabel = 'Delete',
    confirmClassName = 'bg-red-500 text-white hover:bg-red-600',
}) => (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end justify-center p-4">
        <div className="bg-white dark:bg-stone-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <p className="text-stone-700 dark:text-stone-200 font-medium">{message}</p>
            </div>
            <div className="flex gap-3">
                <button
                    onClick={onCancel}
                    className="flex-1 py-3 bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-2xl font-medium hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className={`flex-1 py-3 rounded-2xl font-medium transition-colors ${confirmClassName}`}
                >
                    {confirmLabel}
                </button>
            </div>
        </div>
    </div>
);

export default ConfirmDialog;
