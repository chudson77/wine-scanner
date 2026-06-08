import React, { useState, useEffect } from 'react';
import { Wine } from 'lucide-react';
import { getImageUrl } from '../services/imageStore';

const WineImage = ({ imageId, name, className = 'w-full h-full' }) => {
    const [url, setUrl] = useState(null);

    useEffect(() => {
        let objectUrl = null;
        if (imageId) {
            getImageUrl(imageId).then((u) => {
                objectUrl = u;
                setUrl(u);
            });
        }
        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [imageId]);

    if (url) {
        return <img src={url} alt={name} className={`${className} object-cover`} />;
    }

    return (
        <div className={`${className} flex items-center justify-center`}>
            <Wine className="w-8 h-8 text-stone-300 dark:text-stone-600" />
        </div>
    );
};

export default WineImage;
