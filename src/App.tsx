/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Game, DogProfile, PlaySession, FilterOptions, EnergyLevel, Environment, UserAccount } from './types';
import { GAMES_DATA } from './data/games';
import { GameCard } from './components/GameCard';
import { SwipeableGamesCarousel } from './components/SwipeableGamesCarousel';
import { GameDetailModal } from './components/GameDetailModal';
import { PlayTimerModal } from './components/PlayTimerModal';
import { PlayCamModal } from './components/PlayCamModal';
import { DogProfileModal } from './components/DogProfileModal';
import { SurpriseModal } from './components/SurpriseModal';
import { StatsDashboard } from './components/StatsDashboard';
import { ShareCardModal } from './components/ShareCardModal';
import { StoryShareModal } from './components/StoryShareModal';
import { OnboardingFlow } from './components/OnboardingFlow';
import { PlayOClockCard } from './components/PlayOClockCard';
import CloudSyncBanner from './components/CloudSyncBanner';
import AuthModal from './components/AuthModal';
import AccountModal from './components/AccountModal';
import AdminUsersDashboard from './components/AdminUsersDashboard';
import AdminGamesManager from './components/AdminGamesManager';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import WaggingTailLogo from './components/WaggingTailLogo';
import { onAuthStateChanged } from 'firebase/auth';
import {
  auth,
  mapFirebaseUser,
  isUserAdmin,
  saveDogProfileToCloud,
  fetchDogProfileFromCloud,
  saveSessionToCloud,
  syncAllSessionsToCloud,
  syncUserProfileAndUsage,
  fetchCustomGamesFromCloud,
  saveCustomGameToCloud,
  deleteCustomGameFromCloud,
} from './lib/firebase';
import { 
  Sparkles, 
  Dices, 
  Search, 
  Flame, 
  SlidersHorizontal,
  RotateCcw,
  Award,
  Gamepad2,
  Clock,
  Instagram,
  BarChart3,
  User,
  Bell,
  Volume2,
  Cloud,
  LogIn,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { soundFx } from './utils/audio';

const STORAGE_PROFILE_KEY = 'paws_and_play_dog_profile';
const STORAGE_SESSIONS_KEY = 'paws_and_play_sessions';
const STORAGE_UNLOCKED_KEY = 'paws_and_play_unlocked_bonus';

const DEFAULT_PROFILE: DogProfile = {
  id: 'dog-1',
  name: '',
  breed: '',
  size: 'medium',
  energyLevel: 'high',
  isFoodMotivated: false, // Default active non-food dog based on prompt
  motivations: ['toys_fetch', 'chase_speed', 'tug', 'praise_affection'],
  avatarEmoji: '🐕',
  playOClockTime: '17:30',
  dailyGoalGames: 2,
  streakCount: 3,
  hasCompletedOnboarding: false, // Triggers mobile onboarding wizard first
  createdAt: new Date().toISOString(),
};

const DEFAULT_SESSIONS: PlaySession[] = [
  {
    id: 'sample-1',
    gameId: 'broomstick-limbo-hurdles',
    gameTitle: 'Broomstick Limbo & Hurdles',
    category: 'agility',
    dogId: 'dog-1',
    dogName: 'Barnaby',
    durationSeconds: 480,
    mode: 'timer',
    timestamp: new Date().toISOString(),
    rating: 5,
    notes: 'Cleared all three jumps like a champ!',
  },
  {
    id: 'sample-2',
    gameId: 'snuffle-mat-dig',
    gameTitle: 'Snuffle Mat Treasure Dig',
    category: 'curiosity',
    dogId: 'dog-1',
    dogName: 'Barnaby',
    durationSeconds: 600,
    mode: 'video',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    rating: 5,
    notes: 'Used fleece strips with squeaky toy prize!',
  },
  {
    id: 'sample-3',
    gameId: 'cup-shuffle',
    gameTitle: 'The Great Cup Shuffle',
    category: 'problem_solving',
    dogId: 'dog-1',
    dogName: 'Barnaby',
    durationSeconds: 420,
    mode: 'quick',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    rating: 4,
  }
];

type MainTab = 'games' | 'streaks' | 'story' | 'activity' | 'admin' | 'admin_games';
const STORAGE_CUSTOM_GAMES_KEY = 'paws_and_play_custom_games';

export default function App() {
  // Persistence
  const [profile, setProfile] = useState<DogProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROFILE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed;
      }
      return DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [sessions, setSessions] = useState<PlaySession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SESSIONS_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_SESSIONS;
    } catch {
      return DEFAULT_SESSIONS;
    }
  });

  const [unlockedBonusGames, setUnlockedBonusGames] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_UNLOCKED_KEY);
      return saved === 'true';
    } catch {
      return false;
    }
  });

  // Custom & Admin Managed Games Catalog
  const [customGames, setCustomGames] = useState<Game[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CUSTOM_GAMES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Load custom games from Firestore
  useEffect(() => {
    const loadCloudGames = async () => {
      try {
        const cloudGames = await fetchCustomGamesFromCloud();
        if (cloudGames && cloudGames.length > 0) {
          setCustomGames(cloudGames);
          localStorage.setItem(STORAGE_CUSTOM_GAMES_KEY, JSON.stringify(cloudGames));
        }
      } catch (e) {
        console.error('Failed to load custom games from cloud:', e);
      }
    };
    loadCloudGames();
  }, []);

  // Save custom games locally
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CUSTOM_GAMES_KEY, JSON.stringify(customGames));
    } catch (e) {
      console.error(e);
    }
  }, [customGames]);

  // Combined master games list
  const allMasterGames = useMemo(() => {
    const customMap = new Map<string, Game>();
    customGames.forEach(g => customMap.set(g.id, g));

    // Base games merged with custom overrides or additions
    const baseMerged = GAMES_DATA.map(g => customMap.get(g.id) || g);
    const addedCustom = customGames.filter(g => !GAMES_DATA.some(bg => bg.id === g.id));
    return [...baseMerged, ...addedCustom];
  }, [customGames]);

  // Mobile navigation tabs
  const [currentTab, setCurrentTab] = useState<MainTab>('games');

  // Filters
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'all',
    energyLevel: 'all',
    environment: 'all',
    skill: 'all',
    onlyNonFoodFriendly: !profile.isFoodMotivated,
    searchQuery: '',
  });

  // Sync non-food filter when profile food motivation changes
  useEffect(() => {
    if (!profile.isFoodMotivated) {
      setFilters(f => ({ ...f, onlyNonFoodFriendly: true }));
    }
  }, [profile.isFoodMotivated]);

  // Modals state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedGameForDetail, setSelectedGameForDetail] = useState<Game | null>(null);
  const [selectedGameForTimer, setSelectedGameForTimer] = useState<Game | null>(null);
  const [selectedGameForVideo, setSelectedGameForVideo] = useState<Game | null>(null);
  const [isSurpriseModalOpen, setIsSurpriseModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);

  // Cloud Account & Auth State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [authPromptContext, setAuthPromptContext] = useState<string | undefined>(undefined);

  // Listen to Firebase Auth state & sync data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const userAccount = mapFirebaseUser(fbUser);
        setCurrentUser(userAccount);

        // Sync dog profile with cloud
        try {
          const cloudProfile = await fetchDogProfileFromCloud(fbUser.uid);
          if (cloudProfile && cloudProfile.name) {
            setProfile(cloudProfile);
          } else if (profile.name) {
            await saveDogProfileToCloud(fbUser.uid, profile);
          }
        } catch (e) {
          console.error('Error fetching cloud dog profile:', e);
        }

        // Sync and merge sessions
        try {
          const mergedSessions = await syncAllSessionsToCloud(fbUser.uid, sessions);
          setSessions(mergedSessions);

          // Update user usage profile in Firestore for Admin Intelligence
          const totalPlaySecs = mergedSessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0);
          await syncUserProfileAndUsage(
            userAccount,
            profile,
            mergedSessions.length,
            totalPlaySecs
          );
        } catch (e) {
          console.error('Error syncing sessions with cloud:', e);
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SESSIONS_KEY, JSON.stringify(sessions));
    } catch (e) {
      console.error(e);
    }
  }, [sessions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_UNLOCKED_KEY, String(unlockedBonusGames));
    } catch (e) {
      console.error(e);
    }
  }, [unlockedBonusGames]);

  // Handle Onboarding Completion
  const handleOnboardingComplete = (completedProfile: DogProfile) => {
    setProfile(completedProfile);
    if (currentUser) {
      saveDogProfileToCloud(currentUser.uid, completedProfile).catch(console.error);
    }
    // Automatically switch to games tab
    setCurrentTab('games');
  };

  const handleProfileSave = (updated: DogProfile) => {
    setProfile(updated);
    if (currentUser) {
      saveDogProfileToCloud(currentUser.uid, updated).catch(console.error);
    }
  };

  const handleAuthSuccess = async (user: UserAccount) => {
    setCurrentUser(user);
    try {
      if (profile.name) {
        await saveDogProfileToCloud(user.uid, profile);
      }
      const merged = await syncAllSessionsToCloud(user.uid, sessions);
      setSessions(merged);
    } catch (e) {
      console.error('Post-auth sync error:', e);
    }
  };

  const handleManualSync = async () => {
    if (!currentUser) return;
    try {
      await saveDogProfileToCloud(currentUser.uid, profile);
      const merged = await syncAllSessionsToCloud(currentUser.uid, sessions);
      setSessions(merged);
    } catch (e) {
      console.error('Manual sync failed:', e);
      throw e;
    }
  };

  // Compute filtered games (using allMasterGames, filtering out archived games unless in admin mode)
  const filteredGames = useMemo(() => {
    return allMasterGames.filter((game) => {
      // Hide archived games from main player feed
      if (game.isArchived) {
        return false;
      }

      // Hide secret bonus games unless unlocked
      if (game.isSecret && !unlockedBonusGames) {
        return false;
      }

      // Category filter
      if (filters.category !== 'all' && game.category !== filters.category) {
        return false;
      }

      // Energy Level filter
      if (filters.energyLevel !== 'all' && game.energyLevel !== filters.energyLevel) {
        return false;
      }

      // Environment filter
      if (filters.environment !== 'all') {
        if (game.environment !== 'both' && game.environment !== filters.environment) {
          return false;
        }
      }

      // Skill filter
      if (filters.skill !== 'all') {
        const hasSkill = game.skillBuilds?.some(s => s.toLowerCase().includes(filters.skill.toLowerCase()));
        if (!hasSkill) return false;
      }

      // Non-food friendly toggle
      if (filters.onlyNonFoodFriendly) {
        if (!game.nonFoodAlternative) return false;
      }

      // Search query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesTitle = game.title.toLowerCase().includes(q);
        const matchesTag = game.tagline.toLowerCase().includes(q);
        const matchesMat = game.materials.some(m => m.toLowerCase().includes(q));
        const matchesSkills = game.skillBuilds?.some(s => s.toLowerCase().includes(q));
        if (!matchesTitle && !matchesTag && !matchesMat && !matchesSkills) {
          return false;
        }
      }

      return true;
    });
  }, [allMasterGames, filters, unlockedBonusGames]);

  // Admin Game Management Handlers
  const handleAdminSaveGame = async (gameToSave: Game) => {
    // 1. Save to cloud
    try {
      await saveCustomGameToCloud(gameToSave);
    } catch (e) {
      console.warn('Could not save to Firestore, continuing with local state:', e);
    }

    // 2. Update local state
    setCustomGames(prev => {
      const idx = prev.findIndex(g => g.id === gameToSave.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = gameToSave;
        return updated;
      } else {
        return [gameToSave, ...prev];
      }
    });
  };

  const handleAdminDeleteGame = async (gameId: string) => {
    try {
      await deleteCustomGameFromCloud(gameId);
    } catch (e) {
      console.warn('Could not delete from Firestore, deleting locally:', e);
    }
    setCustomGames(prev => prev.filter(g => g.id !== gameId));
  };

  const handleAdminToggleArchive = async (gameId: string, isArchived: boolean) => {
    const existing = allMasterGames.find(g => g.id === gameId);
    if (!existing) return;
    const updatedGame = { ...existing, isArchived, updatedAt: new Date().toISOString() };
    await handleAdminSaveGame(updatedGame);
  };

  const handleSessionComplete = (newSession: PlaySession) => {
    const sessionToSave: PlaySession = {
      ...newSession,
      isCloudSaved: !!currentUser,
    };

    if (currentUser) {
      saveSessionToCloud(currentUser.uid, sessionToSave).catch(console.error);
    }

    setSessions(prev => [sessionToSave, ...prev]);

    // increment streak and update profile in state and cloud
    setProfile(prev => {
      const updated = {
        ...prev,
        streakCount: (prev.streakCount || 1) + 1,
      };
      if (currentUser) {
        saveDogProfileToCloud(currentUser.uid, updated).catch(console.error);
      }
      return updated;
    });
  };

  const handleUnlockBonus = () => {
    setUnlockedBonusGames(true);
  };

  // Today count
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySessionsCount = sessions.filter(s => s.timestamp.startsWith(todayStr)).length;

  // If the user hasn't completed onboarding yet, render the mobile-first Onboarding Flow!
  if (!profile.hasCompletedOnboarding) {
    return (
      <OnboardingFlow
        initialProfile={profile}
        onComplete={handleOnboardingComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FCFD] text-[#184D7A] flex flex-col selection:bg-[#40B3C9]/30 antialiased pb-24 sm:pb-28">
      {/* Mobile-First Sticky Top App Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#184D7A]/10 shadow-2xs">
        <div className="max-w-md sm:max-w-2xl lg:max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          {/* Brand & Dog Name with Wagging Tail Logo */}
          <div 
            onClick={() => {
              soundFx.playBoop(600);
              setCurrentTab('games');
            }}
            className="flex items-center gap-2 cursor-pointer group"
            title="Wagging Tail Games — Home"
          >
            <WaggingTailLogo size="sm" variant="horizontal" showSubtitle={false} />
            <div className="hidden sm:block border-l border-[#184D7A]/15 pl-2.5 ml-0.5">
              <p className="text-[11px] font-bold text-[#184D7A] leading-none">
                Playing with {profile.name || 'Pup'}
              </p>
              <p className="text-[9px] font-semibold text-[#40B3C9] tracking-wider mt-0.5">
                by Leo Boy Games
              </p>
            </div>
          </div>

          {/* Quick Action Chips: Streak, Cloud Account & Profile Pill */}
          <div className="flex items-center gap-2">
            {/* Streak Counter Chip */}
            <button
              id="top-streak-chip"
              onClick={() => {
                soundFx.playBoop(520);
                setCurrentTab('streaks');
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-800 text-xs font-bold transition-all"
              title="View Daily Play Streak"
            >
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
              <span>{profile.streakCount || 1}d</span>
            </button>

            {/* Admin Center Quick Access Chip (for admin accounts) */}
            {isUserAdmin(currentUser) && (
              <button
                id="top-admin-chip"
                onClick={() => {
                  soundFx.playBoop(580);
                  setCurrentTab('admin');
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-black transition-all ${
                  currentTab === 'admin' || currentTab === 'admin_games'
                    ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                    : 'bg-stone-900 text-amber-400 border-stone-800 hover:bg-stone-800'
                }`}
                title="Admin Control Center: Signups, Stats & Games"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            )}

            {/* Cloud Account / Sign In Button */}
            {currentUser ? (
              <button
                id="top-account-chip"
                onClick={() => {
                  soundFx.playBoop(540);
                  setIsAccountModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#40B3C9]/15 hover:bg-[#40B3C9]/25 border border-[#40B3C9]/30 text-[#184D7A] text-xs font-bold transition-all"
                title="Manage Cloud Account & Saved Sessions"
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    className="w-4 h-4 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <User className="w-3.5 h-3.5 text-[#184D7A]" />
                )}
                <span className="hidden sm:inline max-w-[80px] truncate">
                  {currentUser.displayName?.split(' ')[0] || 'Account'}
                </span>
                <Cloud className="w-3 h-3 text-[#40B3C9]" />
              </button>
            ) : (
              <button
                id="top-signin-btn"
                onClick={() => {
                  soundFx.playBoop(560);
                  setAuthPromptContext(`Create an account with Google, Facebook, Instagram, or Email to save ${profile.name || 'your pup'}'s play sessions safely in the cloud.`);
                  setIsAuthModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-[#FF7C00] to-[#FF9820] hover:brightness-105 text-white text-xs font-black shadow-xs active:scale-95 transition-all"
                title="Save Sessions to Cloud Account"
              >
                <Cloud className="w-3.5 h-3.5 text-white" />
                <span className="hidden xs:inline">Sign In / Save</span>
                <span className="xs:hidden">Save</span>
              </button>
            )}

            {/* In-App Mobile Download / Install Pill */}
            <PWAInstallButton dogName={profile.name || 'your pup'} variant="pill" />

            {/* Dog Avatar / Profile Button */}
            <button
              id="top-profile-chip"
              onClick={() => {
                soundFx.playBoop(480);
                setIsProfileModalOpen(true);
              }}
              className="w-8 h-8 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 flex items-center justify-center text-lg active:scale-95 transition-all"
              title="Edit Pup Profile"
            >
              {profile.avatarEmoji || '🐕'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-md sm:max-w-2xl lg:max-w-5xl w-full mx-auto px-4 pt-4 pb-8 space-y-5">
        
        {/* TAB 1: GAMES FEED */}
        {currentTab === 'games' && (
          <div className="space-y-4">
            {/* Play O'Clock daily reminder banner card */}
            <PlayOClockCard
              dogProfile={profile}
              todaySessionsCount={todaySessionsCount}
              onQuickPlay={() => {
                soundFx.playWhistleStart();
                setIsSurpriseModalOpen(true);
              }}
              onOpenReminderSettings={() => setIsProfileModalOpen(true)}
            />

            {/* Mobile Web App Install Banner (auto-hides when installed) */}
            <PWAInstallButton dogName={profile.name || 'your pup'} variant="banner" />

            {/* Cloud Sync Reminder Banner for Guests */}
            {!currentUser && (
              <CloudSyncBanner
                dogName={profile.name || 'your pup'}
                sessionsCount={sessions.length}
                onOpenAuth={() => {
                  setAuthPromptContext(`Create an account with Google, Facebook, Instagram, or Email to back up ${profile.name || 'your pup'}'s play history, streaks, and unlocked bonus games.`);
                  setIsAuthModalOpen(true);
                }}
              />
            )}

            {/* Non-Food Adaptation Indicator Bar */}
            {!profile.isFoodMotivated && (
              <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200/80 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-base">🎾</span>
                  <div>
                    <span className="font-bold text-purple-950">Non-Food Play Mode Active: </span>
                    <span className="text-purple-800">All games tuned with toy & chase swaps for {profile.name}!</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="text-[11px] font-bold text-purple-700 hover:text-purple-900 underline shrink-0"
                >
                  Edit
                </button>
              </div>
            )}

            {/* Horizontal Scrollable Category Filter Pills */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Game Categories
                </span>
                <button
                  id="mobile-filter-drawer-btn"
                  onClick={() => setShowFiltersDrawer(!showFiltersDrawer)}
                  className={`text-xs font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-colors ${
                    showFiltersDrawer ? 'bg-stone-800 text-white border-stone-800' : 'bg-white text-stone-600 border-stone-200'
                  }`}
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>Filters</span>
                </button>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                <button
                  id="cat-pill-all"
                  onClick={() => {
                    soundFx.playBoop(440);
                    setFilters(f => ({ ...f, category: 'all' }));
                  }}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
                    filters.category === 'all'
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                  }`}
                >
                  All ({GAMES_DATA.length})
                </button>

                <button
                  id="cat-pill-curiosity"
                  onClick={() => {
                    soundFx.playBoop(480);
                    setFilters(f => ({ ...f, category: 'curiosity' }));
                  }}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
                    filters.category === 'curiosity'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-white hover:bg-amber-50 text-amber-950 border border-amber-200'
                  }`}
                >
                  <span>👃 Scent & Curiosity (4)</span>
                </button>

                <button
                  id="cat-pill-problem"
                  onClick={() => {
                    soundFx.playBoop(520);
                    setFilters(f => ({ ...f, category: 'problem_solving' }));
                  }}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
                    filters.category === 'problem_solving'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white hover:bg-blue-50 text-blue-950 border border-blue-200'
                  }`}
                >
                  <span>🧩 Problem-Solving (4)</span>
                </button>

                <button
                  id="cat-pill-agility"
                  onClick={() => {
                    soundFx.playBoop(560);
                    setFilters(f => ({ ...f, category: 'agility' }));
                  }}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
                    filters.category === 'agility'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white hover:bg-emerald-50 text-emerald-950 border border-emerald-200'
                  }`}
                >
                  <span>🏃 Agility & Movement (4)</span>
                </button>
              </div>
            </div>

            {/* Expandable Filter Drawer */}
            {showFiltersDrawer && (
              <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-3 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                      Energy Level
                    </label>
                    <select
                      value={filters.energyLevel}
                      onChange={(e) => setFilters(f => ({ ...f, energyLevel: e.target.value as EnergyLevel | 'all' }))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 bg-stone-50"
                    >
                      <option value="all">Any Energy Level</option>
                      <option value="low">Low (Gentle)</option>
                      <option value="medium">Medium (Playful)</option>
                      <option value="high">High (Zoomies!)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                      Search By Keyword or Household Item
                    </label>
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={filters.searchQuery}
                        onChange={(e) => setFilters(f => ({ ...f, searchQuery: e.target.value }))}
                        placeholder="e.g. towel, cups, broom..."
                        className="w-full pl-8 pr-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 bg-stone-50"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-stone-800">
                    <input
                      type="checkbox"
                      checked={filters.onlyNonFoodFriendly}
                      onChange={(e) => setFilters(f => ({ ...f, onlyNonFoodFriendly: e.target.checked }))}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                    />
                    <span>🎾 Only Non-Food Friendly Games</span>
                  </label>

                  <button
                    onClick={() => setFilters({
                      category: 'all',
                      energyLevel: 'all',
                      environment: 'all',
                      skill: 'all',
                      onlyNonFoodFriendly: false,
                      searchQuery: ''
                    })}
                    className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 font-semibold"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            )}

            {/* Games Carousel (Swipeable Left to Right) */}
            <SwipeableGamesCarousel
              games={filteredGames}
              dogProfile={profile}
              isUnlocked={unlockedBonusGames}
              onOpenDetail={(g) => setSelectedGameForDetail(g)}
              onStartTimer={(g) => setSelectedGameForTimer(g)}
              onStartVideo={(g) => setSelectedGameForVideo(g)}
              onUnlockRequest={() => setIsStoryModalOpen(true)}
              onClearFilters={() => setFilters({
                category: 'all',
                energyLevel: 'all',
                environment: 'all',
                skill: 'all',
                onlyNonFoodFriendly: false,
                searchQuery: ''
              })}
            />
          </div>
        )}

        {/* TAB 2: STREAKS & REMINDER */}
        {currentTab === 'streaks' && (
          <div className="space-y-4">
            <PlayOClockCard
              dogProfile={profile}
              todaySessionsCount={todaySessionsCount}
              onQuickPlay={() => {
                soundFx.playWhistleStart();
                setIsSurpriseModalOpen(true);
              }}
              onOpenReminderSettings={() => setIsProfileModalOpen(true)}
            />

            {/* Streak Milestones Card */}
            <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-black text-lg text-stone-900">
                    Streak Rewards & Milestones
                  </h3>
                  <p className="text-xs text-stone-500">
                    Keep your 10-minute daily play habit alive!
                  </p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-xl">
                  🔥
                </div>
              </div>

              <div className="space-y-2.5">
                {[
                  { days: 3, label: '3-Day Play Starter', icon: '🥉', unlocked: (profile.streakCount || 1) >= 3 },
                  { days: 7, label: '7-Day Play Master', icon: '🥈', unlocked: (profile.streakCount || 1) >= 7 },
                  { days: 14, label: '14-Day Olympic Canine Athlete', icon: '🥇', unlocked: (profile.streakCount || 1) >= 14 },
                  { days: 30, label: '30-Day Golden Bond Hall of Fame', icon: '👑', unlocked: (profile.streakCount || 1) >= 30 },
                ].map((m) => (
                  <div
                    key={m.days}
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                      m.unlocked
                        ? 'bg-amber-50/70 border-amber-300/80 text-amber-950'
                        : 'bg-stone-50 border-stone-200/80 text-stone-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{m.icon}</span>
                      <div>
                        <div className="text-xs font-bold">{m.label}</div>
                        <div className="text-[11px] opacity-75">{m.days} consecutive play days</div>
                      </div>
                    </div>
                    <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                      m.unlocked ? 'bg-amber-500 text-white' : 'bg-stone-200 text-stone-600'
                    }`}>
                      {m.unlocked ? 'CLAIMED' : `${m.days - (profile.streakCount || 1)}d left`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Play O'Clock Sound Test & Tips */}
            <div className="p-4 rounded-3xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => soundFx.playPlayOClockChime()}
                  className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs active:scale-95 transition-all shrink-0"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
                <div>
                  <h4 className="font-bold text-xs text-amber-950">
                    Play O'Clock Chime is set for {profile.playOClockTime || '17:30'}
                  </h4>
                  <p className="text-[11px] text-amber-800">
                    Tap the speaker to test the happy chime {profile.name} will recognize!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="text-xs font-bold text-amber-700 hover:text-amber-900 underline shrink-0"
              >
                Change Time
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: INSTAGRAM & TIKTOK STORY SHARER */}
        {currentTab === 'story' && (
          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-gradient-to-r from-pink-500 via-orange-500 to-purple-600 text-white shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold">
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Story Sharer</span>
                </div>
                <span className="text-xs font-bold bg-black/20 px-2.5 py-1 rounded-full">
                  9:16 Vertical Story
                </span>
              </div>

              <div>
                <h3 className="font-display font-black text-xl">
                  Share {profile.name}'s Athlete Card to Instagram & TikTok
                </h3>
                <p className="text-xs text-white/90 mt-1">
                  Generate customized high-resolution story images, add zoomie & good boy stickers, and unlock 2 secret games!
                </p>
              </div>

              <button
                id="open-story-creator-btn"
                onClick={() => {
                  soundFx.playBoop(540);
                  setIsStoryModalOpen(true);
                }}
                className="w-full py-3 px-4 rounded-2xl bg-white text-stone-900 font-display font-bold text-xs shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span>Launch 9:16 Story Creator</span>
              </button>
            </div>

            {/* Secret Games Unlock Status */}
            <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
              <h4 className="font-display font-bold text-sm text-stone-900 flex items-center gap-2">
                <span>🎁 Secret Games Status:</span>
                <span className={unlockedBonusGames ? 'text-emerald-600' : 'text-amber-600'}>
                  {unlockedBonusGames ? 'Unlocked & Ready!' : 'Locked (Share to Unlock)'}
                </span>
              </h4>
              <p className="text-xs text-stone-600">
                Sharing {profile.name}'s story card unlocks <strong>The Magic Sheet Ghost Tunnel</strong> and <strong>The Missing Sock Scent Heist</strong> in your games catalog!
              </p>
              {!unlockedBonusGames && (
                <button
                  onClick={() => setIsStoryModalOpen(true)}
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 underline"
                >
                  Open Story Sharer to Unlock Now →
                </button>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: ACTIVITY & STATS */}
        {currentTab === 'activity' && (
          <StatsDashboard
            sessions={sessions}
            dogProfile={profile}
            currentUser={currentUser}
            onOpenShareCard={() => setIsStoryModalOpen(true)}
            onOpenAuth={() => {
              setAuthPromptContext(`Create an account with Google, Facebook, Instagram or Email to back up ${profile.name || 'your pup'}'s play history safely in the cloud.`);
              setIsAuthModalOpen(true);
            }}
          />
        )}

        {/* TAB 5 & 6: ADMIN CONTROL SECTIONS */}
        {(currentTab === 'admin' || currentTab === 'admin_games') && (
          <div className="space-y-6">
            {/* Admin Sub-navigation switch */}
            <div className="flex items-center justify-between gap-2 p-1.5 rounded-2xl bg-stone-100 border border-stone-200/80">
              <div className="flex items-center gap-1.5">
                <button
                  id="admin-tab-users-btn"
                  onClick={() => {
                    soundFx.playBoop(540);
                    setCurrentTab('admin');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                    currentTab === 'admin'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  👥 Signups & App Usage Stats
                </button>
                <button
                  id="admin-tab-games-btn"
                  onClick={() => {
                    soundFx.playBoop(580);
                    setCurrentTab('admin_games');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                    currentTab === 'admin_games'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  🎮 Manage Games Catalog ({allMasterGames.length})
                </button>
              </div>

              <button
                onClick={() => {
                  soundFx.playBoop(440);
                  setCurrentTab('games');
                }}
                className="px-3 py-1.5 text-[11px] font-bold text-stone-500 hover:text-stone-800"
              >
                ← Back to App
              </button>
            </div>

            {/* Admin View 1: Signups & App Usage Stats */}
            {currentTab === 'admin' && (
              <AdminUsersDashboard
                currentUser={currentUser}
                onOpenAuth={() => {
                  setAuthPromptContext('Sign in with your admin credentials to monitor user sign ups and app usage metrics.');
                  setIsAuthModalOpen(true);
                }}
              />
            )}

            {/* Admin View 2: Games Catalog Management */}
            {currentTab === 'admin_games' && (
              <AdminGamesManager
                games={allMasterGames}
                onSaveGame={handleAdminSaveGame}
                onDeleteGame={handleAdminDeleteGame}
                onToggleArchive={handleAdminToggleArchive}
                onPreviewGame={(game) => {
                  setSelectedGameForDetail(game);
                }}
              />
            )}
          </div>
        )}

        {/* FOUNDER & CREATOR BRAND FOOTER */}
        <footer id="app-founder-footer" className="pt-10 pb-24 border-t border-[#184D7A]/10 text-center space-y-4">
          <div className="flex justify-center">
            <WaggingTailLogo size="md" variant="horizontal" showSubtitle={true} />
          </div>
          
          <p className="max-w-md mx-auto text-xs text-[#184D7A]/80 leading-relaxed font-medium px-4">
            &ldquo;Personalize the games specifically for your best friend.&rdquo; Interactive canine bonding games created by <strong>Leo Boy Games</strong>.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#40B3C9]/10 border border-[#40B3C9]/30 text-xs text-[#184D7A] shadow-2xs font-semibold">
            <span>🐾 Personalization • Companionship • Playfulness</span>
          </div>

          <div>
            <a
              id="founder-instagram-link"
              href="https://www.instagram.com/leoboylondon/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-black text-[#184D7A] hover:text-[#FF7C00] bg-white hover:bg-[#F8FCFD] border border-[#184D7A]/20 px-4 py-2 rounded-full transition-all active:scale-95 shadow-xs"
            >
              <Instagram className="w-4 h-4 text-[#FF7C00]" />
              <span>Follow Leo Boy on Instagram: @leoboylondon</span>
            </a>
          </div>
        </footer>
      </main>

      {/* MOBILE-FIRST FIXED BOTTOM NAVIGATION BAR */}
      <nav 
        id="mobile-bottom-nav"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#184D7A]/10 shadow-2xl py-1 px-2"
      >
        <div className="max-w-md sm:max-w-xl mx-auto flex items-center justify-around">
          {/* Tab 1: Games */}
          <button
            id="bottom-nav-games"
            onClick={() => {
              soundFx.playBoop(480);
              setCurrentTab('games');
            }}
            className={`flex flex-col items-center py-1.5 px-3 rounded-2xl transition-all ${
              currentTab === 'games'
                ? 'text-[#184D7A] font-extrabold scale-105'
                : 'text-stone-400 hover:text-[#184D7A] font-medium'
            }`}
          >
            <Gamepad2 className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Games</span>
          </button>

          {/* Tab 2: Streaks & Reminder */}
          <button
            id="bottom-nav-streaks"
            onClick={() => {
              soundFx.playBoop(520);
              setCurrentTab('streaks');
            }}
            className={`flex flex-col items-center py-1.5 px-3 rounded-2xl transition-all relative ${
              currentTab === 'streaks'
                ? 'text-[#FF7C00] font-extrabold scale-105'
                : 'text-stone-400 hover:text-[#184D7A] font-medium'
            }`}
          >
            <Flame className="w-5 h-5 mb-0.5 text-[#FF7C00]" />
            <span className="text-[10px]">Streaks</span>
            {todaySessionsCount === 0 && (
              <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-[#FF7C00] animate-ping" />
            )}
          </button>

          {/* Center Floating Surprise Action */}
          <button
            id="bottom-nav-surprise"
            onClick={() => {
              soundFx.playWhistleStart();
              setIsSurpriseModalOpen(true);
            }}
            className="w-12 h-12 -mt-4 rounded-2xl bg-gradient-to-tr from-[#FF7C00] to-[#FFB82E] hover:brightness-105 text-white shadow-lg shadow-[#FF7C00]/35 flex items-center justify-center active:scale-95 transition-transform"
            title="Surprise Game"
          >
            <Dices className="w-6 h-6" />
          </button>

          {/* Tab 3: Story (IG/TikTok) */}
          <button
            id="bottom-nav-story"
            onClick={() => {
              soundFx.playBoop(560);
              setCurrentTab('story');
            }}
            className={`flex flex-col items-center py-1.5 px-3 rounded-2xl transition-all ${
              currentTab === 'story'
                ? 'text-[#FF7C00] font-extrabold scale-105'
                : 'text-stone-400 hover:text-[#184D7A] font-medium'
            }`}
          >
            <Instagram className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Story</span>
          </button>

          {/* Tab 4: Activity */}
          <button
            id="bottom-nav-activity"
            onClick={() => {
              soundFx.playBoop(600);
              setCurrentTab('activity');
            }}
            className={`flex flex-col items-center py-1.5 px-3 rounded-2xl transition-all ${
              currentTab === 'activity'
                ? 'text-[#40B3C9] font-extrabold scale-105'
                : 'text-stone-400 hover:text-[#184D7A] font-medium'
            }`}
          >
            <BarChart3 className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Stats</span>
          </button>
        </div>
      </nav>

      {/* MODALS */}
      <DogProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        currentUser={currentUser}
        onOpenAuth={() => {
          setAuthPromptContext(`Create an account with Google, Facebook, Instagram or Email to save ${profile.name || 'your pup'}'s settings and streaks.`);
          setIsAuthModalOpen(true);
        }}
        onSave={handleProfileSave}
      />

      {/* Cloud Account Auth Modal (Google, Facebook, Instagram, Email) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        dogName={profile.name || 'your pup'}
        contextMessage={authPromptContext}
      />

      {/* Cloud Account Management Modal */}
      {currentUser && (
        <AccountModal
          isOpen={isAccountModalOpen}
          onClose={() => setIsAccountModalOpen(false)}
          currentUser={currentUser}
          dogProfile={profile}
          sessions={sessions}
          onSignOut={() => setCurrentUser(null)}
          onManualSync={handleManualSync}
          onOpenAdmin={() => {
            setCurrentTab('admin');
          }}
        />
      )}

      <GameDetailModal
        game={selectedGameForDetail}
        dogProfile={profile}
        isOpen={!!selectedGameForDetail}
        onClose={() => setSelectedGameForDetail(null)}
        onStartTimer={(g) => setSelectedGameForTimer(g)}
        onStartVideo={(g) => setSelectedGameForVideo(g)}
      />

      <PlayTimerModal
        game={selectedGameForTimer}
        dogProfile={profile}
        isOpen={!!selectedGameForTimer}
        onClose={() => setSelectedGameForTimer(null)}
        onSessionComplete={handleSessionComplete}
      />

      <PlayCamModal
        game={selectedGameForVideo}
        dogProfile={profile}
        isOpen={!!selectedGameForVideo}
        onClose={() => setSelectedGameForVideo(null)}
        onSessionComplete={handleSessionComplete}
        onUnlockSecretGame={handleUnlockBonus}
      />

      <SurpriseModal
        isOpen={isSurpriseModalOpen}
        onClose={() => setIsSurpriseModalOpen(false)}
        filteredGames={filteredGames.length > 0 ? filteredGames : GAMES_DATA}
        onSelectGame={(g) => setSelectedGameForDetail(g)}
      />

      <StoryShareModal
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
        dogProfile={profile}
        sessions={sessions}
        onUnlockSecretGames={handleUnlockBonus}
        isUnlocked={unlockedBonusGames}
      />

      <ShareCardModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        dogProfile={profile}
        sessions={sessions}
        onUnlockSecretGames={handleUnlockBonus}
        isUnlocked={unlockedBonusGames}
      />

      {/* Offline Connectivity Toast Indicator */}
      <OfflineIndicator />
    </div>
  );
}
