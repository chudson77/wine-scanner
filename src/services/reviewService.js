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

export const saveReview = (wine, rating, notes, inCellar = false) => {
    try {
        const reviews = getReviews();
        const newReview = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            wine: {
                name: wine.name,
                region: wine.region,
                type: wine.type,
                image: wine.image,
                price: wine.price
            },
            rating,
            notes,
            inCellar
        };

        const updatedReviews = [newReview, ...reviews];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReviews));
        return newReview;
    } catch (error) {
        console.error('Error saving review:', error);
        throw error;
    }
};

export const deleteReview = (id) => {
    try {
        const reviews = getReviews();
        const updatedReviews = reviews.filter((review) => review.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReviews));
        return updatedReviews;
    } catch (error) {
        console.error('Error deleting review:', error);
        throw error;
    }
};

export const getCellarWines = () => {
    const reviews = getReviews();
    return reviews.filter(review => review.inCellar);
};
