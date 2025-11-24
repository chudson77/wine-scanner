import React, { useRef, useState } from 'react';
import { Camera, Upload, ScanLine } from 'lucide-react';
import { clsx } from 'clsx';

export function CameraCapture({ onCapture }) {
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            onCapture(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            onCapture(file);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div
                className={clsx(
                    "relative group cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-300 h-96 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/50",
                    isDragging ? "border-wine-500 bg-wine-50 dark:bg-wine-900/20" : "border-gray-300 dark:border-gray-700 hover:border-wine-400 dark:hover:border-wine-500"
                )}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileChange}
                />

                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10 flex flex-col items-center p-8 text-center">
                    <div className="w-20 h-20 mb-6 rounded-full bg-white dark:bg-gray-700 shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Camera className="w-10 h-10 text-wine-600 dark:text-wine-400" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Scan Wine Label
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm max-w-[200px] mb-8">
                        Take a photo or upload an image to identify the wine
                    </p>

                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-wine-600 text-white text-sm font-medium shadow-lg shadow-wine-600/20 hover:bg-wine-700 transition-colors">
                            <Camera className="w-4 h-4" />
                            Camera
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium shadow-sm border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                            <Upload className="w-4 h-4" />
                            Upload
                        </button>
                    </div>
                </div>

                {/* Scanning animation overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-wine-500 to-transparent animate-[scan_2s_ease-in-out_infinite]" />
                </div>
            </div>
        </div>
    );
}
