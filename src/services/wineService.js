import { saveImage } from './imageStore';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
const MAX_SIZE_MB = 10;

export const identifyWineWithGemini = async (imageFile, apiKey) => {
    if (!apiKey) {
        throw new Error("API Key is required");
    }

    if (!imageFile.type.startsWith('image/') && !ALLOWED_TYPES.includes(imageFile.type)) {
        throw new Error("Please upload a valid image file (JPEG, PNG, or WebP).");
    }

    if (imageFile.size > MAX_SIZE_MB * 1024 * 1024) {
        throw new Error(`Image must be under ${MAX_SIZE_MB}MB.`);
    }

    const imageId = Date.now().toString();
    await saveImage(imageId, imageFile);

    const base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.onerror = () => reject(new Error("Failed to read image file"));
        reader.readAsDataURL(imageFile);
    });

    const prompt = `Analyze this wine label image and return ONLY a JSON object with no markdown, no code blocks, and no extra text.

{
  "name": "Full name of the wine including vintage year if visible",
  "region": "Region and Country (e.g. Bordeaux, France)",
  "type": "Type of wine (Red, White, Sparkling, Rose, Dessert, Fortified)",
  "rating": 4.5,
  "price": { "value": 0, "currency": "GBP" },
  "review": "A short professional tasting note of 2-3 sentences.",
  "foodPairings": ["Food pairing 1", "Food pairing 2", "Food pairing 3"]
}

If you cannot identify the wine precisely, make your best guess from the visible text and label style. Ensure the price is a realistic retail estimate in GBP. Return only the JSON object.`;

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        { inline_data: { mime_type: imageFile.type, data: base64Image } }
                    ]
                }]
            })
        }
    );

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
        throw new Error("No response from Gemini. Check your API key and try again.");
    }

    const jsonString = text.replace(/```json\n?|\n?```/g, '').trim();

    try {
        const wineData = JSON.parse(jsonString);
        return {
            id: imageId,
            imageId,
            name: wineData.name ?? 'Unknown Wine',
            region: wineData.region ?? 'Unknown Region',
            type: wineData.type ?? 'Unknown',
            rating: wineData.rating ?? 0,
            price: wineData.price ?? { value: 0, currency: 'GBP' },
            review: wineData.review ?? '',
            foodPairings: Array.isArray(wineData.foodPairings) ? wineData.foodPairings : [],
        };
    } catch {
        console.error("Failed to parse Gemini JSON response:", text);
        throw new Error("Could not parse wine data from AI response. Please try again.");
    }
};
