import React, { useState } from 'react';
import { DogProfile, DogSize, EnergyLevel, DogMotivation } from '../types';
import { Sparkles, ArrowRight, Check, Heart, Flame, Clock, Bone, Trophy, ChevronLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../utils/audio';
import WaggingTailLogo from './WaggingTailLogo';

interface Props {
  onComplete: (profile: DogProfile) => void;
  initialProfile?: DogProfile;
}

const BREED_PRESETS: Array<{
  name: string;
  size: DogSize;
  energy: EnergyLevel;
  emoji: string;
}> = [
  { name: 'Border Collie', size: 'medium', energy: 'high', emoji: '🐕' },
  { name: 'Golden Retriever', size: 'large', energy: 'medium', emoji: '🦮' },
  { name: 'Labrador', size: 'large', energy: 'medium', emoji: '🦮' },
  { name: 'French Bulldog', size: 'small', energy: 'low', emoji: '🐶' },
  { name: 'German Shepherd', size: 'large', energy: 'high', emoji: '🐕‍🦺' },
  { name: 'Poodle / Doodle', size: 'medium', energy: 'medium', emoji: '🐩' },
  { name: 'Jack Russell / Terrier', size: 'small', energy: 'high', emoji: '🐕' },
  { name: 'Corgi', size: 'small', energy: 'medium', emoji: '🐶' },
  { name: 'Dachshund', size: 'small', energy: 'low', emoji: '🐕' },
  { name: 'Australian Shepherd', size: 'medium', energy: 'high', emoji: '🐕' },
  { name: 'Rescue / Mixed Breed', size: 'medium', energy: 'medium', emoji: '🐾' },
];

const AVATARS = ['🐕', '🐶', '🐩', '🦮', '🐕‍🦺', '🦊', '🐺', '🐾'];

export const OnboardingFlow: React.FC<Props> = ({ onComplete, initialProfile }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [name, setName] = useState(initialProfile?.name || 'Barnaby');
  const [avatar, setAvatar] = useState(initialProfile?.avatarEmoji || '🐕');
  const [breed, setBreed] = useState(initialProfile?.breed || 'Border Collie Mix');
  const [size, setSize] = useState<DogSize>(initialProfile?.size || 'medium');
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>(initialProfile?.energyLevel || 'high');
  const [isFoodMotivated, setIsFoodMotivated] = useState<boolean>(
    initialProfile !== undefined ? initialProfile.isFoodMotivated : false // Defaults to false as requested by prompt
  );
  const [motivations, setMotivations] = useState<DogMotivation[]>(
    initialProfile?.motivations || ['toys_fetch', 'chase_speed', 'tug']
  );
  const [playOClock, setPlayOClock] = useState<string>(initialProfile?.playOClockTime || '17:30');
  const [dailyGoal, setDailyGoal] = useState<number>(initialProfile?.dailyGoalGames || 2);

  const toggleMotivation = (key: DogMotivation) => {
    soundFx.playBoop(480);
    setMotivations(prev =>
      prev.includes(key) ? prev.filter(m => m !== key) : [...prev, key]
    );
  };

  const handleSelectBreedPreset = (preset: typeof BREED_PRESETS[0]) => {
    soundFx.playBoop(520);
    setBreed(preset.name);
    setSize(preset.size);
    setEnergyLevel(preset.energy);
    setAvatar(preset.emoji);
  };

  const handleNext = () => {
    soundFx.playBoop(600);
    if (step === 1 && !name.trim()) {
      setName('Buddy');
    }
    if (step < 4) {
      setStep((step + 1) as 1 | 2 | 3 | 4);
    } else {
      // Complete!
      soundFx.playFanfare();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
      });

      const finalProfile: DogProfile = {
        id: initialProfile?.id || `dog-${Date.now()}`,
        name: name.trim() || 'Barnaby',
        breed: breed.trim() || 'Good Boy Mix',
        size,
        energyLevel,
        isFoodMotivated,
        motivations: motivations.length > 0 ? motivations : ['toys_fetch', 'chase_speed'],
        avatarEmoji: avatar,
        playOClockTime: playOClock,
        dailyGoalGames: dailyGoal,
        streakCount: initialProfile?.streakCount || 1,
        hasCompletedOnboarding: true,
        createdAt: initialProfile?.createdAt || new Date().toISOString(),
      };

      onComplete(finalProfile);
    }
  };

  const handleBack = () => {
    soundFx.playBoop(400);
    if (step > 1) {
      setStep((step - 1) as 1 | 2 | 3 | 4);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        id="onboarding-flow-container"
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Mobile Header Bar */}
        <div className="bg-gradient-to-r from-[#184D7A] via-[#1f5c91] to-[#40B3C9] px-6 pt-6 pb-5 text-white relative">
          <div className="flex items-center justify-between mb-3">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                title="Previous step"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            ) : (
              <div className="flex items-center">
                <WaggingTailLogo size="sm" variant="icon" />
              </div>
            )}

            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    step >= i ? 'w-6 bg-white' : 'w-2 bg-white/30'
                  }`}
                />
              ))}
            </div>

            <span className="text-xs font-bold text-amber-100 uppercase tracking-wider">
              Step {step}/4
            </span>
          </div>

          <h2 className="font-display font-extrabold text-2xl tracking-tight leading-tight">
            {step === 1 && "What's your dog's name & look?"}
            {step === 2 && "What breed is your companion?"}
            {step === 3 && "Does your dog care about treats?"}
            {step === 4 && "Set your daily Play O'Clock!"}
          </h2>
          <p className="text-xs text-amber-100 mt-1">
            {step === 1 && "Personalize the games specifically for your best friend."}
            {step === 2 && "We tune hurdle heights and space needs automatically."}
            {step === 3 && "Crucial! Non-food dogs get toy lures, sprint chases & tugs."}
            {step === 4 && "A daily 10-minute bonding ritual that builds deep trust."}
          </p>
        </div>

        {/* Step Body */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto max-h-[60vh]">
          {/* STEP 1: Name & Avatar */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                  Dog's Name
                </label>
                <input
                  id="onboarding-dog-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Barnaby, Luna, Cooper..."
                  className="w-full px-4 py-3.5 rounded-2xl border-2 border-amber-200 focus:border-amber-500 text-lg font-bold text-stone-900 bg-amber-50/40 outline-none transition-colors"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                  Choose an Avatar
                </label>
                <div className="grid grid-cols-4 gap-2.5">
                  {AVATARS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        soundFx.playBoop(500);
                        setAvatar(emoji);
                      }}
                      className={`h-14 rounded-2xl text-2xl flex items-center justify-center transition-all ${
                        avatar === emoji
                          ? 'bg-amber-100 border-2 border-amber-500 scale-105 shadow-sm'
                          : 'bg-stone-100 hover:bg-stone-200/80 border border-stone-200'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center text-2xl font-bold shrink-0">
                  {avatar}
                </div>
                <div className="text-left">
                  <div className="font-bold text-stone-900 text-sm">{name || 'Your Pup'}</div>
                  <div className="text-xs text-stone-500">Ready to play 12 bonded canine games!</div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Breed & Size */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                  Breed or Mix
                </label>
                <input
                  id="onboarding-breed-input"
                  type="text"
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  placeholder="e.g. Border Collie Mix, Golden..."
                  className="w-full px-4 py-3 rounded-2xl border border-stone-300 text-sm font-semibold text-stone-800 focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Quick Select Common Breeds
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {BREED_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleSelectBreedPreset(preset)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        breed === preset.name
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-stone-100 hover:bg-stone-200/80 text-stone-700'
                      }`}
                    >
                      <span>{preset.emoji}</span>
                      <span>{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size and Energy selection */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                    Size
                  </label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value as DogSize)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold bg-stone-50"
                  >
                    <option value="small">Small (&lt; 10 kg)</option>
                    <option value="medium">Medium (10–25 kg)</option>
                    <option value="large">Large (25–40 kg)</option>
                    <option value="giant">Giant (40+ kg)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                    Energy Level
                  </label>
                  <select
                    value={energyLevel}
                    onChange={(e) => setEnergyLevel(e.target.value as EnergyLevel)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold bg-stone-50"
                  >
                    <option value="low">Low (Chilled)</option>
                    <option value="medium">Medium (Playful)</option>
                    <option value="high">High (Zoomies!)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Food Motivation Check (The prompt highlight!) */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-3">
                {/* Non-food option (Highlighted first since user specifically has this dog!) */}
                <div
                  id="onboarding-motivation-non-food"
                  onClick={() => {
                    soundFx.playBoop(540);
                    setIsFoodMotivated(false);
                  }}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all text-left flex items-start gap-3.5 ${
                    !isFoodMotivated
                      ? 'bg-amber-50/70 border-amber-500 shadow-md ring-2 ring-amber-400/20'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center text-xl shrink-0 mt-0.5">
                    🎾
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 text-sm">
                        Not Food Motivated! (Toys, Chase, Zoomies)
                      </span>
                      {!isFoodMotivated && <Check className="w-4 h-4 text-amber-600 shrink-0" />}
                    </div>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      Driven by balls, squeakers, fast sprint lures, tug-of-war, and verbal excitement rather than treats.
                    </p>
                    <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md">
                      <span>⚡ We'll highlight non-food rewards on every game</span>
                    </div>
                  </div>
                </div>

                {/* Food-motivated option */}
                <div
                  id="onboarding-motivation-food"
                  onClick={() => {
                    soundFx.playBoop(500);
                    setIsFoodMotivated(true);
                  }}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all text-left flex items-start gap-3.5 ${
                    isFoodMotivated
                      ? 'bg-amber-50/70 border-amber-500 shadow-md ring-2 ring-amber-400/20'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xl shrink-0 mt-0.5">
                    🍖
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 text-sm">
                        Food Motivated (Snacks & Treats)
                      </span>
                      {isFoodMotivated && <Check className="w-4 h-4 text-amber-600 shrink-0" />}
                    </div>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      Will happily solve puzzles and run courses for cheese, liver treats, or kibble rewards.
                    </p>
                  </div>
                </div>
              </div>

              {/* Multi-select play styles */}
              <div className="pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                  What triggers {name}'s zoomies?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'toys_fetch' as DogMotivation, label: '🎾 Tennis Balls / Fetch' },
                    { id: 'chase_speed' as DogMotivation, label: '⚡ Fast Chase & Zoomies' },
                    { id: 'tug' as DogMotivation, label: '🪢 Tug-of-War Battle' },
                    { id: 'sniffing' as DogMotivation, label: '👃 Nose Work & Scents' },
                    { id: 'praise_affection' as DogMotivation, label: '🥰 Cuddles & Hype' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleMotivation(item.id)}
                      className={`p-2.5 rounded-xl text-xs font-semibold text-left border transition-all flex items-center justify-between ${
                        motivations.includes(item.id)
                          ? 'bg-amber-100/70 border-amber-400 text-stone-900'
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      <span>{item.label}</span>
                      {motivations.includes(item.id) && <Check className="w-3.5 h-3.5 text-amber-600" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Play O'Clock & Streaks */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 text-left space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center text-base">
                    ⏰
                  </span>
                  <div>
                    <h3 className="font-display font-bold text-stone-900 text-sm">
                      Daily "Play O'Clock" Reminder
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      Pick a golden time each day when you and {name} unplug for 10 minutes.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">
                      Reminder Time
                    </label>
                    <input
                      id="onboarding-play-oclock-time"
                      type="time"
                      value={playOClock}
                      onChange={(e) => setPlayOClock(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-300 font-display font-bold text-base text-stone-900 bg-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playPlayOClockChime();
                    }}
                    className="px-3 py-2.5 rounded-xl bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-bold mt-4 flex items-center gap-1"
                    title="Test chime sound"
                  >
                    <span>🔔 Test Chime</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                  Daily Play Goal
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => {
                        soundFx.playBoop(500 + g * 50);
                        setDailyGoal(g);
                      }}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        dailyGoal === g
                          ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                          : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                      }`}
                    >
                      <div className="text-xl font-display font-bold">{g}</div>
                      <div className="text-[10px] uppercase font-bold opacity-80">
                        {g === 1 ? 'Quick Fun' : g === 2 ? 'Sweet Spot' : 'Master Bond'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ready summary badge */}
              <div className="p-3.5 rounded-2xl bg-[#40B3C9]/10 border border-[#40B3C9]/30 flex items-center gap-3">
                <div className="text-2xl">🎉</div>
                <div className="text-left text-xs text-[#184D7A]">
                  <div className="font-bold">All 12 Wagging Tail Games Ready!</div>
                  <div className="text-[11px] text-[#184D7A]/80">
                    Customized for {name}'s {size} build & {!isFoodMotivated ? 'high-drive toy motor' : 'treat-loving heart'}.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-4 sm:p-6 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
          <div className="text-xs text-stone-500 font-semibold">
            {step === 4 ? "Let's begin!" : `Next: Step ${step + 1} of 4`}
          </div>

          <button
            id="onboarding-next-btn"
            onClick={handleNext}
            className="py-3 px-6 rounded-2xl bg-gradient-to-r from-[#FF7C00] to-[#FF9226] hover:brightness-105 text-white font-display font-bold text-sm shadow-md shadow-[#FF7C00]/25 flex items-center gap-2 active:scale-95 transition-all"
          >
            <span>{step === 4 ? `Meet ${name}'s Games! 🚀` : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
