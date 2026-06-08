import { describe, it, expect, vi, beforeEach } from 'vitest';
import { identifyWineWithGemini } from '../services/wineService';

vi.mock('../services/imageStore', () => ({
    saveImage: vi.fn().mockResolvedValue(undefined),
}));

const makeImageFile = (type = 'image/jpeg', sizeMB = 1) => {
    const bytes = new Uint8Array(sizeMB * 1024 * 1024);
    return new File([bytes], 'label.jpg', { type });
};

const VALID_RESPONSE = {
    name: 'Penfolds Bin 407 Cabernet Sauvignon 2019',
    region: 'South Australia, Australia',
    type: 'Red',
    rating: 4.5,
    price: { value: 35, currency: 'GBP' },
    review: 'Rich dark fruit with cedar notes. Full bodied with fine tannins.',
    foodPairings: ['Steak', 'Lamb', 'Hard cheese'],
};

const mockFetchSuccess = (body = VALID_RESPONSE) => {
    global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
            candidates: [{
                content: {
                    parts: [{ text: JSON.stringify(body) }]
                }
            }]
        }),
    });
};

beforeEach(() => {
    vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// Input validation
// ---------------------------------------------------------------------------
describe('identifyWineWithGemini — input validation', () => {
    it('throws when API key is missing', async () => {
        const file = makeImageFile();
        await expect(identifyWineWithGemini(file, '')).rejects.toThrow('API Key is required');
    });

    it('throws when file is too large (>10MB)', async () => {
        const file = makeImageFile('image/jpeg', 11);
        await expect(identifyWineWithGemini(file, 'key')).rejects.toThrow('under 10MB');
    });

    it('accepts valid image types', async () => {
        mockFetchSuccess();
        const file = makeImageFile('image/png', 0.5);
        await expect(identifyWineWithGemini(file, 'key')).resolves.toBeDefined();
    });
});

// ---------------------------------------------------------------------------
// Successful identification
// ---------------------------------------------------------------------------
describe('identifyWineWithGemini — successful response', () => {
    it('returns wine data with correct fields', async () => {
        mockFetchSuccess();
        const result = await identifyWineWithGemini(makeImageFile(), 'test-key');

        expect(result).toMatchObject({
            name: VALID_RESPONSE.name,
            region: VALID_RESPONSE.region,
            type: VALID_RESPONSE.type,
            rating: VALID_RESPONSE.rating,
            price: VALID_RESPONSE.price,
            review: VALID_RESPONSE.review,
            foodPairings: VALID_RESPONSE.foodPairings,
        });
    });

    it('returns an imageId string', async () => {
        mockFetchSuccess();
        const result = await identifyWineWithGemini(makeImageFile(), 'test-key');
        expect(typeof result.imageId).toBe('string');
        expect(result.imageId.length).toBeGreaterThan(0);
    });

    it('does not return a blob URL on the result', async () => {
        mockFetchSuccess();
        const result = await identifyWineWithGemini(makeImageFile(), 'test-key');
        expect(result).not.toHaveProperty('image');
    });

    it('returns empty foodPairings array when Gemini omits the field', async () => {
        const body = { ...VALID_RESPONSE };
        delete body.foodPairings;
        mockFetchSuccess(body);
        const result = await identifyWineWithGemini(makeImageFile(), 'test-key');
        expect(result.foodPairings).toEqual([]);
    });

    it('strips markdown code fences from Gemini response', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                candidates: [{
                    content: {
                        parts: [{ text: '```json\n' + JSON.stringify(VALID_RESPONSE) + '\n```' }]
                    }
                }]
            }),
        });
        const result = await identifyWineWithGemini(makeImageFile(), 'test-key');
        expect(result.name).toBe(VALID_RESPONSE.name);
    });

    it('calls Gemini API with the correct URL including the key', async () => {
        mockFetchSuccess();
        await identifyWineWithGemini(makeImageFile(), 'my-api-key');
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('key=my-api-key'),
            expect.any(Object)
        );
    });

    it('saves the image to IndexedDB before calling the API', async () => {
        const { saveImage } = await import('../services/imageStore');
        mockFetchSuccess();
        await identifyWineWithGemini(makeImageFile(), 'test-key');
        expect(saveImage).toHaveBeenCalledOnce();
    });
});

// ---------------------------------------------------------------------------
// Error handling
// ---------------------------------------------------------------------------
describe('identifyWineWithGemini — error handling', () => {
    it('throws a meaningful error when API returns non-ok status', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 401,
            statusText: 'Unauthorized',
            json: async () => ({ error: { message: 'API key not valid.' } }),
        });
        await expect(identifyWineWithGemini(makeImageFile(), 'bad-key'))
            .rejects.toThrow('API key not valid.');
    });

    it('throws when Gemini returns no text', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ candidates: [{ content: { parts: [{ text: '' }] } }] }),
        });
        await expect(identifyWineWithGemini(makeImageFile(), 'key'))
            .rejects.toThrow('No response from Gemini');
    });

    it('throws when Gemini returns malformed JSON', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                candidates: [{ content: { parts: [{ text: 'Sorry, I cannot identify this.' }] } }]
            }),
        });
        await expect(identifyWineWithGemini(makeImageFile(), 'key'))
            .rejects.toThrow('Could not parse wine data');
    });
});
