import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { DogProfile, PlaySession, UserAccount } from '../types';

// Initialize Firebase App singleton
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

// Use the provisioned database ID or default
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Auth Providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope('email');
facebookProvider.addScope('public_profile');

// Known Super Admin email addresses
export const ADMIN_EMAILS = [
  'donatasgricius123@gmail.com',
];

export function isUserAdmin(user: UserAccount | null | undefined): boolean {
  if (!user) return false;
  if (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) {
    return true;
  }
  return user.role === 'admin';
}

// Map Firebase User to our UserAccount type
export function mapFirebaseUser(user: User, additionalData?: Partial<UserAccount>): UserAccount {
  let provider: UserAccount['provider'] = 'email';
  const providerData = user.providerData[0];
  if (providerData) {
    if (providerData.providerId === 'google.com') provider = 'google';
    else if (providerData.providerId === 'facebook.com') provider = 'facebook';
    else if (providerData.providerId.includes('instagram')) provider = 'instagram';
    else if (providerData.providerId === 'password') provider = 'email';
    else provider = 'other';
  }

  const isAdmin = (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) || additionalData?.role === 'admin';

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || user.email?.split('@')[0] || 'Pup Parent',
    photoURL: user.photoURL,
    provider,
    createdAt: user.metadata.creationTime,
    role: isAdmin ? 'admin' : (additionalData?.role || 'pet_parent'),
    ...additionalData,
  };
}

// Social Sign-in Methods
export async function signInWithGoogle(): Promise<UserAccount> {
  const result = await signInWithPopup(auth, googleProvider);
  return mapFirebaseUser(result.user);
}

export async function signInWithFacebook(): Promise<UserAccount> {
  const result = await signInWithPopup(auth, facebookProvider);
  return mapFirebaseUser(result.user);
}

export async function signInWithInstagram(): Promise<UserAccount> {
  // Instagram uses OAuth through Meta / OAuthProvider
  try {
    const instagramProvider = new OAuthProvider('instagram.com');
    const result = await signInWithPopup(auth, instagramProvider);
    return mapFirebaseUser(result.user);
  } catch {
    // If custom instagram.com provider is not activated in Google Cloud console,
    // gracefully attempt Facebook/Meta OAuth which connects Instagram accounts
    const result = await signInWithPopup(auth, facebookProvider);
    const userAcc = mapFirebaseUser(result.user);
    userAcc.provider = 'instagram';
    return userAcc;
  }
}

export async function signUpWithEmail(
  email: string,
  pass: string,
  displayName: string
): Promise<UserAccount> {
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  if (displayName.trim()) {
    await updateProfile(result.user, { displayName: displayName.trim() });
  }
  return mapFirebaseUser(result.user);
}

export async function logInWithEmail(email: string, pass: string): Promise<UserAccount> {
  const result = await signInWithEmailAndPassword(auth, email, pass);
  return mapFirebaseUser(result.user);
}

export async function logOutUser(): Promise<void> {
  await firebaseSignOut(auth);
}

// ----------------------------------------------------
// FIRESTORE CLOUD PERSISTENCE HELPERS
// ----------------------------------------------------

/**
 * Save / sync Dog Profile into Firestore under users/{userId}
 */
export async function saveDogProfileToCloud(userId: string, profile: DogProfile): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(
      userRef,
      {
        dogProfile: profile,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Failed to save dog profile to cloud:', error);
  }
}

/**
 * Fetch Dog Profile from Firestore
 */
export async function fetchDogProfileFromCloud(userId: string): Promise<DogProfile | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data.dogProfile) {
        return data.dogProfile as DogProfile;
      }
    }
  } catch (error) {
    console.error('Failed to fetch dog profile from cloud:', error);
  }
  return null;
}

/**
 * Save a single PlaySession to users/{userId}/sessions/{sessionId}
 */
export async function saveSessionToCloud(userId: string, session: PlaySession): Promise<void> {
  try {
    const sessionRef = doc(db, 'users', userId, 'sessions', session.id);
    await setDoc(
      sessionRef,
      {
        ...session,
        isCloudSaved: true,
        savedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Failed to save session to cloud:', error);
    throw error;
  }
}

/**
 * Fetch all sessions for a user from Firestore
 */
export async function fetchSessionsFromCloud(userId: string): Promise<PlaySession[]> {
  try {
    const sessionsCol = collection(db, 'users', userId, 'sessions');
    const q = query(sessionsCol, orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    const results: PlaySession[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      results.push({
        id: docSnap.id,
        gameId: data.gameId || '',
        gameTitle: data.gameTitle || 'Game',
        category: data.category || 'agility',
        dogId: data.dogId || 'dog-1',
        dogName: data.dogName || 'Pup',
        durationSeconds: data.durationSeconds || 0,
        mode: data.mode || 'timer',
        timestamp: data.timestamp || new Date().toISOString(),
        notes: data.notes || '',
        rating: data.rating,
        photoOrVideoUrl: data.photoOrVideoUrl,
        isCloudSaved: true,
      });
    });
    return results;
  } catch (error) {
    console.error('Failed to fetch sessions from cloud:', error);
    return [];
  }
}

/**
 * Sync all local sessions to cloud on sign-in
 */
export async function syncAllSessionsToCloud(
  userId: string,
  localSessions: PlaySession[]
): Promise<PlaySession[]> {
  try {
    // 1. Fetch existing cloud sessions
    const cloudSessions = await fetchSessionsFromCloud(userId);
    const cloudMap = new Map<string, PlaySession>();
    cloudSessions.forEach((s) => cloudMap.set(s.id, s));

    // 2. Upload any local sessions not yet in cloud
    const uploadPromises = localSessions.map(async (local) => {
      if (!cloudMap.has(local.id)) {
        await saveSessionToCloud(userId, local);
        cloudMap.set(local.id, { ...local, isCloudSaved: true });
      }
    });
    await Promise.all(uploadPromises);

    // 3. Return combined sorted by timestamp descending
    const merged = Array.from(cloudMap.values()).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    return merged;
  } catch (error) {
    console.error('Failed to sync all sessions to cloud:', error);
    return localSessions;
  }
}

/**
  * Record or update user account and usage heartbeat in Firestore
  */
export async function syncUserProfileAndUsage(
  user: UserAccount,
  dogProfile?: DogProfile,
  sessionCount?: number,
  totalPlaySeconds?: number
): Promise<void> {
  try {
    const userRef = doc(db, 'users', user.uid);
    const updatePayload: Record<string, any> = {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      provider: user.provider,
      role: user.role || (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase()) ? 'admin' : 'pet_parent'),
      lastActiveAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (user.createdAt) {
      updatePayload.createdAt = user.createdAt;
    }
    if (dogProfile) {
      updatePayload.dogProfile = dogProfile;
    }
    if (typeof sessionCount === 'number') {
      updatePayload.sessionCount = sessionCount;
    }
    if (typeof totalPlaySeconds === 'number') {
      updatePayload.totalPlaySeconds = totalPlaySeconds;
    }

    await setDoc(userRef, updatePayload, { merge: true });
  } catch (error) {
    console.error('Failed to sync user profile and usage stats:', error);
  }
}

/**
 * Fetch all registered users for Admin Overview
 */
export async function fetchAllUsersForAdmin(): Promise<UserAccount[]> {
  try {
    const usersCol = collection(db, 'users');
    const snapshot = await getDocs(usersCol);
    const usersList: UserAccount[] = [];

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      usersList.push({
        uid: docSnap.id,
        email: data.email || null,
        displayName: data.displayName || 'Pup Parent',
        photoURL: data.photoURL || null,
        provider: data.provider || 'email',
        role: data.role || (data.email && ADMIN_EMAILS.includes(data.email.toLowerCase()) ? 'admin' : 'pet_parent'),
        createdAt: data.createdAt || new Date().toISOString(),
        lastActiveAt: data.lastActiveAt,
        sessionCount: data.sessionCount || 0,
        totalPlaySeconds: data.totalPlaySeconds || 0,
        dogProfile: data.dogProfile,
      });
    });

    // Sort by recent activity or sign up
    return usersList.sort((a, b) => {
      const dateA = new Date(a.lastActiveAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.lastActiveAt || b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  } catch (error) {
    console.error('Failed to fetch admin users:', error);
    return [];
  }
}

/**
 * Fetch all sessions across all users (for Admin Statistics)
 */
export async function fetchAllUsersSessionsForAdmin(users: UserAccount[]): Promise<PlaySession[]> {
  try {
    const allSessions: PlaySession[] = [];
    const promises = users.map(async (u) => {
      try {
        const uSessions = await fetchSessionsFromCloud(u.uid);
        allSessions.push(...uSessions);
      } catch (e) {
        console.error(`Failed to fetch sessions for ${u.uid}:`, e);
      }
    });

    await Promise.all(promises);
    return allSessions;
  } catch (error) {
    console.error('Failed to fetch all sessions for admin:', error);
    return [];
  }
}

// ----------------------------------------------------
// CUSTOM GAMES MANAGEMENT (ADMIN)
// ----------------------------------------------------

/**
 * Fetch all custom/managed games from Firestore
 */
export async function fetchCustomGamesFromCloud(): Promise<any[]> {
  try {
    const gamesCol = collection(db, 'custom_games');
    const snapshot = await getDocs(gamesCol);
    const games: any[] = [];
    snapshot.forEach((docSnap) => {
      games.push({
        id: docSnap.id,
        ...docSnap.data(),
      });
    });
    return games;
  } catch (error) {
    console.error('Failed to fetch custom games from Firestore:', error);
    return [];
  }
}

/**
 * Save / Update a game in Firestore (Admin)
 */
export async function saveCustomGameToCloud(game: any): Promise<void> {
  try {
    const gameRef = doc(db, 'custom_games', game.id);
    await setDoc(gameRef, {
      ...game,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    console.error('Failed to save game to Firestore:', error);
    throw error;
  }
}

/**
 * Delete a custom game from Firestore (Admin)
 */
export async function deleteCustomGameFromCloud(gameId: string): Promise<void> {
  try {
    const gameRef = doc(db, 'custom_games', gameId);
    await deleteDoc(gameRef);
  } catch (error) {
    console.error('Failed to delete game from Firestore:', error);
    throw error;
  }
}
