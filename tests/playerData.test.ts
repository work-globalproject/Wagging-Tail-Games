import { describe, it, expect } from 'vitest';
import { emptyPlayerData, mergeSessions, playStreak, playerStorageKey, readPlayerData, sessionMetadata } from '../src/lib/playerData';
import type { PlaySession } from '../src/types';
const session = (id: string, timestamp: string): PlaySession => ({ id, timestamp, gameId: 'game',
  gameTitle: 'Play', dogId: 'dog', dogName: 'Buddy', category: 'curiosity', durationSeconds: 60, mode: 'timer' });
describe('private play data', () => {
  it('starts empty and keeps guest and account keys distinct', () => {
    expect(emptyPlayerData().sessions).toEqual([]);
    expect(new Set([playerStorageKey(), playerStorageKey('a'), playerStorageKey('b')]).size).toBe(3);
  });
  it('ignores malformed saved data without importing legacy shared data', () => {
    expect(readPlayerData({ getItem: () => '{bad' }).sessions).toEqual([]);
    expect(readPlayerData({ getItem: () => JSON.stringify({ profile: { name: 'Bad' }, sessions: {} }) }).profile.name).toBe('');
  });
  it('merges repeated syncs without duplicate sessions or losing cloud confirmation', () => {
    const a = session('a', '2026-09-07T12:00:00Z');
    const b = session('b', '2026-09-08T12:00:00Z');
    const merged = mergeSessions([{ ...a, isCloudSaved: true }], [a, b]);
    expect(merged.map(s => s.id)).toEqual(['b', 'a']);
    expect(merged[1].isCloudSaved).toBe(true);
    expect(mergeSessions(merged, [a, b])).toHaveLength(2);
  });
  it('counts consecutive calendar days, not sessions', () => {
    const now = new Date(2026, 8, 8, 15);
    const sessions = [8, 8, 7, 6].map((day, i) => session(String(i), new Date(2026, 8, day, 12).toISOString()));
    expect(playStreak(sessions, now)).toBe(3);
    expect(playStreak(sessions.slice(2), now)).toBe(2);
    expect(playStreak([sessions[3]], now)).toBe(0);
    expect(playStreak([], now)).toBe(0);
  });
  it('strips media and undefined values from portable session metadata', () => {
    const data = sessionMetadata({ ...session('a', new Date().toISOString()), photoOrVideoUrl: 'blob:private', notes: undefined });
    expect(data).not.toHaveProperty('photoOrVideoUrl');
    expect(data).not.toHaveProperty('notes');
  });
});
