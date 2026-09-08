import React, { useState } from 'react';
import { DogProfile, DogSize, EnergyLevel, DogMotivation, UserAccount } from '../types';
import { POPULAR_BREEDS, MOTIVATION_LABELS } from '../data/games';
import { X, Sparkles, Heart, AlertCircle, Instagram, Cloud } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profile: DogProfile;
  currentUser?: UserAccount | null;
  onOpenAuth?: () => void;
  onSave: (updatedProfile: DogProfile) => void;
}

const DOG_EMOJIS = ['🐕', '🐶', '🐩', '🦮', '🐕‍🦺', '🐾', '🐺', '🦊'];

export const DogProfileModal: React.FC<Props> = ({ isOpen, onClose, profile, currentUser, onOpenAuth, onSave }) => {
  const [name, setName] = useState(profile.name);
  const [breed, setBreed] = useState(profile.breed);
  const [size, setSize] = useState<DogSize>(profile.size);
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>(profile.energyLevel);
  const [isFoodMotivated, setIsFoodMotivated] = useState(profile.isFoodMotivated);
  const [motivations, setMotivations] = useState<DogMotivation[]>(profile.motivations);
  const [avatarEmoji, setAvatarEmoji] = useState(profile.avatarEmoji || '🐕');
  const [playOClockTime, setPlayOClockTime] = useState(profile.playOClockTime || '17:30');
  const [dailyGoalGames, setDailyGoalGames] = useState(profile.dailyGoalGames || 2);

  if (!isOpen) return null;

  const handleBreedChange = (selectedBreed: string) => {
    setBreed(selectedBreed);
    const matched = POPULAR_BREEDS.find(b => b.breed.toLowerCase() === selectedBreed.toLowerCase());
    if (matched) {
      setSize(matched.typicalSize);
      setEnergyLevel(matched.typicalEnergy);
    }
  };

  const toggleMotivation = (mot: DogMotivation) => {
    soundFx.playBoop(500);
    if (mot === 'food') {
      const willHaveFood = !motivations.includes('food');
      setIsFoodMotivated(willHaveFood);
    }
    setMotivations(prev =>
      prev.includes(mot) ? prev.filter(m => m !== mot) : [...prev, mot]
    );
  };

  const handleFoodToggle = (val: boolean) => {
    soundFx.playBoop(val ? 580 : 380);
    setIsFoodMotivated(val);
    if (!val) {
      setMotivations(prev => prev.filter(m => m !== 'food'));
    } else if (!motivations.includes('food')) {
      setMotivations(prev => [...prev, 'food']);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playFanfare();
    onSave({
      ...profile,
      name: name.trim() || 'My Doggo',
      breed: breed.trim() || 'Custom Breed',
      size,
      energyLevel,
      isFoodMotivated,
      motivations: motivations.length > 0 ? motivations : (isFoodMotivated ? ['food', 'praise_affection'] : ['toys_fetch', 'praise_affection']),
      avatarEmoji,
      playOClockTime,
      dailyGoalGames,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div 
        id="dog-profile-modal"
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-amber-100 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#184D7A] via-[#1f5c91] to-[#40B3C9] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 bg-white/20 rounded-2xl backdrop-blur-xs">{avatarEmoji}</span>
            <div>
              <h2 className="text-2xl font-bold font-display tracking-wide">Tell Us About Your Pup</h2>
              <p className="text-[#40B3C9]/30 text-xs font-medium text-white/90">We tailor the games, size obstacles, and motivation swaps!</p>
            </div>
          </div>
          <button
            id="close-profile-modal"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
          {/* Cloud Account Status Banner */}
          {currentUser ? (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Synced to <strong>{currentUser.displayName || currentUser.email || 'Cloud Account'}</strong></span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Auto-Backing Up
              </span>
            </div>
          ) : onOpenAuth ? (
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-stone-800 text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="leading-tight">Save {name || 'your pup'}'s profile to the cloud so you never lose streaks.</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  soundFx.playBoop(540);
                  onClose();
                  onOpenAuth();
                }}
                className="shrink-0 px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] shadow-xs transition-all"
              >
                Sign In
              </button>
            </div>
          ) : null}

          {/* Avatar picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Choose an Avatar
            </label>
            <div className="flex flex-wrap gap-2">
              {DOG_EMOJIS.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => {
                    setAvatarEmoji(emoji);
                    soundFx.playBoop(600);
                  }}
                  className={`w-11 h-11 text-2xl rounded-2xl flex items-center justify-center transition-all ${
                    avatarEmoji === emoji
                      ? 'bg-amber-100 border-2 border-amber-500 scale-110 shadow-xs'
                      : 'bg-stone-50 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Name & Breed Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Dog's Name *
              </label>
              <input
                id="dog-name-input"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Barnaby, Luna, Milo"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-stone-800 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Breed / Mix
              </label>
              <input
                id="dog-breed-input"
                list="breed-suggestions"
                type="text"
                value={breed}
                onChange={(e) => handleBreedChange(e.target.value)}
                placeholder="e.g. Golden Retriever, Mixed"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-stone-800 font-medium"
              />
              <datalist id="breed-suggestions">
                {POPULAR_BREEDS.map((b) => (
                  <option key={b.breed} value={b.breed} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Size (Determines obstacle sizes) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Pup Size
              </label>
              <span className="text-xs text-stone-500">Adapts game jumps & spaces</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(
                [
                  { key: 'small', label: 'Small', desc: '< 10 kg' },
                  { key: 'medium', label: 'Medium', desc: '10–25 kg' },
                  { key: 'large', label: 'Large', desc: '25–40 kg' },
                  { key: 'giant', label: 'Giant', desc: '40+ kg' },
                ] as const
              ).map((s) => (
                <button
                  type="button"
                  key={s.key}
                  onClick={() => {
                    setSize(s.key);
                    soundFx.playBoop(480);
                  }}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    size === s.key
                      ? 'bg-amber-50 border-amber-500 text-amber-900 shadow-2xs'
                      : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <div className="font-bold text-sm">{s.label}</div>
                  <div className="text-[11px] text-stone-500">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Core Motivation & Food Motivation Question */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-bold text-amber-950 text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Is {name || 'your dog'} food motivated?
                </h4>
                <p className="text-xs text-amber-800/80 mt-0.5">
                  {isFoodMotivated
                    ? "Great! We'll use treats, kibble puzzles, and lick mats."
                    : "No problem! We'll suggest toy tugs, high-pitch celebrations, and fetch swaps!"}
                </p>
              </div>

              <div className="flex bg-white p-1 rounded-xl border border-amber-200 shadow-2xs">
                <button
                  type="button"
                  onClick={() => handleFoodToggle(true)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    isFoodMotivated ? 'bg-amber-500 text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Yes 🥩
                </button>
                <button
                  type="button"
                  onClick={() => handleFoodToggle(false)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    !isFoodMotivated ? 'bg-stone-800 text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  No 🎾
                </button>
              </div>
            </div>

            {!isFoodMotivated && (
              <div className="flex items-center gap-2 bg-white/90 p-2.5 rounded-xl border border-amber-300/60 text-xs text-stone-700">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Non-food active dog:</strong> We'll automatically feature games built around chase, agility, and toy rewards!
                </span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-950 mb-2">
                What drives your pup most? (Select all that apply)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(MOTIVATION_LABELS).map(([key, item]) => {
                  const isSelected = motivations.includes(key as DogMotivation);
                  return (
                    <button
                      type="button"
                      key={key}
                      onClick={() => toggleMotivation(key as DogMotivation)}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-white border-amber-500 shadow-xs'
                          : 'bg-white/60 border-stone-200/80 hover:bg-white text-stone-600'
                      }`}
                    >
                      <span className="text-xl shrink-0">{item.icon}</span>
                      <div className="min-w-0">
                        <div className={`text-xs font-bold ${isSelected ? 'text-amber-950' : 'text-stone-800'}`}>
                          {item.label}
                        </div>
                        <div className="text-[11px] text-stone-500 leading-tight">
                          {item.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Energy Level */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Daily Energy Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'low', label: 'Couch Potato', icon: '🛋️', desc: 'Calm & gentle' },
                { key: 'medium', label: 'Playful Pacer', icon: '🐾', desc: 'Up for fun' },
                { key: 'high', label: 'Rocket Zoomies', icon: '🚀', desc: 'Can’t stop, won’t stop' },
              ].map((lvl) => (
                <button
                  type="button"
                  key={lvl.key}
                  onClick={() => {
                    setEnergyLevel(lvl.key as EnergyLevel);
                    soundFx.playBoop(460);
                  }}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    energyLevel === lvl.key
                      ? 'bg-amber-50 border-amber-500 text-amber-900 shadow-2xs'
                      : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <span className="text-xl block mb-1">{lvl.icon}</span>
                  <div className="font-bold text-xs">{lvl.label}</div>
                  <div className="text-[10px] text-stone-500">{lvl.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Daily Play O'Clock & Goal */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                ⏰ Daily "Play O'Clock" Reminder
              </label>
              <button
                type="button"
                onClick={() => soundFx.playPlayOClockChime()}
                className="text-[11px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
              >
                <span>🔔 Test Chime</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="block text-[11px] text-stone-500 mb-1">Time</span>
                <input
                  type="time"
                  value={playOClockTime}
                  onChange={(e) => setPlayOClockTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 font-bold text-sm bg-white"
                />
              </div>

              <div>
                <span className="block text-[11px] text-stone-500 mb-1">Daily Games Goal</span>
                <select
                  value={dailyGoalGames}
                  onChange={(e) => setDailyGoalGames(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 font-bold text-sm bg-white"
                >
                  <option value={1}>1 Game / Day (Quick Fun)</option>
                  <option value={2}>2 Games / Day (Recommended)</option>
                  <option value={3}>3 Games / Day (Master Bond)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              id="save-dog-profile-btn"
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#FF7C00] to-[#FF9226] hover:brightness-105 text-white font-bold font-display tracking-wide text-base shadow-lg shadow-[#FF7C00]/25 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <Heart className="w-5 h-5 fill-white" />
              <span>Save {name || 'Pup'}'s Profile & Play!</span>
            </button>
          </div>

          {/* Founder Details */}
          <div className="pt-3 text-center border-t border-stone-100">
            <a
              id="profile-founder-link"
              href="https://www.instagram.com/leoboylondon/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-[#FF7C00] transition-colors"
            >
              <span>🐾 Created by Leo Boy Games</span>
              <span className="text-[#FF7C00] flex items-center gap-0.5">
                <Instagram className="w-3.5 h-3.5" />
                <span>@leoboylondon</span>
              </span>
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};
