import { useCallback, useEffect, useRef, useState } from 'react';
import type { DogProfile, PlaySession, UserAccount } from '../types';
import { auth, fetchDogProfileFromCloud, fetchSessionsFromCloud, saveDogProfileToCloud,
  saveSessionToCloud, syncUserProfileAndUsage } from '../lib/firebase';
import { emptyPlayerData, mergeSessions, playerStorageKey, readPlayerData, sessionMetadata } from '../lib/playerData';
import type { PlayerData } from '../lib/playerData';
import { persistDeviceData } from '../lib/device';

export function usePlayerData(user: UserAccount | null) {
  const [data, setData] = useState(() => readPlayerData(localStorage, user?.uid));
  const [error, setError] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [initialized, setInitialized] = useState(!user || data.profile.hasCompletedOnboarding === true);
  const [revision, setRevision] = useState(0);
  const editVersion = useRef(0);
  const latest = useRef(data);
  const alive = useRef(true);
  const paused = useRef(false);
  const running = useRef<Promise<void> | null>(null);
  const valid = () => alive.current && !paused.current && (!user || auth.currentUser?.uid === user.uid);

  const commit = useCallback((next: PlayerData) => {
    latest.current = next;
    setData(next);
    try { void persistDeviceData(playerStorageKey(user?.uid), JSON.stringify(next)).catch(() =>
      setError('Could not save on this device. Please retry cloud sync before closing the app.')); }
    catch { setError('Your device storage is full or unavailable. Keep this screen open and try cloud sync.'); }
  }, [user?.uid]);

  const sync = useCallback((): Promise<void> => {
    if (!user || !valid()) return Promise.resolve();
    if (running.current) return running.current;
    const startedVersion = editVersion.current;
    const operation = async () => {
      setSyncing(true);
      setError('');
      try {
        const [cloudProfile, cloudSessions] = await Promise.all([
          fetchDogProfileFromCloud(user.uid), fetchSessionsFromCloud(user.uid),
        ]);
        if (!valid()) return;
        const snapshot = latest.current;
        const profile = snapshot.profileDirty || !cloudProfile ? snapshot.profile : cloudProfile;
        commit({ ...snapshot, profile, sessions: mergeSessions(cloudSessions, snapshot.sessions) });
        if (snapshot.profileDirty) {
          await saveDogProfileToCloud(user.uid, profile);
          if (!valid()) return;
          if (latest.current.profile === profile) commit({ ...latest.current, profileDirty: false });
        }
        const cloudIds = new Set(cloudSessions.map(s => s.id));
        for (const session of latest.current.sessions) {
          if (!valid()) return;
          if (!cloudIds.has(session.id)) await saveSessionToCloud(user.uid, session);
          if (!valid()) return;
          commit({ ...latest.current, sessions: latest.current.sessions.map(s =>
            s.id === session.id ? { ...s, isCloudSaved: true } : s) });
        }
        if (!valid()) return;
        await syncUserProfileAndUsage(user, undefined, latest.current.sessions.length,
          latest.current.sessions.reduce((total, s) => total + s.durationSeconds, 0));
      } catch (e) {
        if (valid()) setError('Cloud sync could not finish. Your changes remain on this device. Check your connection and retry.');
        throw e;
      } finally { if (alive.current) { setSyncing(false); setInitialized(true); } }
    };
    running.current = operation().finally(() => {
      running.current = null;
      if (valid() && editVersion.current !== startedVersion) void sync().catch(() => {});
    });
    return running.current;
  }, [user?.uid, commit]);

  useEffect(() => {
    alive.current = true;
    void sync().catch(() => {});
    const online = () => { void sync().catch(() => {}); };
    window.addEventListener('online', online);
    return () => { alive.current = false; window.removeEventListener('online', online); };
  }, [sync]);

  useEffect(() => {
    if (!user || paused.current || revision === 0) return;
    const timer = window.setTimeout(() => { void sync().catch(() => {}); }, 1200);
    return () => window.clearTimeout(timer);
  }, [revision, user?.uid, sync]);

  const edited = () => { editVersion.current++; setRevision(editVersion.current); };
  const saveProfile = (profile: DogProfile) => { commit({ ...latest.current, profile, profileDirty: true }); edited(); };
  const addSession = (session: PlaySession) => {
    const cleaned = { ...sessionMetadata(session), isCloudSaved: false };
    commit({ ...latest.current, sessions: mergeSessions(latest.current.sessions, [cleaned]) });
    edited();
  };
  const importGuest = () => {
    const guest = readPlayerData(localStorage);
    const current = latest.current;
    commit({ ...current, sessions: mergeSessions(current.sessions, guest.sessions.map(s => ({ ...s, isCloudSaved: false }))),
      ...(!current.profile.hasCompletedOnboarding && guest.profile.hasCompletedOnboarding
        ? { profile: guest.profile, profileDirty: true } : {}) });
    edited();
  };
  const pause = async (waitForWrites = true) => {
    paused.current = true;
    if (waitForWrites) await running.current?.catch(() => {});
  };
  const resume = () => { paused.current = false; };
  const clear = () => {
    void persistDeviceData(playerStorageKey(user?.uid), null);
    latest.current = emptyPlayerData();
    setData(latest.current);
  };
  return { ...data, error, syncing, initialized, saveProfile, addSession, sync, importGuest, pause, resume, clear };
}
