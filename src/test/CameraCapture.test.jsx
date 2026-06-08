import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CameraCapture from '../components/CameraCapture';

describe('CameraCapture', () => {
    it('renders Take Photo and Upload Photo buttons', () => {
        render(<CameraCapture onCapture={vi.fn()} />);
        expect(screen.getByText('Take Photo')).toBeInTheDocument();
        expect(screen.getByText('Upload Photo')).toBeInTheDocument();
    });

    it('has a drag-and-drop zone', () => {
        render(<CameraCapture onCapture={vi.fn()} />);
        expect(screen.getByText(/drag & drop/i)).toBeInTheDocument();
    });

    it('has two separate file inputs — one with capture, one without', () => {
        render(<CameraCapture onCapture={vi.fn()} />);
        const inputs = document.querySelectorAll('input[type="file"]');
        expect(inputs).toHaveLength(2);
        const withCapture = Array.from(inputs).filter(i => i.hasAttribute('capture'));
        const withoutCapture = Array.from(inputs).filter(i => !i.hasAttribute('capture'));
        expect(withCapture).toHaveLength(1);
        expect(withoutCapture).toHaveLength(1);
    });

    it('calls onCapture with the selected file', async () => {
        const onCapture = vi.fn();
        render(<CameraCapture onCapture={onCapture} />);
        const uploadInput = Array.from(document.querySelectorAll('input[type="file"]'))
            .find(i => !i.hasAttribute('capture'));
        const file = new File(['img'], 'wine.jpg', { type: 'image/jpeg' });
        await userEvent.upload(uploadInput, file);
        expect(onCapture).toHaveBeenCalledWith(file);
    });

    it('shows an error for files over 10MB', async () => {
        const onCapture = vi.fn();
        render(<CameraCapture onCapture={onCapture} />);
        const uploadInput = Array.from(document.querySelectorAll('input[type="file"]'))
            .find(i => !i.hasAttribute('capture'));
        const bigFile = new File([new Uint8Array(11 * 1024 * 1024)], 'big.jpg', { type: 'image/jpeg' });
        await userEvent.upload(uploadInput, bigFile);
        expect(screen.getByText(/under 10MB/i)).toBeInTheDocument();
        expect(onCapture).not.toHaveBeenCalled();
    });

    it('shows an error for non-image files', async () => {
        const onCapture = vi.fn();
        render(<CameraCapture onCapture={onCapture} />);
        const uploadInput = Array.from(document.querySelectorAll('input[type="file"]'))
            .find(i => !i.hasAttribute('capture'));
        const textFile = new File(['hello'], 'notes.txt', { type: 'text/plain' });
        // Use fireEvent to bypass user-event's accept attribute filtering
        Object.defineProperty(uploadInput, 'files', { value: [textFile], configurable: true });
        fireEvent.change(uploadInput);
        expect(screen.getByText(/image file/i)).toBeInTheDocument();
        expect(onCapture).not.toHaveBeenCalled();
    });
});
