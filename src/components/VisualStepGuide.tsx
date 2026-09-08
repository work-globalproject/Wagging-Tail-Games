import React, { useState, useEffect } from 'react';
import { Game, DogProfile } from '../types';
import { getVisualProfileForGame } from '../data/visualGameData';
import { 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Check, 
  Heart, 
  Play, 
  CheckCircle2, 
  ChevronRight,
  Zap,
  Eye
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface Props {
  game: Game;
  dogProfile: DogProfile;
  checkedMaterials: Record<number, boolean>;
  onToggleMaterial: (idx: number) => void;
}

export const VisualStepGuide: React.FC<Props> = ({
  game,
  dogProfile,
  checkedMaterials,
  onToggleMaterial,
}) => {
  const visualProfile = getVisualProfileForGame(game.id, game.title);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSupported(true);
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Voice narration: speaks the 3 visual steps aloud
  const handleToggleVoiceNarration = () => {
    if (!speechSupported) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    soundFx.playBoop(580);
    setIsSpeaking(true);

    const script = visualProfile.speechScript;
    let currentLine = 0;

    const speakLine = (index: number) => {
      if (index >= script.length) {
        setIsSpeaking(false);
        soundFx.playFanfare();
        return;
      }

      setActiveStepIndex(index);
      const textToSpeak = script[index];
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95; // Clear & slightly measured for all ages (12-80 yrs)
      utterance.pitch = 1.05; // Warm, friendly tone

      utterance.onend = () => {
        currentLine++;
        setTimeout(() => {
          speakLine(currentLine);
        }, 500);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    };

    speakLine(0);
  };

  return (
    <div className="space-y-5" id="visual-step-guide">
      {/* Visual Materials: Large Icon Pills (Tap to Check) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
            <span>🎒</span>
            <span>Grab These (Tap to check):</span>
          </span>
          <span className="text-[11px] font-bold text-amber-600">
            {Object.values(checkedMaterials).filter(Boolean).length} / {visualProfile.visualMaterials.length} ready
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {visualProfile.visualMaterials.map((mat, idx) => {
            const isChecked = !!checkedMaterials[idx];
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onToggleMaterial(idx);
                }}
                className={`p-3 rounded-2xl border-2 flex items-center gap-2.5 transition-all text-left ${
                  isChecked
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 scale-[0.99] shadow-inner'
                    : 'bg-stone-50 hover:bg-amber-50/60 border-stone-200/90 text-stone-800 shadow-2xs'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                  isChecked ? 'bg-emerald-500 text-white' : 'bg-white shadow-xs'
                }`}>
                  {isChecked ? <Check className="w-5 h-5 stroke-[3]" /> : mat.icon}
                </div>
                <div className="min-w-0">
                  <div className={`text-xs font-bold leading-tight truncate ${isChecked ? 'line-through opacity-70' : ''}`}>
                    {mat.label}
                  </div>
                  <div className="text-[10px] text-stone-400">
                    {isChecked ? 'Ready! ✓' : 'Tap when ready'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Step Cards Header & Audio "Listen" Button */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-xs">
            3
          </div>
          <h3 className="font-display font-black text-base text-stone-900">
            Visual 3-Step Guide
          </h3>
        </div>

        {/* Audio Narration Button for zero-reading access */}
        {speechSupported && (
          <button
            type="button"
            onClick={handleToggleVoiceNarration}
            className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
              isSpeaking
                ? 'bg-amber-500 text-white ring-4 ring-amber-300 animate-pulse'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
            }`}
            title="Read instructions aloud"
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Speaking... (Tap to stop)</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                <span>🔊 Listen (No Reading!)</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* 3 VISUAL STORYBOARD CARDS (Comic / Lego-Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {visualProfile.visualSteps.map((step, idx) => {
          const isActive = activeStepIndex === idx;
          const isDone = activeStepIndex > idx;

          return (
            <div
              key={step.stepNumber}
              onClick={() => {
                soundFx.playBoop(480 + idx * 50);
                setActiveStepIndex(idx);
              }}
              className={`relative rounded-3xl p-4 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-amber-50/80 border-amber-500 shadow-md ring-2 ring-amber-300 scale-[1.02]'
                  : 'bg-white hover:bg-stone-50 border-stone-200/90 shadow-2xs'
              }`}
            >
              {/* Step Top Badge */}
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  isActive
                    ? 'bg-amber-500 text-white'
                    : 'bg-stone-100 text-stone-600'
                }`}>
                  STEP {step.stepNumber}
                </span>

                {step.cue && (
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-lg">
                    {step.cue}
                  </span>
                )}
              </div>

              {/* Giant Visual Emoji / Diagram Graphic */}
              <div className="my-2 py-3 rounded-2xl bg-stone-50 border border-stone-100 text-center flex items-center justify-center">
                <span className="text-3xl sm:text-4xl tracking-widest select-none filter drop-shadow-xs">
                  {step.icon}
                </span>
              </div>

              {/* Short Texts (3 words bold, 4 words detail) */}
              <div className="space-y-1 text-center">
                <h4 className="font-display font-black text-stone-900 text-sm sm:text-base leading-snug">
                  {step.action}
                </h4>
                <p className="text-stone-600 font-semibold text-xs leading-tight">
                  {step.detail}
                </p>
              </div>

              {/* Indicator Dot at bottom */}
              <div className="mt-3 flex justify-center">
                <div className={`w-2 h-2 rounded-full transition-all ${
                  isActive ? 'w-6 bg-amber-500' : 'bg-stone-300'
                }`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Quick Tips: Bond Tip + Toy Swap in Visual Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        {/* Visual Bond Tip */}
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center text-lg shrink-0 shadow-xs">
            ❤️
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-black uppercase tracking-wider text-rose-600">
              The Bond Secret
            </div>
            <div className="text-xs font-bold leading-snug text-rose-900">
              {visualProfile.shortBondTip}
            </div>
          </div>
        </div>

        {/* Visual Toy / Non-Food Swap */}
        <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-purple-950 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center text-lg shrink-0 shadow-xs">
            🎾
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-black uppercase tracking-wider text-purple-700">
              {!dogProfile.isFoodMotivated ? 'Non-Food Play Mode' : 'Toy / Chase Swap'}
            </div>
            <div className="text-xs font-bold leading-snug text-purple-900">
              {visualProfile.shortRewardTip}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
