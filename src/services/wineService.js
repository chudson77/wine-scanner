export const mockIdentifyWine = async (imageFile) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: '1',
                name: 'Château Margaux 2015',
                region: 'Bordeaux, France',
                type: 'Red Wine',
                rating: 4.8,
                price: {
                    value: 1250,
                    currency: 'USD',
                },
                review: "A legendary vintage. The 2015 Château Margaux is a monument to elegance and power. It offers a complex bouquet of black currants, violets, and graphite. On the palate, it is full-bodied with silky tannins and an incredibly long finish. A wine for the ages.",
                image: URL.createObjectURL(imageFile), // Use the uploaded image for demo
                matchConfidence: 0.98,
            });
        }, 2000); // Simulate network delay
    });
};
