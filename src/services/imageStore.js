const DB_NAME = 'sommelier_ai_images';
const STORE_NAME = 'images';
const DB_VERSION = 1;

const openDB = () => new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
        e.target.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
});

export const saveImage = async (id, blob) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).put(blob, id);
        tx.oncomplete = () => resolve();
        tx.onerror = (e) => reject(e.target.error);
    });
};

export const getImageUrl = async (id) => {
    if (!id) return null;
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const request = tx.objectStore(STORE_NAME).get(id);
            request.onsuccess = (e) => {
                const blob = e.target.result;
                resolve(blob ? URL.createObjectURL(blob) : null);
            };
            request.onerror = (e) => reject(e.target.error);
        });
    } catch {
        return null;
    }
};

export const deleteImage = async (id) => {
    if (!id) return;
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            tx.objectStore(STORE_NAME).delete(id);
            tx.oncomplete = () => resolve();
            tx.onerror = (e) => reject(e.target.error);
        });
    } catch {
        // Non-fatal — image may not exist
    }
};
