# SommelierAI – Wine Scanner App

SommelierAI is a mobile-first web app that uses Google Gemini AI to identify wine labels from photos. Scan any bottle to instantly get a professional tasting note, vintage details, taste profile, food pairings, drinking window, and estimated price — then build your own review history and cellar tracker, all stored privately on your device.

## Features

### Wine Identification
- **Label Scanning** — Take a photo or upload an image of any wine label
- **AI Analysis** — Google Gemini 2.5 Flash returns detailed wine data including:
  - Name, vintage year, region, and type
  - Grape varieties
  - Professional sommelier tasting note
  - Taste profile bars (Sweet→Dry, Light→Bold, Soft→Acidic)
  - Drinking window with vintage conditions note
  - Food pairings
  - Estimated retail price (GBP)
  - AI quality rating

### Review & Cellar Management
- **Personal Reviews** — Rate wines 1–5 stars with your own tasting notes
- **Cellar Tracker** — Mark bottles as "in cellar" with quantity controls (+/−)
- **Collection Value** — Live total value of your cellar (price × bottles)
- **Drinking Windows** — See when each cellar wine is at its peak
- **Update Quantities** — Adjust bottle counts as you drink them

### Discovery
- **Wine Comparison** — Pick any two reviewed wines for a head-to-head stat comparison
- **Your Palate** — Personal taste profile card that appears after 3+ reviews, showing your favourite style, top region, favourite grapes, and average rating
- **Search & Filter** — Filter reviews and cellar by wine type, minimum star rating, and free-text search by name or region

### Data & Export
- **Export Reviews** — Download your full review history as JSON
- **Export Cellar** — Download your cellar as CSV (includes vintage, grapes, drinking window)
- **Persistent Images** — Wine label photos are stored in IndexedDB and survive page refreshes

### UX
- **Mobile-First** — Optimised for iPhone/Android with native camera and file picker support
- **Dark Mode** — Automatically adapts to system colour scheme
- **Social Sharing** — Share any wine review via native share sheet (WhatsApp, iMessage, etc.)
- **No Alerts** — All confirmations use in-app modal dialogs, no browser popups

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 7 |
| Styling | Tailwind CSS, Lucide React |
| AI | Google Gemini 2.5 Flash (multimodal) |
| Image Storage | IndexedDB (browser-native) |
| Review Storage | localStorage |
| Testing | Vitest, Testing Library, fake-indexeddb |
| Deployment | Vercel (primary), GitHub Pages (via Actions) |

## Prerequisites

- **Node.js** v18 or higher
- A **Google Gemini API Key** — get one free from [Google AI Studio](https://aistudio.google.com/app/apikey)

## Local Development

```bash
# Clone
git clone https://github.com/chudson77/wine-scanner.git
cd wine-scanner

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open `http://localhost:5173`, paste your Gemini API key into the header input, then scan a wine.

## Testing

```bash
# Run all tests once
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

The test suite covers: image upload validation, IndexedDB storage, review CRUD operations, UI component interactions, and error handling (57 tests across 5 files).

## Deployment

### Vercel (recommended)

1. Push to GitHub
2. Import the repo at [vercel.com](https://vercel.com)
3. Deploy — no environment variables needed (the API key is entered by users in the UI)

The included `vercel.json` handles SPA routing automatically.

### GitHub Pages

The `.github/workflows/deploy.yml` workflow auto-deploys to GitHub Pages on every push to `main`. The build sets `VITE_BASE_PATH=/wine-scanner/` so asset paths resolve correctly under the subdirectory.

## Usage Guide

1. **Enter API Key** — Paste your Gemini key into the field in the header (stored locally, never sent anywhere except Google)
2. **Scan** — Go to Scan, take a photo or upload an image of a wine label
3. **Review the results** — Taste profile, drinking window, food pairings, and price are shown immediately
4. **Add a personal review** — Rate it, add notes, and optionally add it to your cellar with a bottle count
5. **Manage your cellar** — Adjust quantities, track drinking windows, see your total collection value
6. **Compare wines** — Go to Compare, select two wines, get a side-by-side breakdown
7. **Export** — Download your data as JSON or CSV at any time

## Security & Privacy

- **API Key** — Stored in browser `localStorage`, never sent to any server other than Google's official API. Click "Disconnect Key" on shared devices when finished.
- **Reviews & Images** — Stored entirely on your device (localStorage for metadata, IndexedDB for photos). Clearing browser data removes everything.
- **Camera** — Permission is only requested when you tap a capture button.
- **No backend** — There is no server, database, or user account. All data is local to your browser.
