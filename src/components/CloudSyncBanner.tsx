import React from 'react';
import { Cloud, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface Props {
  dogName?: string;
  sessionsCount: number;
  onOpenAuth: () => void;
}

export default function CloudSyncBanner({ dogName = 'your pup', sessionsCount, onOpenAuth }: Props) {
  return (
    <div
      id="cloud-sync-banner"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#184D7A] via-[#1b588c] to-[#40B3C9] p-4 sm:p-5 text-white shadow-lg shadow-[#184D7A]/20"
    >
      {/* Background circles */}
      <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute right-12 -top-10 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-white">
            <Cloud className="w-3 h-3 text-[#FFB82E]" />
            <span>Wagging Tail Cloud Sync</span>
          </div>
          <h3 className="text-base sm:text-lg font-display font-black leading-snug">
            Save {dogName}'s Play Sessions & Streaks
          </h3>
          <p className="text-xs text-white/90 max-w-md leading-relaxed">
            Create an account with <strong>Google, Facebook, Instagram</strong> or <strong>Email</strong> to back up your {sessionsCount > 0 ? `${sessionsCount} recorded sessions` : 'sessions'} safely across any phone or device.
          </p>

          {/* Supported Brand Badges */}
          <div className="flex items-center gap-2 pt-1 text-[11px] font-semibold text-white/95">
            <span className="bg-white/15 px-2 py-0.5 rounded-lg">Google</span>
            <span className="bg-white/15 px-2 py-0.5 rounded-lg">Facebook</span>
            <span className="bg-white/15 px-2 py-0.5 rounded-lg">Instagram</span>
            <span className="bg-white/15 px-2 py-0.5 rounded-lg">Email</span>
          </div>
        </div>

        <button
          id="cloud-banner-cta-btn"
          type="button"
          onClick={() => {
            soundFx.playBoop(540);
            onOpenAuth();
          }}
          className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#FF7C00] hover:bg-[#FF8D1A] text-white text-xs font-black shadow-md active:scale-95 transition-all"
        >
          <span>Create Account</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
