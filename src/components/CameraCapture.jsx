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
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-wine-500 to-transparent animate-[scan_2s_ease-in-out_infinite]" />
                </div>

                <div className="flex flex-col items-center justify-center gap-4 p-8">
                    <div className="w-20 h-20 bg-terracotta-100 dark:bg-terracotta-900/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Camera className="w-10 h-10 text-terracotta-600 dark:text-terracotta-400" />
                    </div>

                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100">
                            Scan Wine Label
                        </h3>
                        <p className="text-sm text-stone-500 dark:text-stone-400">
                            Tap to take a photo or upload an image
                        </p>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-stone-400">
                        <div className="flex items-center gap-1">
                            <Camera className="w-4 h-4" />
                            <span>Camera</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                            <Upload className="w-4 h-4" />
                            <span>Upload</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CameraCapture;
