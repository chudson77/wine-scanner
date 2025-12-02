# SommelierAI - Wine Scanner App 🍷

SommelierAI is a modern web application that allows users to scan wine labels, identify the wine using Google Gemini AI, and get detailed information including ratings, reviews, and pricing. Users can also save their own personal reviews and share them with friends.

## Features ✨

*   **AI-Powered Identification**: Uses Google Gemini 2.5 Flash to analyze wine labels from images.
*   **Instant Details**: Returns wine name, region, type, estimated price (GBP), and a professional tasting note.
*   **Personal Reviews**: Rate wines (1-5 stars) and add your own tasting notes.
*   **Local Storage**: Reviews are saved directly to your device's browser storage.
*   **Social Sharing**: Share your reviews with friends via WhatsApp, iMessage, etc., using the native share sheet.
*   **Responsive Design**: Fully optimized for mobile devices with a premium, app-like feel.
*   **Dark Mode**: Automatically adapts to your system's color scheme.

## Tech Stack 🛠️

*   **Frontend**: React, Vite
*   **Styling**: Tailwind CSS, Lucide React (Icons)
*   **AI**: Google Gemini API (Multimodal)
*   **Deployment**: GitHub Pages

## Prerequisites

Before running the project, ensure you have:

*   **Node.js** (v18 or higher) installed.
*   A **Google Gemini API Key**. You can get one for free from [Google AI Studio](https://aistudio.google.com/app/apikey).

## Installation & Local Development

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/chudson77/wine-scanner.git
    cd wine-scanner
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Start the development server**:
    ```bash
    npm run dev
    ```

4.  **Open the app**:
    Visit `http://localhost:5173` in your browser.

5.  **Enter API Key**:
    Paste your Google Gemini API Key into the input field on the home screen to start scanning.

## Deployment

This project is configured for deployment on **GitHub Pages**.

1.  **Build the project**:
    ```bash
    npm run build
    ```

2.  **Deploy**:
    The project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically deploys to GitHub Pages whenever you push to the `main` branch.

    *   Ensure "Read and write permissions" are enabled in your repository settings under **Actions > General > Workflow permissions**.

## Version Control Notes

*   **Main Branch**: `main` contains the stable, deployable code.
*   **Commits**: Follow standard commit message conventions (e.g., "Feature: Add reviews", "Fix: Resolve API error").
*   **Secrets**: **NEVER** commit your API key to the repository. The app is designed to ask for the key in the UI so it remains local to your browser session.

## Usage Guide

1.  **Scan**: Tap the camera icon or "Scan" button to take a photo of a wine label.
2.  **Analyze**: The AI will identify the wine and show you the details.
3.  **Review**: Tap "Add Personal Review" to give it a star rating and write your thoughts.
4.  **Save**: Your review is saved to your "My Reviews" list.
5.  **Share**: Tap the Share icon on any wine card to send your review to a friend!

## Security & Privacy 🔒

*   **API Keys**: Your Google Gemini API Key is stored locally in your browser's secure `localStorage`. It is **never** sent to any server other than Google's official API endpoints.
*   **Data Storage**: All personal reviews and ratings are stored entirely on your device. Clearing your browser data will remove them.
*   **Camera Access**: The app only requests camera permission when you explicitly click the "Scan" button.
*   **Best Practice**: If you are on a shared device, remember to click "Disconnect API Key" when you are finished.


