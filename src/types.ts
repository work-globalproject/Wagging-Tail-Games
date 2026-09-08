export type GameCategory = 'curiosity' | 'problem_solving' | 'agility';

export type EnergyLevel = 'low' | 'medium' | 'high';

export type Environment = 'indoor' | 'outdoor' | 'both';

export type DogMotivation = 
  | 'food' 
  | 'toys_fetch' 
  | 'tug' 
  | 'praise_affection' 
  | 'chase_speed' 
  | 'sniffing';

export type DogSize = 'small' | 'medium' | 'large' | 'giant';

export interface DogProfile {
  id: string;
  name: string;
  breed: string;
  size: DogSize;
  energyLevel: EnergyLevel;
  motivations: DogMotivation[];
  isFoodMotivated: boolean;
  avatarEmoji?: string;
  photoUrl?: string;
  playOClockTime?: string; // e.g. "17:30"
  dailyGoalGames?: number; // e.g. 2
  streakCount?: number;
  hasCompletedOnboarding?: boolean;
  createdAt: string;
}

export interface VisualStep {
  stepNumber: number;
  icon: string;
  action: string;
  detail: string;
  cue?: string;
}

export interface VisualMaterial {
  icon: string;
  label: string;
}

export interface GameStep {
  stepNumber: number;
  title: string;
  instruction: string;
  proTip?: string;
}

export interface Game {
  id: string;
  title: string;
  tagline: string;
  category: GameCategory;
  energyLevel: EnergyLevel;
  environment: Environment;
  skillBuilds: string[];
  durationMinutes: number;
  suitableSizes: DogSize[];
  primaryMotivations: DogMotivation[];
  nonFoodAlternative: string;
  materials: string[];
  steps: GameStep[];
  visualMaterials?: VisualMaterial[];
  visualSteps?: VisualStep[];
  shortBondTip?: string;
  shortRewardTip?: string;
  bondTip: string;
  funnyQuote: string;
  illustrationKey: string;
  isSecret?: boolean;
  isCustom?: boolean;
  isArchived?: boolean;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PlaySession {
  id: string;
  gameId: string;
  gameTitle: string;
  category: GameCategory;
  dogId: string;
  dogName: string;
  durationSeconds: number;
  mode: 'timer' | 'video' | 'quick';
  timestamp: string; // ISO string
  notes?: string;
  photoOrVideoUrl?: string;
  rating?: number;
  isCloudSaved?: boolean;
}

export interface UserAccount {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  provider: 'google' | 'facebook' | 'instagram' | 'email' | 'other';
  createdAt?: string;
  role?: 'admin' | 'pet_parent';
  lastActiveAt?: string;
  sessionCount?: number;
  totalPlaySeconds?: number;
  dogProfile?: DogProfile;
}

export interface AdminStatsOverview {
  totalUsers: number;
  totalSessions: number;
  totalPlayMinutes: number;
  activeToday: number;
  activeThisWeek: number;
  avgRating: number;
  providerBreakdown: Record<string, number>;
  topGames: { gameId: string; title: string; count: number }[];
}

export interface FilterOptions {
  category: GameCategory | 'all';
  energyLevel: EnergyLevel | 'all';
  environment: Environment | 'all';
  skill: string | 'all';
  onlyNonFoodFriendly: boolean;
  searchQuery: string;
}
