import React from 'react';
import { render, act, cleanup, waitFor, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
vi.mock('../src/lib/device', () => ({ exportMedia: vi.fn() }));
vi.mock('../src/utils/audio', () => ({ soundFx: {} }));
vi.mock('canvas-confetti', () => ({ default: vi.fn() }));
import { PlayCamModal } from '../src/components/PlayCamModal';
import { GAMES_DATA } from '../src/data/games';
import { emptyPlayerData } from '../src/lib/playerData';
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
const props = { game: GAMES_DATA[0], dogProfile: emptyPlayerData().profile, onClose: () => {}, onSessionComplete: () => {} };
it('releases a camera stream that arrives after closing the screen', async () => {
  let resolve!: (stream: unknown) => void;
  const stop = vi.fn();
  Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: { getUserMedia: vi.fn(() => new Promise(r => { resolve = r; })) } });
  const { rerender } = render(<PlayCamModal {...props} isOpen />);
  rerender(<PlayCamModal {...props} isOpen={false} />);
  await act(async () => { resolve({ active: true, getTracks: () => [{ stop }] }); });
  expect(stop).toHaveBeenCalledOnce();
});
it('releases an active stream on unmount', async () => {
  const stop = vi.fn();
  const getUserMedia = vi.fn().mockResolvedValue({ active: true, getTracks: () => [{ stop }] });
  Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: { getUserMedia } });
  const { unmount } = render(<PlayCamModal {...props} isOpen />);
  await act(async () => {}); unmount();
  expect(stop).toHaveBeenCalledOnce();
  expect(getUserMedia.mock.calls[0][0].audio).toBe(false);
});
it('offers a photo fallback after denial without a demo capture', async () => {
  Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: { getUserMedia: vi.fn().mockRejectedValue(new Error('denied')) } });
  render(<PlayCamModal {...props} isOpen />);
  await waitFor(() => expect(screen.getByText('Camera unavailable')).toBeTruthy());
  expect(screen.queryByText('Use Demo Photo')).toBe(null);
  expect(screen.getByText('Upload Pup Photo')).toBeTruthy();
});
