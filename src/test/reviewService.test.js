import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
    getReviews,
    saveReview,
    deleteReview,
    updateReview,
    getCellarWines,
    exportReviews,
} from '../services/reviewService';

// Mock imageStore so deleteReview doesn't need IndexedDB
vi.mock('../services/imageStore', () => ({
    deleteImage: vi.fn().mockResolvedValue(undefined),
}));

const makeWine = (overrides = {}) => ({
    name: 'Château Test 2020',
    region: 'Bordeaux, France',
    type: 'Red',
    imageId: 'img-001',
    price: { value: 25, currency: 'GBP' },
    foodPairings: ['Lamb', 'Cheese'],
    ...overrides,
});

// Each call to Date.now() returns a unique incrementing value so review IDs
// never collide when multiple saves happen in the same millisecond.
let mockNow = 1_000_000;
beforeEach(() => {
    localStorage.clear();
    mockNow = 1_000_000;
    vi.spyOn(Date, 'now').mockImplementation(() => mockNow++);
});

afterEach(() => {
    vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// getReviews
// ---------------------------------------------------------------------------
describe('getReviews', () => {
    it('returns empty array when storage is empty', () => {
        expect(getReviews()).toEqual([]);
    });

    it('returns parsed reviews from localStorage', () => {
        const review = saveReview(makeWine(), 4, 'Nice');
        const reviews = getReviews();
        expect(reviews).toHaveLength(1);
        expect(reviews[0].id).toBe(review.id);
    });

    it('returns empty array when storage contains invalid JSON', () => {
        localStorage.setItem('sommelier_ai_reviews', '{invalid}');
        expect(getReviews()).toEqual([]);
    });
});

// ---------------------------------------------------------------------------
// saveReview
// ---------------------------------------------------------------------------
describe('saveReview', () => {
    it('saves a review with correct shape', () => {
        const wine = makeWine();
        const review = saveReview(wine, 5, 'Excellent!', false, 2);

        expect(review).toMatchObject({
            rating: 5,
            notes: 'Excellent!',
            inCellar: false,
            quantity: 2,
        });
        expect(review.wine.name).toBe('Château Test 2020');
        expect(review.wine.foodPairings).toEqual(['Lamb', 'Cheese']);
        expect(review.id).toBeTruthy();
        expect(review.date).toBeTruthy();
    });

    it('saves imageId (not a blob URL)', () => {
        const review = saveReview(makeWine(), 3, '');
        expect(review.wine.imageId).toBe('img-001');
        expect(review.wine).not.toHaveProperty('image');
    });

    it('sets purchaseDate when inCellar is true', () => {
        const review = saveReview(makeWine(), 4, '', true, 3);
        expect(review.inCellar).toBe(true);
        expect(review.purchaseDate).toBeTruthy();
    });

    it('sets purchaseDate to null when inCellar is false', () => {
        const review = saveReview(makeWine(), 4, '', false);
        expect(review.purchaseDate).toBeNull();
    });

    it('prepends new reviews (most recent first)', () => {
        saveReview(makeWine({ name: 'Wine A' }), 3, '');
        saveReview(makeWine({ name: 'Wine B' }), 4, '');
        const reviews = getReviews();
        expect(reviews[0].wine.name).toBe('Wine B');
        expect(reviews[1].wine.name).toBe('Wine A');
    });

    it('defaults quantity to 1', () => {
        const review = saveReview(makeWine(), 3, '');
        expect(review.quantity).toBe(1);
    });
});

// ---------------------------------------------------------------------------
// deleteReview
// ---------------------------------------------------------------------------
describe('deleteReview', () => {
    it('removes the review by id', async () => {
        const r1 = saveReview(makeWine({ name: 'Wine A' }), 3, '');
        const r2 = saveReview(makeWine({ name: 'Wine B' }), 4, '');
        const updated = await deleteReview(r1.id);
        expect(updated).toHaveLength(1);
        expect(updated[0].id).toBe(r2.id);
    });

    it('returns empty array when last review is deleted', async () => {
        const r = saveReview(makeWine(), 3, '');
        const updated = await deleteReview(r.id);
        expect(updated).toEqual([]);
    });

    it('calls deleteImage with the correct imageId', async () => {
        const { deleteImage } = await import('../services/imageStore');
        const r = saveReview(makeWine({ imageId: 'img-abc' }), 3, '');
        await deleteReview(r.id);
        expect(deleteImage).toHaveBeenCalledWith('img-abc');
    });
});

// ---------------------------------------------------------------------------
// updateReview
// ---------------------------------------------------------------------------
describe('updateReview', () => {
    it('merges updates into the correct review', () => {
        const r = saveReview(makeWine(), 3, 'Original notes');
        updateReview(r.id, { quantity: 5, notes: 'Updated notes' });
        const updated = getReviews().find(x => x.id === r.id);
        expect(updated.quantity).toBe(5);
        expect(updated.notes).toBe('Updated notes');
    });

    it('does not modify other reviews', () => {
        const r1 = saveReview(makeWine({ name: 'A' }), 3, '');
        const r2 = saveReview(makeWine({ name: 'B' }), 4, '');
        updateReview(r1.id, { quantity: 10 });
        const r2After = getReviews().find(x => x.id === r2.id);
        expect(r2After.quantity).toBe(1);
    });
});

// ---------------------------------------------------------------------------
// getCellarWines
// ---------------------------------------------------------------------------
describe('getCellarWines', () => {
    it('returns only cellar wines', () => {
        saveReview(makeWine({ name: 'Not In Cellar' }), 3, '', false);
        saveReview(makeWine({ name: 'In Cellar' }), 4, '', true);
        const cellar = getCellarWines();
        expect(cellar).toHaveLength(1);
        expect(cellar[0].wine.name).toBe('In Cellar');
    });

    it('returns empty array when no wines in cellar', () => {
        saveReview(makeWine(), 3, '', false);
        expect(getCellarWines()).toEqual([]);
    });
});

// ---------------------------------------------------------------------------
// exportReviews
// ---------------------------------------------------------------------------
describe('exportReviews', () => {
    it('returns flat export-ready objects', () => {
        saveReview(makeWine(), 4, 'Great wine', true, 2);
        const exported = exportReviews();
        expect(exported).toHaveLength(1);
        expect(exported[0]).toMatchObject({
            name: 'Château Test 2020',
            region: 'Bordeaux, France',
            type: 'Red',
            myRating: 4,
            notes: 'Great wine',
            inCellar: true,
            quantity: 2,
            priceGBP: 25,
            foodPairings: 'Lamb, Cheese',
        });
    });

    it('does not include imageId or image blobs', () => {
        saveReview(makeWine(), 3, '');
        const exported = exportReviews();
        expect(exported[0]).not.toHaveProperty('imageId');
        expect(exported[0]).not.toHaveProperty('image');
    });
});
