import React, { useState } from 'react';
import { DogProfile, PlaySession } from '../types';
import { X, Sparkles, Share2, Download, Check, Trophy, Heart, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  dogProfile: DogProfile;
  sessions: PlaySession[];
  onUnlockSecretGames: () => void;
  isUnlocked: boolean;
}

export const ShareCardModal: React.FC<Props> = ({
  isOpen,
  onClose,
  dogProfile,
  sessions,
  onUnlockSecretGames,
  isUnlocked,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleShareOrCopy = () => {
    soundFx.playFanfare();
    setCopied(true);
    confetti({
      particleCount: 110,
      spread: 80,
      origin: { y: 0.55 },
    });
    onUnlockSecretGames();
    setTimeout(() => setCopied(false), 3000);
  };

  const getSuperlative = () => {
    if (!dogProfile.isFoodMotivated) {
      return '⚡ High-Speed Zoomie Commander';
    }
    if (dogProfile.motivations.includes('sniffing')) {
      return '👃 Chief Detective of Lost Scents';
    }
    if (dogProfile.motivations.includes('toys_fetch')) {
      return '🎾 Grand Slam Tennis Ball Collector';
    }
    return '🏆 Master Mind & Agility Prodigy';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div 
        id="share-card-modal"
        className="relative w-full max-w-md bg-stone-900 rounded-3xl shadow-2xl border border-stone-800 text-white overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Viral Canine Trading Card */}
        <div className="p-6 pb-2 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
            🐾 Canine Athlete Official Card
          </span>
          <h2 className="font-display font-bold text-xl text-white mt-0.5">
            Share to Unlock Secret Bonus Games!
          </h2>
        </div>

        {/* The Collectible Card Graphic */}
        <div className="px-6 py-2">
          <div className="relative rounded-3xl bg-gradient-to-b from-[#40B3C9] via-[#FF7C00] to-[#FFB82E] p-1 shadow-2xl border-4 border-[#40B3C9]/80 transform hover:scale-[1.01] transition-transform">
            <div className="bg-stone-950 rounded-[22px] p-5 text-center relative overflow-hidden">
              {/* Background decorative watermark */}
              <div className="absolute -right-6 -bottom-6 text-8xl opacity-10 select-none">
                🐾
              </div>

              {/* Avatar circle */}
              <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-[#FF7C00] to-[#FFB82E] flex items-center justify-center text-5xl shadow-lg border-2 border-white/40 mb-3">
                {dogProfile.avatarEmoji || '🐕'}
              </div>

              {/* Name & Superlative */}
              <h3 className="font-display font-bold text-2xl text-white">
                {dogProfile.name}
              </h3>
              <p className="text-xs font-semibold text-[#40B3C9] uppercase tracking-wide">
                {dogProfile.breed} • {dogProfile.size} Pup
              </p>

              <div className="inline-block mt-2 px-3 py-1 rounded-full bg-white/10 text-amber-200 text-xs font-bold border border-white/10">
                {getSuperlative()}
              </div>

              {/* Stats Box */}
              <div className="grid grid-cols-3 gap-2 bg-stone-900/90 rounded-2xl p-3 border border-stone-800 mt-4 text-center">
                <div>
                  <div className="text-lg font-display font-bold text-[#FFB82E]">
                    {sessions.length}
                  </div>
                  <div className="text-[10px] text-stone-400 uppercase font-semibold">
                    Games Played
                  </div>
                </div>

                <div className="border-x border-stone-800">
                  <div className="text-lg font-display font-bold text-emerald-400">
                    99.9%
                  </div>
                  <div className="text-[10px] text-stone-400 uppercase font-semibold">
                    Bond Sync
                  </div>
                </div>

                <div>
                  <div className="text-lg font-display font-bold text-[#FF7C00]">
                    {dogProfile.isFoodMotivated ? 'Treats' : 'Zoomies'}
                  </div>
                  <div className="text-[10px] text-stone-400 uppercase font-semibold">
                    Power Source
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-center gap-1 text-[11px] text-stone-400">
                <span>Verified with Wagging Tail Games</span>
                <span>•</span>
                <span className="text-[#FFB82E] font-bold">100% Good Dog</span>
              </div>
            </div>
          </div>
        </div>

        {/* Share & Unlock CTA */}
        <div className="p-6 pt-4 space-y-3">
          <div className="bg-stone-800/80 rounded-2xl p-3.5 border border-stone-700/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FFB82E] text-stone-950 flex items-center justify-center font-bold shrink-0">
              🎁
            </div>
            <div className="text-left text-xs">
              <div className="font-bold text-stone-100">
                {isUnlocked ? 'Bonus Games Unlocked!' : 'Instant Perk: Unlock 2 Secret Games'}
              </div>
              <div className="text-stone-400 text-[11px]">
                {isUnlocked
                  ? 'You now have access to the Bed Sheet Tunnel & Missing Sock Heist.'
                  : 'Tap Share or Copy below to instantly unlock the Bed Sheet Tunnel & Sock Detective games!'}
              </div>
            </div>
          </div>

          <button
            id="share-card-action-btn"
            onClick={handleShareOrCopy}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#FF7C00] to-[#FF9226] hover:brightness-105 text-white font-display font-bold text-sm shadow-lg shadow-[#FF7C00]/25 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-white" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Card Copied & Games Unlocked! 🎉' : `Share ${dogProfile.name}'s Card & Unlock Games`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
