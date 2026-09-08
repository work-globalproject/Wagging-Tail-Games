import React from 'react';
import { Game, DogProfile } from '../types';
import { AnimatedGameIllustration } from './AnimatedGameIllustration';
import { getVisualProfileForGame } from '../data/visualGameData';
import { Clock, Zap, MapPin, Sparkles, Video, Play, Lock, Eye } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface Props {
  game: Game;
  dogProfile: DogProfile;
  isUnlocked: boolean;
  onOpenDetail: (game: Game) => void;
  onStartTimer: (game: Game) => void;
  onStartVideo: (game: Game) => void;
  onUnlockRequest?: (game: Game) => void;
}

export const GameCard: React.FC<Props> = ({
  game,
  dogProfile,
  isUnlocked,
  onOpenDetail,
  onStartTimer,
  onStartVideo,
  onUnlockRequest,
}) => {
  const visualProfile = getVisualProfileForGame(game.id, game.title);
  const matchesDogMotivation = game.primaryMotivations.some(m => dogProfile.motivations.includes(m));

  const getCategoryBadge = () => {
    switch (game.category) {
      case 'curiosity':
        return { label: '👃 Scent', bg: 'bg-amber-100 text-amber-900 border-amber-200' };
      case 'problem_solving':
        return { label: '🧠 Brain Puzzle', bg: 'bg-blue-100 text-blue-900 border-blue-200' };
      case 'agility':
        return { label: '⚡ Agility', bg: 'bg-emerald-100 text-emerald-900 border-emerald-200' };
    }
  };

  const catBadge = getCategoryBadge();

  if (game.isSecret && !isUnlocked) {
    return (
      <div 
        id={`secret-card-${game.id}`}
        onClick={() => onUnlockRequest && onUnlockRequest(game)}
        className="group relative rounded-3xl bg-gradient-to-b from-stone-100 to-amber-50/50 border-2 border-dashed border-amber-300 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-amber-400 hover:shadow-md transition-all min-h-[360px]"
      >
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3 shadow-inner group-hover:scale-110 transition-transform">
          <Lock className="w-8 h-8" />
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-200/80 text-amber-900 mb-2">
          Secret Game 🌟
        </span>
        <h3 className="font-display font-black text-lg text-stone-800 mb-1">
          {game.title}
        </h3>
        <p className="text-xs text-stone-600 max-w-xs mb-4 font-medium">
          Play 3 games today or share a story of {dogProfile.name} to unlock!
        </p>
        <button 
          className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-xs transition-colors"
        >
          TAP TO UNLOCK 🔓
        </button>
      </div>
    );
  }

  return (
    <div
      id={`game-card-${game.id}`}
      className="group rounded-3xl bg-white border border-stone-200/80 shadow-xs hover:shadow-xl hover:border-amber-300 transition-all duration-300 flex flex-col overflow-hidden"
    >
      {/* Visual illustration top */}
      <div 
        className="p-3 cursor-pointer"
        onClick={() => {
          soundFx.playBoop(520);
          onOpenDetail(game);
        }}
      >
        <AnimatedGameIllustration
          illustrationKey={game.illustrationKey}
          category={game.category}
          title={game.title}
          interactive={false}
          className="h-44 group-hover:scale-[1.01] transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Tailored Badges */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black border ${catBadge.bg}`}>
              {catBadge.label}
            </span>

            {!dogProfile.isFoodMotivated && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-900 border border-purple-200 flex items-center gap-1">
                <span>🎾</span>
                <span>Toy Swap</span>
              </span>
            )}

            {matchesDogMotivation && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-200 flex items-center gap-0.5">
                <Sparkles className="w-3 h-3 text-orange-600" />
                <span>Pup's Fav</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h3 
            onClick={() => {
              soundFx.playBoop(520);
              onOpenDetail(game);
            }}
            className="font-display font-black text-xl text-stone-900 leading-snug cursor-pointer group-hover:text-amber-600 transition-colors"
          >
            {game.title}
          </h3>

          <p className="text-xs text-stone-500 line-clamp-1 mt-1 font-medium">
            {game.tagline}
          </p>

          {/* VISUAL 3-STEP STORYBOARD PREVIEW (Zero Reading!) */}
          <div 
            onClick={() => {
              soundFx.playBoop(520);
              onOpenDetail(game);
            }}
            className="my-3 p-2 rounded-2xl bg-amber-50/70 border border-amber-200/70 cursor-pointer hover:bg-amber-100/60 transition-colors"
            title="Visual 3-Step Play Summary"
          >
            <div className="flex items-center justify-between text-center gap-1">
              {visualProfile.visualSteps.map((step, sIdx) => (
                <React.Fragment key={step.stepNumber}>
                  <div className="flex-1 py-1 px-1 rounded-xl bg-white shadow-2xs border border-amber-100">
                    <div className="text-base leading-none">{step.icon.split(' ')[0]}</div>
                    <div className="text-[9px] font-black text-stone-800 leading-tight mt-1 truncate">
                      {step.action.replace(/^\d+\.\s*/, '')}
                    </div>
                  </div>
                  {sIdx < 2 && (
                    <span className="text-amber-500 font-black text-xs shrink-0">➔</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Quick Metrics (Visual Icons & Bold) */}
          <div className="flex items-center justify-between text-xs text-stone-600 font-bold py-2 border-y border-stone-100">
            <div className="flex items-center gap-1" title="Play Time">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>{game.durationMinutes}m</span>
            </div>

            <div className="flex items-center gap-1" title="Energy">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span className="capitalize">{game.energyLevel}</span>
            </div>

            <div className="flex items-center gap-1" title="Location">
              <MapPin className="w-3.5 h-3.5 text-emerald-500" />
              <span className="capitalize">{game.environment === 'both' ? 'Anywhere' : game.environment}</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4 pt-1 flex items-center gap-2">
          <button
            id={`view-game-btn-${game.id}`}
            onClick={() => {
              soundFx.playBoop(520);
              onOpenDetail(game);
            }}
            className="flex-1 py-2.5 px-3 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 font-black text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <Eye className="w-3.5 h-3.5 text-amber-600" />
            <span>Visual Steps</span>
          </button>

          <button
            id={`play-timer-btn-${game.id}`}
            onClick={() => {
              soundFx.playWhistleStart();
              onStartTimer(game);
            }}
            title="Start Interactive Play Timer"
            className="py-2.5 px-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs transition-colors flex items-center justify-center gap-1 shadow-xs active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Play</span>
          </button>

          <button
            id={`play-video-btn-${game.id}`}
            onClick={() => {
              soundFx.playBoop(640);
              onStartVideo(game);
            }}
            title="Record Dog Playing Video"
            className="py-2.5 px-3 rounded-2xl bg-stone-900 hover:bg-black text-white font-black text-xs transition-colors flex items-center justify-center gap-1 shadow-xs active:scale-95"
          >
            <Video className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
