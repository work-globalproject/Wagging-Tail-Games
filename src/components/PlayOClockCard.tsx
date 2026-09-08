import React, { useState } from 'react';
import { DogProfile, PlaySession } from '../types';
import { Flame, Clock, Bell, Sparkles, CheckCircle2, Play, Volume2 } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface Props {
  dogProfile: DogProfile;
  todaySessionsCount: number;
  onQuickPlay: () => void;
  onOpenReminderSettings: () => void;
}

export const PlayOClockCard: React.FC<Props> = ({
  dogProfile,
  todaySessionsCount,
  onQuickPlay,
  onOpenReminderSettings,
}) => {
  const [hasPlayedChime, setHasPlayedChime] = useState(false);
  const streak = dogProfile.streakCount || 1;
  const goal = dogProfile.dailyGoalGames || 2;
  const isGoalMet = todaySessionsCount >= goal;
  const playTime = dogProfile.playOClockTime || '17:30';

  const handleTestChime = () => {
    soundFx.playPlayOClockChime();
    setHasPlayedChime(true);
    setTimeout(() => setHasPlayedChime(false), 3000);
  };

  return (
    <div 
      id="play-oclock-card"
      className="rounded-3xl bg-gradient-to-br from-[#184D7A] via-[#1b588c] to-[#40B3C9] p-5 text-white shadow-lg shadow-[#184D7A]/20 relative overflow-hidden"
    >
      {/* Background paw graphic watermark */}
      <div className="absolute -right-4 -bottom-6 text-8xl opacity-10 select-none pointer-events-none">
        🐾
      </div>

      <div className="relative z-10 space-y-4">
        {/* Top Badges: Streak + Play O'Clock Time */}
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold shadow-2xs">
            <Flame className="w-3.5 h-3.5 text-[#FFB82E] fill-[#FFB82E]" />
            <span>{streak} Day Play Streak!</span>
          </div>

          <button
            onClick={onOpenReminderSettings}
            className="flex items-center gap-1 text-[11px] font-bold text-white/90 hover:text-white bg-black/20 px-2.5 py-1 rounded-full backdrop-blur-xs transition-colors"
            title="Edit reminder time"
          >
            <Clock className="w-3 h-3 text-[#40B3C9]" />
            <span>Play O'Clock: {playTime}</span>
          </button>
        </div>

        {/* Center message */}
        <div>
          <h3 className="font-display font-black text-xl sm:text-2xl leading-tight">
            {isGoalMet
              ? `Daily Goal Smashed! 🎉`
              : todaySessionsCount > 0
              ? `1 more game for today's goal!`
              : `Time for ${dogProfile.name}'s daily 10 min!`}
          </h3>
          <p className="text-xs text-white/85 mt-1">
            {isGoalMet
              ? `${dogProfile.name}'s mind & body are fully stimulated. Keep the streak rolling tomorrow!`
              : `A consistent daily play ritual deepens trust and burns mental energy.`}
          </p>
        </div>

        {/* Progress Bar towards daily goal */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-white/90">
            <span>Today's Goal: {todaySessionsCount} / {goal} Games</span>
            <span>{Math.min(100, Math.round((todaySessionsCount / goal) * 100))}%</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-black/25 overflow-hidden p-0.5">
            <div
              style={{ width: `${Math.min(100, (todaySessionsCount / goal) * 100)}%` }}
              className="h-full rounded-full bg-gradient-to-r from-[#FFB82E] to-[#FF7C00] transition-all duration-500 shadow-sm"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            id="play-oclock-start-now-btn"
            onClick={onQuickPlay}
            className="flex-1 py-3 px-4 rounded-2xl bg-[#FF7C00] hover:bg-[#FF8D1A] text-white font-display font-bold text-xs shadow-md shadow-[#FF7C00]/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-white text-white" />
            <span>Start Play Session</span>
          </button>

          <button
            id="play-oclock-chime-test-btn"
            onClick={handleTestChime}
            className="p-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition-colors"
            title="Ring Play O'Clock chime"
          >
            <Volume2 className={`w-4 h-4 ${hasPlayedChime ? 'animate-bounce text-[#FFB82E]' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
