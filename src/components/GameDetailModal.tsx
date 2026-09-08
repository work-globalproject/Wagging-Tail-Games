import React, { useState } from 'react';
import { Game, DogProfile } from '../types';
import { AnimatedGameIllustration } from './AnimatedGameIllustration';
import { VisualStepGuide } from './VisualStepGuide';
import { X, Play, Video, Clock, Zap, MapPin, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface Props {
  game: Game | null;
  dogProfile: DogProfile;
  isOpen: boolean;
  onClose: () => void;
  onStartTimer: (game: Game) => void;
  onStartVideo: (game: Game) => void;
}

export const GameDetailModal: React.FC<Props> = ({
  game,
  dogProfile,
  isOpen,
  onClose,
  onStartTimer,
  onStartVideo
}) => {
  const [checkedMaterials, setCheckedMaterials] = useState<Record<number, boolean>>({});
  const [showLongText, setShowLongText] = useState<boolean>(false);

  if (!isOpen || !game) return null;

  const toggleMaterial = (idx: number) => {
    soundFx.playBoop(500);
    setCheckedMaterials(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div 
        id="game-detail-modal"
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-4 sm:my-6 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 py-3.5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
              {game.category.replace('_', ' ')}
            </span>
            <span className="text-xs text-stone-500 font-bold">
              ⏱️ {game.durationMinutes} min play
            </span>
          </div>

          <button
            id="close-detail-modal"
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[82vh] overflow-y-auto">
          {/* Animated Illustration Explainer */}
          <div>
            <AnimatedGameIllustration
              illustrationKey={game.illustrationKey}
              category={game.category}
              title={game.title}
              interactive={true}
              className="h-48 sm:h-56"
            />
          </div>

          {/* Title & Micro-Tagline */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-stone-900 leading-tight">
              {game.title}
            </h2>
            <p className="text-stone-600 font-semibold mt-1 text-xs sm:text-sm">
              {game.tagline}
            </p>
          </div>

          {/* Quick Details Bar */}
          <div className="grid grid-cols-3 gap-2 bg-stone-50 p-2.5 rounded-2xl border border-stone-200/70 text-center text-xs text-stone-700">
            <div className="flex flex-col items-center justify-center p-1">
              <Clock className="w-4 h-4 text-amber-600 mb-0.5" />
              <span className="font-black text-stone-900">{game.durationMinutes} Minutes</span>
              <span className="text-[10px] text-stone-500">Quick Sprint</span>
            </div>
            <div className="flex flex-col items-center justify-center p-1 border-x border-stone-200">
              <Zap className="w-4 h-4 text-amber-500 mb-0.5" />
              <span className="font-black capitalize text-stone-900">{game.energyLevel} Energy</span>
              <span className="text-[10px] text-stone-500">{game.suitableSizes.join(', ')}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-1">
              <MapPin className="w-4 h-4 text-emerald-600 mb-0.5" />
              <span className="font-black capitalize text-stone-900">{game.environment === 'both' ? 'Indoor/Yard' : game.environment}</span>
              <span className="text-[10px] text-stone-500">Location</span>
            </div>
          </div>

          {/* ZERO-READING VISUAL INSTRUCTION ENGINE */}
          <VisualStepGuide
            game={game}
            dogProfile={dogProfile}
            checkedMaterials={checkedMaterials}
            onToggleMaterial={toggleMaterial}
          />

          {/* Optional Discrete "Read Full Text" Accordion (For advanced dog parents who want extra paragraphs) */}
          <div className="pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={() => {
                soundFx.playBoop(440);
                setShowLongText(!showLongText);
              }}
              className="w-full flex items-center justify-between py-2 text-xs font-bold text-stone-500 hover:text-stone-800 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Want to read detailed tips & instructions?</span>
              </span>
              {showLongText ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showLongText && (
              <div className="mt-3 space-y-3 p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-700 animate-in fade-in duration-200">
                <div className="space-y-2">
                  <div className="font-black text-stone-900">Original Step Details:</div>
                  {game.steps.map((s) => (
                    <div key={s.stepNumber} className="border-b border-stone-200/60 pb-2 last:border-none">
                      <span className="font-bold text-amber-700">Step {s.stepNumber}: {s.title}</span>
                      <p className="text-stone-600 mt-0.5">{s.instruction}</p>
                      {s.proTip && <p className="text-amber-800 font-medium text-[11px] mt-0.5">💡 {s.proTip}</p>}
                    </div>
                  ))}
                </div>
                <div className="pt-2 italic text-stone-500 text-[11px]">
                  "{game.funnyQuote}"
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Play Action Bar */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-md px-5 py-3.5 border-t border-stone-100 flex flex-col sm:flex-row gap-2.5">
          <button
            id="modal-start-timer-btn"
            onClick={() => {
              onClose();
              soundFx.playWhistleStart();
              onStartTimer(game);
            }}
            className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-display font-black text-sm shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>START PLAY ({game.durationMinutes}m TIMER)</span>
          </button>

          <button
            id="modal-start-video-btn"
            onClick={() => {
              onClose();
              soundFx.playBoop(640);
              onStartVideo(game);
            }}
            className="py-3 px-4 rounded-2xl bg-stone-900 hover:bg-black text-white font-display font-black text-sm shadow-md flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            <Video className="w-4 h-4" />
            <span>PUP CAM</span>
          </button>
        </div>
      </div>
    </div>
  );
};
