import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WineCard from '../components/WineCard';

vi.mock('../services/reviewService', () => ({
    saveReview: vi.fn(),
}));

vi.mock('../services/imageStore', () => ({
    getImageUrl: vi.fn().mockResolvedValue(null),
}));

const makeWine = (overrides = {}) => ({
    id: '123',
    imageId: 'img-001',
    name: 'Penfolds Grange 2018',
    region: 'South Australia, Australia',
    type: 'Red',
    rating: 4.8,
    price: { value: 450, currency: 'GBP' },
    review: 'Exceptional depth and complexity with dark fruits.',
    foodPairings: ['Aged beef', 'Dark chocolate'],
    ...overrides,
});

beforeEach(() => vi.clearAllMocks());

describe('WineCard rendering', () => {
    it('displays wine name, region, type and AI rating', () => {
        render(<WineCard wine={makeWine()} onReset={vi.fn()} />);
        expect(screen.getByText('Penfolds Grange 2018')).toBeInTheDocument();
        expect(screen.getByText(/South Australia/)).toBeInTheDocument();
        expect(screen.getByText('Red')).toBeInTheDocument();
        expect(screen.getByText('4.8')).toBeInTheDocument();
    });

    it('displays sommelier review text', () => {
        render(<WineCard wine={makeWine()} onReset={vi.fn()} />);
        expect(screen.getByText(/Exceptional depth/)).toBeInTheDocument();
    });

    it('displays food pairings as pills', () => {
        render(<WineCard wine={makeWine()} onReset={vi.fn()} />);
        expect(screen.getByText('Aged beef')).toBeInTheDocument();
        expect(screen.getByText('Dark chocolate')).toBeInTheDocument();
    });

    it('does not render food pairings section when array is empty', () => {
        render(<WineCard wine={makeWine({ foodPairings: [] })} onReset={vi.fn()} />);
        expect(screen.queryByText(/Food Pairings/i)).not.toBeInTheDocument();
    });

    it('displays the estimated price in GBP', () => {
        render(<WineCard wine={makeWine()} onReset={vi.fn()} />);
        expect(screen.getByText('450')).toBeInTheDocument();
    });

    it('handles missing price gracefully', () => {
        render(<WineCard wine={makeWine({ price: null })} onReset={vi.fn()} />);
        expect(screen.getByText('—')).toBeInTheDocument();
    });
});

describe('WineCard review flow', () => {
    it('shows review form when Add Personal Review is clicked', async () => {
        render(<WineCard wine={makeWine()} onReset={vi.fn()} />);
        await userEvent.click(screen.getByText('Add Personal Review'));
        expect(screen.getByText('Your Rating')).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/What did you think/i)).toBeInTheDocument();
    });

    it('shows inline error when saving without a star rating', async () => {
        render(<WineCard wine={makeWine()} onReset={vi.fn()} />);
        await userEvent.click(screen.getByText('Add Personal Review'));
        await userEvent.click(screen.getByText('Save Review'));
        expect(screen.getByText(/Please select a star rating/i)).toBeInTheDocument();
    });

    it('does not call saveReview when no rating selected', async () => {
        const { saveReview } = await import('../services/reviewService');
        render(<WineCard wine={makeWine()} onReset={vi.fn()} />);
        await userEvent.click(screen.getByText('Add Personal Review'));
        await userEvent.click(screen.getByText('Save Review'));
        expect(saveReview).not.toHaveBeenCalled();
    });

    it('calls saveReview and shows saved state after valid submission', async () => {
        const { saveReview } = await import('../services/reviewService');
        render(<WineCard wine={makeWine()} onReset={vi.fn()} />);
        await userEvent.click(screen.getByText('Add Personal Review'));

        // Click the 4th star
        const stars = screen.getAllByRole('button').filter(b =>
            b.querySelector('svg[class*="w-8"]')
        );
        await userEvent.click(stars[3]);

        await userEvent.type(screen.getByPlaceholderText(/What did you think/i), 'Superb!');
        await userEvent.click(screen.getByText('Save Review'));

        expect(saveReview).toHaveBeenCalledWith(
            expect.objectContaining({ name: 'Penfolds Grange 2018' }),
            4,
            'Superb!',
            false,
            1
        );
        expect(screen.getByText('Review Saved!')).toBeInTheDocument();
    });

    it('shows quantity control when Add to Cellar is ticked', async () => {
        render(<WineCard wine={makeWine()} onReset={vi.fn()} />);
        await userEvent.click(screen.getByText('Add Personal Review'));
        await userEvent.click(screen.getByText('Add to Cellar'));
        expect(screen.getByText('Quantity (Bottles)')).toBeInTheDocument();
    });

    it('hides review form and clears error on Cancel', async () => {
        render(<WineCard wine={makeWine()} onReset={vi.fn()} />);
        await userEvent.click(screen.getByText('Add Personal Review'));
        await userEvent.click(screen.getByText('Save Review')); // trigger error
        await userEvent.click(screen.getByText('Cancel'));
        expect(screen.queryByText(/Please select a star rating/i)).not.toBeInTheDocument();
        expect(screen.queryByText('Your Rating')).not.toBeInTheDocument();
    });

    it('calls onReset when Scan Another is clicked', async () => {
        const onReset = vi.fn();
        render(<WineCard wine={makeWine()} onReset={onReset} />);
        await userEvent.click(screen.getByText('Scan Another'));
        expect(onReset).toHaveBeenCalled();
    });
});
