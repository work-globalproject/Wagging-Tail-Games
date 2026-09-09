import React, { useState, useEffect, useRef } from 'react';
import { Game, DogProfile, PlaySession } from '../types';
import { getVisualProfileForGame } from '../data/visualGameData';
import { X, Play, Pause, RotateCcw, Check, Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../utils/audio';

interface Props {
  game: Game | null;
  dogProfile: DogProfile;
  isOpen: boolean;
  onClose: () => void;
  onSessionComplete: (session: PlaySession) => void;
}

const CHEER_MESSAGES = [
  'Tail wagging at maximum frequency! 🐕💨',
  'Pure canine genius in action!',
  'Look at that bond—true pack leadership! ❤️',
  'Halfway mark! Give an enthusiastic "GOOD DOG!"',
  'Brain gears running at 100% capacity! 🧠',
  'Golden Olympian effort from both of you! 🏆',
];

export const PlayTimerModal: React.FC<Props> = ({
  game,
  dogProfile,
  isOpen,
  onClose,
  onSessionComplete,
}) => {
  const defaultSeconds = (game?.durationMinutes || 5) * 60;
  const [timeLeft, setTimeLeft] = useState(defaultSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [cheer, setCheer] = useState('Get ready to play!');
  const [rating, setRating] = useState(5);
  const [isDone, setIsDone] = useState(false);
  const [note, setNote] = useState('');
  const clock = useRef({ remaining: defaultSeconds, elapsed: 0, last: 0 });

  // Reset when game changes or modal opens
  useEffect(() => {
    if (isOpen && game) {
      const secs = game.durationMinutes * 60;
      clock.current = { remaining: secs, elapsed: 0, last: Date.now() };
      setNote(''); setRating(5);
      setTimeLeft(secs);
      setElapsed(0);
      setIsRunning(true);
      setIsDone(false);
      setCheer(`Go, ${dogProfile.name}! Teamwork time! 🐾`);
      soundFx.playWhistleStart();
    }
  }, [isOpen, game?.id]);

  useEffect(() => {
    if (!isOpen || !isRunning) return;
    clock.current.last = Date.now();
    const tick = () => {
      const now = Date.now();
      const seconds = Math.max(0, Math.floor((now - clock.current.last) / 1000));
      clock.current.last += seconds * 1000;
      const played = Math.min(seconds, clock.current.remaining);
      clock.current.elapsed += played;
      clock.current.remaining -= played;
      setElapsed(clock.current.elapsed);
      setTimeLeft(clock.current.remaining);
      if (clock.current.remaining === 0) handleComplete();
    };
    const interval = window.setInterval(tick, 250);
    const resume = () => { if (!document.hidden) tick(); };
    document.addEventListener('visibilitychange', resume);
    return () => { window.clearInterval(interval); document.removeEventListener('visibilitychange', resume); };
  }, [isRunning, isOpen]);

  const handleComplete = () => {
    setIsRunning(false);
    setIsDone(true);
    soundFx.playFanfare();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleSaveSession = () => {
    if (!game) return;
    const session: PlaySession = {
      id: 'session-' + Date.now(),
      gameId: game.id,
      gameTitle: game.title,
      category: game.category,
      dogId: dogProfile.id,
      dogName: dogProfile.name,
      durationSeconds: elapsed,
      mode: 'timer',
      timestamp: new Date().toISOString(),
      notes: note.trim() || undefined,
      rating,
    };
    onSessionComplete(session);
    onClose();
  };

  if (!isOpen || !game) return null;

  const totalSecs = (game.durationMinutes || 5) * 60;
  const progressPercent = Math.min(100, Math.round(((totalSecs - timeLeft) / totalSecs) * 100));

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div role="dialog" aria-modal="true" aria-label="Play Timer" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div 
        id="play-timer-modal"
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6 text-center animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <div className="text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
              Live Play Session
            </span>
            <h3 className="font-display font-bold text-lg text-stone-900 leading-tight">
              {game.title}
            </h3>
          </div>
          <button
            onClick={onClose} aria-label="Close"
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isDone ? (
          <div className="p-8 space-y-6">
            {/* Circular Timer Visual */}
            <div className="relative w-56 h-56 mx-auto flex items-center justify-center">
              {/* Background ring */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="112"
                  cy="112"
                  r="96"
                  stroke="#F3F4F6"
                  strokeWidth="14"
                  fill="transparent"
                />
                <circle
                  cx="112"
                  cy="112"
                  r="96"
                  stroke="#F59E0B"
                  strokeWidth="14"
                  strokeDasharray={2 * Math.PI * 96}
                  strokeDashoffset={2 * Math.PI * 96 * (1 - progressPercent / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-display font-bold text-stone-900 tracking-tight">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-xs font-semibold text-stone-400 mt-1">
                  Played: {formatTime(elapsed)}
                </span>
                <span className="text-xl mt-1">🐾</span>
              </div>
            </div>

            {/* Cheer banner */}
            <div className="min-h-[44px] flex items-center justify-center px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold shadow-2xs animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 mr-1.5 shrink-0" />
              <span>{cheer}</span>
            </div>

            {/* Quick time controls */}
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setTimeLeft((t) => Math.max(30, t - 60))}
                className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors"
              >
                -1 min
              </button>
              <button
                onClick={() => { clock.current.remaining += 60; setTimeLeft(clock.current.remaining); }}
                className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors"
              >
                +1 min
              </button>
              <button
                onClick={() => {
                  soundFx.playBoop(420);
                  setIsRunning(false);
                  clock.current = { remaining: defaultSeconds, elapsed: 0, last: Date.now() };
                  setTimeLeft(defaultSeconds);
                  setElapsed(0);
                }}
                className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs transition-colors"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Visual 3-Step Reminder (Zero reading required!) */}
            {game && (
              <div className="pt-2 border-t border-stone-100">
                <div className="text-[10px] font-black uppercase text-stone-400 tracking-wider mb-1.5 text-left">
                  Visual Play Steps:
                </div>
                <div className="flex items-center justify-between text-center gap-1.5">
                  {getVisualProfileForGame(game.id, game.title).visualSteps.map((s, idx) => (
                    <div key={s.stepNumber} className="flex-1 p-2 rounded-xl bg-stone-50 border border-stone-200/80">
                      <div className="text-xl leading-none">{s.icon.split(' ')[0]}</div>
                      <div className="text-[10px] font-black text-stone-800 leading-tight mt-1 truncate">
                        {s.action.replace(/^\d+\.\s*/, '')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Primary Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  soundFx.playBoop(isRunning ? 400 : 600);
                  setIsRunning(!isRunning);
                }}
                className={`flex-1 py-3.5 rounded-2xl font-display font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all ${
                  isRunning
                    ? 'bg-stone-800 hover:bg-stone-900 text-white'
                    : 'bg-amber-500 hover:bg-amber-600 text-white'
                }`}
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isRunning ? 'Pause Game' : 'Resume Game'}</span>
              </button>

              <button
                onClick={handleComplete}
                className="py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold text-sm shadow-md flex items-center justify-center gap-1.5 transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Finish Early!</span>
              </button>
            </div>
          </div>
        ) : (
          /* Completion Summary Screen */
          <div className="p-8 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center text-3xl shadow-inner">
              🏆
            </div>

            <div>
              <h3 className="font-display font-bold text-2xl text-stone-900">
                Spectacular Play Session!
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                You and {dogProfile.name} just completed {formatTime(elapsed)} of bonded playtime.
              </p>
            </div>

            {/* Fun rating */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                How much fun did {dogProfile.name} have?
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => {
                      soundFx.playBoop(400 + star * 50);
                      setRating(star);
                    }}
                    className={`text-2xl transition-transform hover:scale-125 ${
                      rating >= star ? 'scale-110' : 'grayscale opacity-30'
                    }`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Session note */}
            <div>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={`e.g. ${dogProfile.name} figured out the trick in 2 minutes!`}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 placeholder:text-stone-400 focus:ring-2 focus:ring-amber-200 outline-none"
              />
            </div>

            <button
              id="save-timer-session-btn"
              onClick={handleSaveSession}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-display font-bold text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Log to {dogProfile.name}'s Activity Tally</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
