import type { DogProfile, PlaySession } from '../types';

export interface PlayerData {
  profile: DogProfile;
  sessions: PlaySession[];
  unlocked: boolean;
  profileDirty: boolean;
}

export function emptyPlayerData(): PlayerData {
  return {
    profile: { id: 'dog-1', name: '', breed: '', size: 'medium', energyLevel: 'medium',
      isFoodMotivated: false, motivations: ['toys_fetch', 'praise_affection'], avatarEmoji: '🐕',
      playOClockTime: '17:30', dailyGoalGames: 2, streakCount: 0,
      hasCompletedOnboarding: false, createdAt: new Date().toISOString() },
    sessions: [], unlocked: true, profileDirty: false,
  };
}

export const playerStorageKey = (uid?: string) => `wagging-tail:v1:${uid ? `user:${uid}` : 'guest'}`;

export function readPlayerData(storage: Pick<Storage, 'getItem'>, uid?: string): PlayerData {
  const fallback = emptyPlayerData();
  try {
    const data = JSON.parse(storage.getItem(playerStorageKey(uid)) || 'null');
    if (!data || !data.profile || typeof data.profile.name !== 'string' ||
      !Array.isArray(data.profile.motivations) || !Array.isArray(data.sessions)) return fallback;
    return { ...fallback, ...data, profile: { ...fallback.profile, ...data.profile },
      sessions: data.sessions.filter((s: PlaySession) => typeof s.id === 'string' &&
        Number.isFinite(Date.parse(s.timestamp)) && Number.isFinite(s.durationSeconds) && s.durationSeconds >= 0) };
  } catch { return fallback; }
}

export function mergeSessions(cloud: PlaySession[], local: PlaySession[]): PlaySession[] {
  const map = new Map(cloud.map(s => [s.id, s]));
  for (const session of local) if (!map.has(session.id)) map.set(session.id, session);
  return [...map.values()].sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
}

export function localDay(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export function playStreak(sessions: PlaySession[], now = new Date()): number {
  const days = new Set(sessions.filter(s => s.durationSeconds > 0).map(s => localDay(new Date(s.timestamp))));
  const cursor = new Date(now);
  cursor.setHours(12, 0, 0, 0);
  if (!days.has(localDay(cursor))) cursor.setDate(cursor.getDate() - 1);
  let count = 0;
  while (days.has(localDay(cursor))) { count++; cursor.setDate(cursor.getDate() - 1); }
  return count;
}

// Session metadata is portable; temporary media previews must never be uploaded to Firestore.
export function sessionMetadata(session: PlaySession): PlaySession {
  const { photoOrVideoUrl, ...metadata } = session;
  return JSON.parse(JSON.stringify(metadata));
}
