import React, { useRef, useState } from 'react';
import { Camera, Upload, ImageIcon } from 'lucide-react';

export function CameraCapture({ onCapture }) {
    const cameraInputRef = useRef(null);
    const uploadInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState(null);

    const validateAndCapture = (file) => {
        setError(null);
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file.');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setError('Image must be under 10MB.');
            return;
        }
        onCapture(file);
    };

    const handleFileChange = (e) => {
        validateAndCapture(e.target.files?.[0]);
        // Reset input so the same file can be re-selected if needed
        e.target.value = '';
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        validateAndCapture(e.dataTransfer.files?.[0]);
    };

    return (
        <div className="w-full max-w-md mx-auto space-y-4">
            {/* Drag and drop zone */}
            <div
                className={`relative overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-300 h-56 flex flex-col items-center justify-center ${
                    isDragging
                        ? 'border-terracotta-500 bg-terracotta-50 dark:bg-terracotta-900/20'
                        : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50'
                }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
            >
                <div className="flex flex-col items-center gap-3 pointer-events-none">
                    <div className="w-14 h-14 bg-terracotta-100 dark:bg-terracotta-900/30 rounded-full flex items-center justify-center">
                        <ImageIcon className="w-7 h-7 text-terracotta-500" />
                    </div>
                    <p className="text-sm text-stone-500 dark:text-stone-400 text-center px-8">
                        {isDragging ? 'Drop to scan' : 'Drag & drop a wine label here, or use the buttons below'}
                    </p>
                </div>
            </div>

            {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            {/* Two explicit action buttons — separate inputs prevent capture attribute blocking upload */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-2 p-5 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-3xl font-medium hover:opacity-90 transition-opacity shadow-lg"
                >
                    <Camera className="w-6 h-6" />
                    <span className="text-sm">Take Photo</span>
                </button>

                <button
                    onClick={() => uploadInputRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-2 p-5 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 rounded-3xl font-medium hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors shadow-sm border border-stone-200 dark:border-stone-700"
                >
                    <Upload className="w-6 h-6" />
                    <span className="text-sm">Upload Photo</span>
                </button>
            </div>

            {/* Camera input — capture="environment" opens native camera on mobile */}
            <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
            />

            {/* Upload input — no capture attribute, opens photo library / file picker */}
            <input
                ref={uploadInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    );
}

export default CameraCapture;
