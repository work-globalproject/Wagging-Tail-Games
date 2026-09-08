import React, { useState } from 'react';
import {
  X,
  User,
  Cloud,
  CheckCircle,
  LogOut,
  RefreshCw,
  Dog,
  Calendar,
  Sparkles,
  ShieldCheck,
  Instagram
} from 'lucide-react';
import { UserAccount, DogProfile, PlaySession } from '../types';
import { logOutUser } from '../lib/firebase';
import { soundFx } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  dogProfile: DogProfile;
  sessions: PlaySession[];
  onSignOut: () => void;
  onManualSync: () => Promise<void>;
  onOpenAdmin?: () => void;
}

export default function AccountModal({
  isOpen,
  onClose,
  currentUser,
  dogProfile,
  sessions,
  onSignOut,
  onManualSync,
  onOpenAdmin,
}: Props) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  if (!isOpen) return null;

  const isAdmin = currentUser.role === 'admin' || (currentUser.email && currentUser.email.toLowerCase() === 'donatasgricius123@gmail.com');

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncSuccess(false);
    soundFx.playBoop(600);
    try {
      await onManualSync();
      setSyncSuccess(true);
      soundFx.playFanfare();
      setTimeout(() => setSyncSuccess(false), 3500);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogout = async () => {
    soundFx.playBoop(400);
    try {
      await logOutUser();
      onSignOut();
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  const cloudSavedCount = sessions.filter((s) => s.isCloudSaved).length;

  return (
    <div
      id="account-modal-backdrop"
      className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="account-modal-card"
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#184D7A] via-[#1f5c91] to-[#40B3C9] px-6 pt-6 pb-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'User'}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-white/50 shadow-md"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl font-black shadow-inner">
                  {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : '🐾'}
                </div>
              )}
              <div>
                <h3 className="text-lg font-display font-black leading-tight">
                  {currentUser.displayName || 'Dog Parent'}
                </h3>
                <p className="text-xs text-white/80 font-medium">
                  {currentUser.email || `${currentUser.provider} account`}
                </p>
              </div>
            </div>
            <button
              id="account-close-btn"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Cloud Sync Status Card */}
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-black text-emerald-950">Cloud Sync Active</h4>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                <p className="text-[11px] text-emerald-700">
                  {cloudSavedCount} of {sessions.length} sessions backed up
                </p>
              </div>
            </div>

            <button
              id="account-sync-now-btn"
              type="button"
              disabled={isSyncing}
              onClick={handleSync}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-100/70 border border-emerald-300 text-emerald-800 text-[11px] font-bold flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          </div>

          {syncSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>All play sessions and {dogProfile.name || 'pup'}'s profile synchronized!</span>
            </div>
          )}

          {/* Connected Dog Card */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-stone-500">
              <span className="uppercase tracking-wider text-[10px]">Synced Dog Profile</span>
              <span className="text-amber-600">Active Pup</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-2xl">
                {dogProfile.avatarEmoji || '🐕'}
              </span>
              <div>
                <h5 className="font-bold text-stone-900 text-sm">{dogProfile.name || 'Unnamed Pup'}</h5>
                <p className="text-xs text-stone-500">
                  {dogProfile.breed || 'Dog'} • {dogProfile.size} size • {dogProfile.streakCount || 1} day streak
                </p>
              </div>
            </div>
          </div>

          {/* Account Details Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
              <p className="text-[10px] uppercase tracking-wider font-bold text-stone-400">Sessions</p>
              <p className="text-lg font-black text-stone-900">{sessions.length}</p>
            </div>
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
              <p className="text-[10px] uppercase tracking-wider font-bold text-stone-400">Streak</p>
              <p className="text-lg font-black text-orange-600">{dogProfile.streakCount || 1}d</p>
            </div>
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
              <p className="text-[10px] uppercase tracking-wider font-bold text-stone-400">Login</p>
              <p className="text-xs font-black text-stone-800 capitalize mt-1.5">{currentUser.provider}</p>
            </div>
          </div>

          {/* Admin Control Access Banner */}
          {isAdmin && onOpenAdmin && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-stone-900 to-amber-950 text-white flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Privileges Active</span>
                </div>
                <p className="text-[11px] text-stone-300">
                  User sign up stats & game management
                </p>
              </div>
              <button
                id="account-modal-open-admin-btn"
                type="button"
                onClick={() => {
                  soundFx.playBoop(600);
                  onClose();
                  onOpenAdmin();
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-sm transition-all active:scale-95"
              >
                Open Admin
              </button>
            </div>
          )}

          {/* Sign Out Button */}
          <div className="pt-2">
            <button
              id="account-signout-btn"
              type="button"
              onClick={handleLogout}
              className="w-full py-2.5 px-4 rounded-2xl border border-stone-200 hover:bg-rose-50 hover:border-rose-200 text-stone-600 hover:text-rose-700 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
