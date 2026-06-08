import { deleteImage } from './imageStore';

const STORAGE_KEY = 'sommelier_ai_reviews';

export const getReviews = () => {
    try {
        const reviews = localStorage.getItem(STORAGE_KEY);
        return reviews ? JSON.parse(reviews) : [];
    } catch (error) {
        console.error('Error reading reviews from storage:', error);
        return [];
    }
};

export const saveReview = (wine, rating, notes, inCellar = false, quantity = 1) => {
    try {
        const reviews = getReviews();
        const newReview = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            wine: {
                name: wine.name,
                region: wine.region,
                type: wine.type,
                imageId: wine.imageId,
                price: wine.price,
                foodPairings: wine.foodPairings ?? [],
            },
            rating,
            notes,
            inCellar,
            quantity,
            purchaseDate: inCellar ? new Date().toISOString() : null,
        };

        const updatedReviews = [newReview, ...reviews];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReviews));
        return newReview;
    } catch (error) {
        console.error('Error saving review:', error);
        throw error;
    }
};

export const updateReview = (id, updates) => {
    try {
        const reviews = getReviews();
        const updatedReviews = reviews.map(r => r.id === id ? { ...r, ...updates } : r);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReviews));
        return updatedReviews;
    } catch (error) {
        console.error('Error updating review:', error);
        throw error;
    }
};

export const deleteReview = async (id) => {
    try {
        const reviews = getReviews();
        const review = reviews.find(r => r.id === id);
        if (review?.wine?.imageId) {
            await deleteImage(review.wine.imageId);
        }
        const updatedReviews = reviews.filter(r => r.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReviews));
        return updatedReviews;
    } catch (error) {
        console.error('Error deleting review:', error);
        throw error;
    }
};

export const getCellarWines = () => {
    return getReviews().filter(review => review.inCellar);
};

export const exportReviews = () => {
    return getReviews().map(r => ({
        name: r.wine.name,
        region: r.wine.region,
        type: r.wine.type,
        myRating: r.rating,
        aiRating: r.wine.rating,
        notes: r.notes,
        inCellar: r.inCellar,
        quantity: r.quantity ?? 1,
        priceGBP: r.wine.price?.value,
        foodPairings: (r.wine.foodPairings ?? []).join(', '),
        reviewDate: r.date,
        purchaseDate: r.purchaseDate,
    }));
};
