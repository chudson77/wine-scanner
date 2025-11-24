import Tesseract from 'tesseract.js';

export const mockIdentifyWine = async (imageFile) => {
    // 1. Perform OCR
    const { data: { text } } = await Tesseract.recognize(
        imageFile,
        'eng',
        { logger: m => console.log(m) } // Log progress to console
    );

    console.log("OCR Result:", text);

    // 2. Simulate API delay (OCR takes time, but we might want a bit more for "analysis" feel if OCR is too fast, though usually it's slow enough)
    // For now, we just return the result immediately after OCR.

    return {
        id: '1',
        name: 'Château Margaux 2015', // Still hardcoded for now, or we could randomize based on text length/hash
        region: 'Bordeaux, France',
        type: 'Red Wine',
        rating: 4.8,
        price: {
            value: 1250,
            currency: 'USD',
        },
        review: "A legendary vintage. The 2015 Château Margaux is a monument to elegance and power. It offers a complex bouquet of black currants, violets, and graphite. On the palate, it is full-bodied with silky tannins and an incredibly long finish. A wine for the ages.",
        image: URL.createObjectURL(imageFile),
        matchConfidence: 0.98,
        scannedText: text, // Return the raw text
    };
};
