import '@testing-library/jest-dom';
import 'fake-indexeddb/auto'; // polyfills global.indexedDB and IDBKeyRange

// URL.createObjectURL / revokeObjectURL are not implemented in jsdom
global.URL.createObjectURL = vi.fn(() => `blob:fake-${Math.random()}`);
global.URL.revokeObjectURL = vi.fn();

// Isolated localStorage mock shared across all test files
const store = {};
global.localStorage = {
    getItem: (k) => store[k] ?? null,
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); },
};
