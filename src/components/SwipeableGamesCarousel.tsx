import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Game, DogProfile } from '../types';
import { GameCard } from './GameCard';
import { ChevronLeft, ChevronRight, Play, Eye, Sparkles, HandMetal } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface Props {
  games: Game[];
  dogProfile: DogProfile;
  isUnlocked: boolean;
  onOpenDetail: (game: Game) => void;
  onStartTimer: (game: Game) => void;
  onStartVideo: (game: Game) => void;
  onUnlockRequest?: (game: Game) => void;
  onClearFilters?: () => void;
}

export const SwipeableGamesCarousel: React.FC<Props> = ({
  games,
  dogProfile,
  isUnlocked,
  onOpenDetail,
  onStartTimer,
  onStartVideo,
  onUnlockRequest,
  onClearFilters,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [hasSwipedOnce, setHasSwipedOnce] = useState(false);

  // Compute active card from scroll position
  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el || games.length === 0) return;

    const scrollLeft = el.scrollLeft;
    const cardWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).offsetWidth + 16 // width + gap
      : 340;

    const newIndex = Math.min(
      games.length - 1,
      Math.max(0, Math.round(scrollLeft / cardWidth))
    );

    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
      if (!hasSwipedOnce) setHasSwipedOnce(true);
    }
  }, [games.length, activeIndex, hasSwipedOnce]);

  // Scroll listener with requestAnimationFrame
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [handleScroll]);

  // Reset to first card when game list changes (e.g. filter applied)
  useEffect(() => {
    setActiveIndex(0);
    if (containerRef.current) {
      containerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [games.length]);

  // Programmatic scroll to specific game index
  const scrollToGame = (index: number) => {
    const el = containerRef.current;
    if (!el) return;

    const targetIndex = Math.max(0, Math.min(games.length - 1, index));
    const cardWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).offsetWidth + 16
      : 340;

    soundFx.playBoop(480 + targetIndex * 20);
    setIsScrolling(true);
    el.scrollTo({
      left: targetIndex * cardWidth,
      behavior: 'smooth',
    });
    setActiveIndex(targetIndex);
    setTimeout(() => setIsScrolling(false), 350);
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      scrollToGame(activeIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeIndex < games.length - 1) {
      scrollToGame(activeIndex + 1);
    }
  };

  if (games.length === 0) {
    return (
      <div className="text-center py-12 px-4 rounded-3xl bg-white border border-dashed border-stone-300 space-y-3">
        <div className="text-4xl">🔍🐕</div>
        <h4 className="font-display font-bold text-base text-stone-800">
          No games match these filters!
        </h4>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="px-4 py-2 rounded-xl bg-[#FF7C00] text-white font-bold text-xs shadow-sm hover:brightness-105 transition-all"
          >
            Clear All Filters
          </button>
        )}
      </div>
    );
  }

  const currentGame = games[activeIndex] || games[0];

  return (
    <div className="space-y-3 select-none">
      {/* Top Carousel Navigation Bar: Counter, Title & Chevrons */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          {/* Active Card Pill */}
          <span className="px-3 py-1 rounded-full bg-[#184D7A] text-white text-xs font-black shadow-xs tracking-wide">
            Game {activeIndex + 1} of {games.length}
          </span>
          <span className="hidden sm:inline text-xs font-bold text-[#184D7A] truncate max-w-[200px]">
            {currentGame?.title}
          </span>
        </div>

        {/* Swipe Hint & Previous / Next Buttons */}
        <div className="flex items-center gap-1.5">
          <div className="hidden xs:flex items-center gap-1 text-[11px] font-bold text-[#184D7A]/70 bg-[#40B3C9]/10 px-2.5 py-1 rounded-full">
            <span>👈 Swipe cards 👉</span>
          </div>

          <button
            id="carousel-prev-btn"
            onClick={handlePrev}
            disabled={activeIndex === 0}
            className="w-8 h-8 rounded-full bg-white border border-stone-200 text-[#184D7A] flex items-center justify-center shadow-xs hover:bg-[#F8FCFD] disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95"
            title="Previous Game"
            aria-label="Previous Game"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            id="carousel-next-btn"
            onClick={handleNext}
            disabled={activeIndex === games.length - 1}
            className="w-8 h-8 rounded-full bg-white border border-stone-200 text-[#184D7A] flex items-center justify-center shadow-xs hover:bg-[#F8FCFD] disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95"
            title="Next Game"
            aria-label="Next Game"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar through deck */}
      <div className="w-full h-1.5 bg-stone-200/80 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#FF7C00] via-[#FFB82E] to-[#40B3C9] transition-all duration-300 rounded-full"
          style={{ width: `${((activeIndex + 1) / games.length) * 100}%` }}
        />
      </div>

      {/* Horizontal Swipeable Container */}
      <div className="relative">
        <div
          ref={containerRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pt-1 pb-3 px-1 no-scrollbar scroll-smooth cursor-grab active:cursor-grabbing items-stretch"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {games.map((game, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={game.id}
                className={`snap-center shrink-0 w-[84vw] max-w-[340px] sm:max-w-[360px] transition-all duration-300 ${
                  isActive
                    ? 'scale-[1.01] opacity-100 ring-2 ring-[#40B3C9]/40 rounded-3xl shadow-lg'
                    : 'opacity-85 hover:opacity-100 scale-[0.98]'
                }`}
              >
                <GameCard
                  game={game}
                  dogProfile={dogProfile}
                  isUnlocked={isUnlocked || !game.isSecret}
                  onOpenDetail={onOpenDetail}
                  onStartTimer={onStartTimer}
                  onStartVideo={onStartVideo}
                  onUnlockRequest={onUnlockRequest}
                />
              </div>
            );
          })}
        </div>

        {/* Left / Right floating edge gradients to subtly cue swipeable content */}
        {activeIndex > 0 && (
          <div
            onClick={handlePrev}
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 -ml-3 rounded-full bg-white/90 backdrop-blur-xs border border-stone-200 text-[#184D7A] shadow-md items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all z-10"
            title="Previous Game"
          >
            <ChevronLeft className="w-5 h-5" />
          </div>
        )}

        {activeIndex < games.length - 1 && (
          <div
            onClick={handleNext}
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 -mr-3 rounded-full bg-white/90 backdrop-blur-xs border border-stone-200 text-[#184D7A] shadow-md items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all z-10"
            title="Next Game"
          >
            <ChevronRight className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Pagination dots & quick swipe indicators */}
      <div className="flex items-center justify-center gap-1.5 pt-1 overflow-x-auto py-1">
        {games.map((g, idx) => (
          <button
            key={g.id}
            onClick={() => scrollToGame(idx)}
            className={`transition-all rounded-full ${
              idx === activeIndex
                ? 'w-6 h-2 bg-[#FF7C00] shadow-2xs'
                : 'w-2 h-2 bg-stone-300 hover:bg-stone-400'
            }`}
            title={`Go to ${g.title}`}
            aria-label={`Go to ${g.title}`}
          />
        ))}
      </div>

      {/* Floating Swipe Helper Tip for First-Time Users */}
      {!hasSwipedOnce && (
        <div className="flex items-center justify-center gap-2 text-center text-xs font-semibold text-[#184D7A]/80 py-1 animate-pulse">
          <span>👈 Swipe horizontally to browse through all {games.length} games 👉</span>
        </div>
      )}
    </div>
  );
};
