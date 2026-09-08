import React, { useState, useEffect } from 'react';
import { Game } from '../types';
import { AnimatedGameIllustration } from './AnimatedGameIllustration';
import { Sparkles, Dices, X, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  filteredGames: Game[];
  onSelectGame: (game: Game) => void;
}

export const SurpriseModal: React.FC<Props> = ({
  isOpen,
  onClose,
  filteredGames,
  onSelectGame,
}) => {
  const [isSpinning, setIsSpinning] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isOpen || filteredGames.length === 0) return;

    setIsSpinning(true);
    let count = 0;
    const maxSteps = 16;
    soundFx.playWhistleStart();

    const interval = setInterval(() => {
      count++;
      soundFx.playBoop(400 + (count % 8) * 30);
      setCurrentIndex((prev) => (prev + 1) % filteredGames.length);

      if (count >= maxSteps) {
        clearInterval(interval);
        setIsSpinning(false);
        soundFx.playFanfare();
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }, 90 + count * 8);

    return () => clearInterval(interval);
  }, [isOpen, filteredGames]);

  if (!isOpen || filteredGames.length === 0) return null;

  const selectedGame = filteredGames[currentIndex] || filteredGames[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div 
        id="surprise-modal"
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden my-6 text-center animate-in fade-in zoom-in-95 duration-200"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="bg-gradient-to-r from-[#184D7A] via-[#1f5c91] to-[#40B3C9] text-white p-6 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-xs mb-2">
            <Dices className="w-4 h-4 animate-spin text-[#FFB82E]" />
            <span>Wagging Tail Roulette</span>
          </div>
          <h2 className="font-display font-bold text-2xl">
            {isSpinning ? 'Sniffing Out the Perfect Game...' : 'The Tail Has Wagged! 🎉'}
          </h2>
        </div>

        <div className="p-6 -mt-4 bg-white rounded-t-3xl space-y-4">
          <div className={`transition-all duration-150 ${isSpinning ? 'scale-95 blur-[1px]' : 'scale-100'}`}>
            <AnimatedGameIllustration
              illustrationKey={selectedGame.illustrationKey}
              category={selectedGame.category}
              title={selectedGame.title}
              interactive={false}
              className="h-44"
            />
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
              {selectedGame.category.replace('_', ' ')} • ~{selectedGame.durationMinutes} min
            </span>
            <h3 className="font-display font-bold text-xl text-stone-900 mt-1">
              {selectedGame.title}
            </h3>
            <p className="text-xs text-stone-500 mt-1 line-clamp-2">
              {selectedGame.tagline}
            </p>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              onClick={() => {
                soundFx.playWhistleStart();
                setIsSpinning(true);
                let count = 0;
                const interval = setInterval(() => {
                  count++;
                  soundFx.playBoop(400 + (count % 8) * 30);
                  setCurrentIndex((prev) => (prev + 1) % filteredGames.length);
                  if (count >= 14) {
                    clearInterval(interval);
                    setIsSpinning(false);
                    soundFx.playFanfare();
                  }
                }, 90);
              }}
              disabled={isSpinning}
              className="py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Dices className="w-4 h-4" />
              <span>Spin Again</span>
            </button>

            <button
              id="surprise-play-now-btn"
              disabled={isSpinning}
              onClick={() => {
                onClose();
                onSelectGame(selectedGame);
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#FF7C00] to-[#FF9226] hover:brightness-105 text-white font-display font-bold text-sm shadow-md shadow-[#FF7C00]/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 fill-white" />
              <span>Let's Play This!</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
