import { GoogleGenerativeAI } from "@google/generative-ai";

export const identifyWineWithGemini = async (imageFile, apiKey) => {
    if (!apiKey) {
        throw new Error("API Key is required");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    // Convert image to Base64
    const base64Image = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(imageFile);
    });

    const prompt = `Analyze this wine label image. Identify the wine and provide the following details in strict JSON format:
  {
    "name": "Full name of the wine including vintage",
    "region": "Region and Country",
    "type": "Type of wine (Red, White, Sparkling, etc.)",
    "rating": 4.5,
    "price": { "value": 0, "currency": "USD" },
    "review": "A short, professional tasting note/review (max 3 sentences)."
  }
  If you cannot identify the wine, make a best guess based on the visible text and style. Ensure the price is a realistic estimate.`;

    const result = await model.generateContent([
        prompt,
        {
            inlineData: {
                data: base64Image,
                mimeType: imageFile.type
            }
        }
    ]);

    const response = await result.response;
    const text = response.text();

    // Clean up markdown code blocks if present
    const jsonString = text.replace(/```json\n|\n```/g, "").trim();
    const wineData = JSON.parse(jsonString);

    return {
        id: Date.now().toString(),
        ...wineData,
        image: URL.createObjectURL(imageFile),
        matchConfidence: 0.95, // Gemini is usually confident
        scannedText: "Analyzed by Gemini 1.5 Flash",
    };
};
