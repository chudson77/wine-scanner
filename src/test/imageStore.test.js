import { describe, it, expect } from 'vitest';
import { saveImage, getImageUrl, deleteImage } from '../services/imageStore';

// fake-indexeddb/auto (loaded in setup.js) provides global.indexedDB.
// URL.createObjectURL is also mocked in setup.js.
// We use unique IDs per test so tests don't share state.

const uid = (() => { let n = 0; return () => `idb-test-${n++}`; })();
const makeBlob = (content = 'fake-image-data') => new Blob([content], { type: 'image/jpeg' });

describe('saveImage / getImageUrl', () => {
    it('stores a blob and retrieves a URL', async () => {
        const id = uid();
        await saveImage(id, makeBlob());
        const url = await getImageUrl(id);
        expect(url).toBeTruthy();
        expect(typeof url).toBe('string');
    });

    it('returns null for an id that does not exist', async () => {
        const url = await getImageUrl('this-id-does-not-exist');
        expect(url).toBeNull();
    });

    it('returns null when id is falsy', async () => {
        expect(await getImageUrl(null)).toBeNull();
        expect(await getImageUrl(undefined)).toBeNull();
        expect(await getImageUrl('')).toBeNull();
    });

    it('overwrites an existing entry with the same id', async () => {
        const id = uid();
        await saveImage(id, makeBlob('v1'));
        await saveImage(id, makeBlob('v2'));
        const url = await getImageUrl(id);
        expect(url).toBeTruthy();
    });
});

describe('deleteImage', () => {
    it('removes an existing image so it can no longer be retrieved', async () => {
        const id = uid();
        await saveImage(id, makeBlob());
        await deleteImage(id);
        const url = await getImageUrl(id);
        expect(url).toBeNull();
    });

    it('does not throw when deleting a non-existent id', async () => {
        await expect(deleteImage('ghost-id')).resolves.not.toThrow();
    });

    it('does not throw when id is null or undefined', async () => {
        await expect(deleteImage(null)).resolves.not.toThrow();
        await expect(deleteImage(undefined)).resolves.not.toThrow();
    });
});
