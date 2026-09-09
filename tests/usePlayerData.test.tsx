import { act, renderHook, waitFor, cleanup } from '@testing-library/react';
import { beforeEach, afterEach, expect, it, vi } from 'vitest';
import { emptyPlayerData, playerStorageKey } from '../src/lib/playerData';
const cloud = vi.hoisted(() => ({ auth: { currentUser: { uid: 'a' } as { uid: string } | null },
  fetchDogProfileFromCloud: vi.fn(), fetchSessionsFromCloud: vi.fn(), saveDogProfileToCloud: vi.fn(),
  saveSessionToCloud: vi.fn(), syncUserProfileAndUsage: vi.fn() }));
vi.mock('../src/lib/firebase', () => cloud);
vi.mock('../src/lib/device', () => ({ persistDeviceData: (key: string, value: string | null) => {
  value === null ? localStorage.removeItem(key) : localStorage.setItem(key, value); return Promise.resolve(); } }));
import { usePlayerData } from '../src/hooks/usePlayerData';
const user = { uid: 'a', email: 'a@example.test', displayName: 'A', photoURL: null, provider: 'email' as const };
beforeEach(() => {
  localStorage.clear(); vi.clearAllMocks(); cloud.auth.currentUser = { uid: 'a' };
  cloud.fetchDogProfileFromCloud.mockResolvedValue(null); cloud.fetchSessionsFromCloud.mockResolvedValue([]);
  cloud.saveDogProfileToCloud.mockResolvedValue(undefined); cloud.saveSessionToCloud.mockResolvedValue(undefined);
  cloud.syncUserProfileAndUsage.mockResolvedValue(undefined);
});
afterEach(cleanup);
it('does not import guest data on sign in and preserves the cloud profile', async () => {
  const guest = emptyPlayerData(); guest.profile.name = 'Guest dog';
  localStorage.setItem(playerStorageKey(), JSON.stringify(guest));
  const profile = { ...emptyPlayerData().profile, name: 'Cloud dog', hasCompletedOnboarding: true };
  cloud.fetchDogProfileFromCloud.mockResolvedValue(profile);
  const { result } = renderHook(() => usePlayerData(user));
  await waitFor(() => expect(result.current.initialized).toBe(true));
  expect(result.current.profile.name).toBe('Cloud dog');
  expect(cloud.saveDogProfileToCloud).not.toHaveBeenCalled();
  expect(JSON.parse(localStorage.getItem(playerStorageKey())!).profile.name).toBe('Guest dog');
});
it('ignores cloud results after the account screen has unmounted', async () => {
  let resolve!: (value: unknown) => void;
  cloud.fetchDogProfileFromCloud.mockImplementation(() => new Promise(r => { resolve = r; }));
  const hook = renderHook(() => usePlayerData(user));
  hook.unmount(); cloud.auth.currentUser = { uid: 'b' };
  await act(async () => { resolve({ ...emptyPlayerData().profile, name: 'Old account' }); });
  expect(localStorage.getItem(playerStorageKey('b'))).toBe(null);
  expect(cloud.saveDogProfileToCloud).not.toHaveBeenCalled();
});
it('reports failed writes and never marks an unconfirmed session as saved', async () => {
  const data = emptyPlayerData(); data.sessions = [{ id: 's', gameId: 'g', gameTitle: 'Play', category: 'curiosity',
    dogId: 'dog', dogName: 'Pup', durationSeconds: 60, mode: 'timer', timestamp: new Date().toISOString(), isCloudSaved: false }];
  localStorage.setItem(playerStorageKey('a'), JSON.stringify(data));
  cloud.saveSessionToCloud.mockRejectedValue(new Error('offline'));
  const { result } = renderHook(() => usePlayerData(user));
  await waitFor(() => expect(result.current.error).toContain('could not finish'));
  expect(result.current.sessions[0].isCloudSaved).toBe(false);
});
it('pauses pending writes before deleting or signing out', async () => {
  const { result } = renderHook(() => usePlayerData(user));
  await waitFor(() => expect(result.current.initialized).toBe(true));
  await act(async () => { await result.current.pause(); });
  cloud.saveDogProfileToCloud.mockClear();
  act(() => result.current.saveProfile({ ...emptyPlayerData().profile, name: 'New' }));
  await act(async () => { await result.current.sync(); });
  expect(cloud.saveDogProfileToCloud).not.toHaveBeenCalled();
});
