export const identifyWineWithGemini = async (imageFile, apiKey) => {
    if (!apiKey) {
        throw new Error("API Key is required");
    }

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

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        {
                            inline_data: {
                                mime_type: imageFile.type,
                                data: base64Image
                            }
                        }
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
        throw new Error("No text returned from Gemini");
    }

    // Clean up markdown code blocks if present
    const jsonString = text.replace(/```json\n|\n```/g, "").trim();

    try {
        const wineData = JSON.parse(jsonString);
        return {
            id: Date.now().toString(),
            ...wineData,
            image: URL.createObjectURL(imageFile),
            matchConfidence: 0.95,
            scannedText: "Analyzed by Gemini 2.5 Flash",
        };
    } catch (e) {
        console.error("Failed to parse JSON:", text);
        throw new Error("Failed to parse wine data from AI response");
    }
};
