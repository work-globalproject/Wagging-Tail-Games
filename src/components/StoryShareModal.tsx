import React, { useState, useRef } from 'react';
import { DogProfile, PlaySession } from '../types';
import { 
  X, 
  Sparkles, 
  Share2, 
  Download, 
  Check, 
  Flame, 
  Copy, 
  Instagram, 
  Layers, 
  Palette,
  Heart,
  Award
} from 'lucide-react';
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

type StoryTheme = 'sunset' | 'neon' | 'retro' | 'champ';

export const StoryShareModal: React.FC<Props> = ({
  isOpen,
  onClose,
  dogProfile,
  sessions,
  onUnlockSecretGames,
  isUnlocked,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<StoryTheme>('sunset');
  const [activeStickers, setActiveStickers] = useState<string[]>([
    '🐾 Verified Good Boy',
    '⚡ 100% Zoomie Energy',
  ]);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const storyPreviewRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const toggleSticker = (sticker: string) => {
    soundFx.playBoop(480);
    setActiveStickers((prev) =>
      prev.includes(sticker) ? prev.filter((s) => s !== sticker) : [...prev, sticker]
    );
  };

  const getSuperlative = () => {
    if (!dogProfile.isFoodMotivated) {
      return 'High-Speed Toy & Zoomie Champion';
    }
    if (dogProfile.motivations.includes('sniffing')) {
      return 'Chief Detective of Hidden Scents';
    }
    if (dogProfile.motivations.includes('toys_fetch')) {
      return 'Grand Slam Tennis Ball Collector';
    }
    return 'Master Canine Problem Solver';
  };

  const streakDays = dogProfile.streakCount || Math.max(1, sessions.length);

  // Generate real Canvas 1080x1920 PNG for IG/TikTok Stories
  const generateStoryCanvas = (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(null);

      // 1. Background Gradient based on Theme
      let grad = ctx.createLinearGradient(0, 0, 1080, 1920);
      if (selectedTheme === 'sunset') {
        grad.addColorStop(0, '#f97316');
        grad.addColorStop(0.5, '#ea580c');
        grad.addColorStop(1, '#9a3412');
      } else if (selectedTheme === 'neon') {
        grad.addColorStop(0, '#7c3aed');
        grad.addColorStop(0.5, '#4f46e5');
        grad.addColorStop(1, '#06b6d4');
      } else if (selectedTheme === 'champ') {
        grad.addColorStop(0, '#1c1917');
        grad.addColorStop(0.5, '#292524');
        grad.addColorStop(1, '#44403c');
      } else {
        grad.addColorStop(0, '#d97706');
        grad.addColorStop(0.5, '#b45309');
        grad.addColorStop(1, '#78350f');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1080, 1920);

      // Decorative Top & Bottom Accents
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.arc(1080, 200, 450, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, 1720, 500, 0, Math.PI * 2);
      ctx.fill();

      // Top Wagging Tail Header
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🐾 WAGGING TAIL GAMES • CANINE ATHLETE', 540, 160);

      // Inner Card Frame
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
      ctx.shadowBlur = 40;
      ctx.shadowOffsetY = 20;

      const cardX = 90;
      const cardY = 240;
      const cardW = 900;
      const cardH = 1380;
      const cardR = 60;

      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, cardR);
      ctx.fill();

      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // Card Header Tag
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText(dogProfile.breed.toUpperCase(), 540, 340);

      // Avatar Circle
      ctx.beginPath();
      ctx.arc(540, 550, 160, 0, Math.PI * 2);
      ctx.fillStyle = '#fef3c7';
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 10;
      ctx.stroke();

      // Avatar Emoji
      ctx.font = '160px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(dogProfile.avatarEmoji || '🐕', 540, 555);

      // Dog Name
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#1c1917';
      ctx.font = 'bold 76px sans-serif';
      ctx.fillText(dogProfile.name, 540, 800);

      // Superlative badge pill
      ctx.fillStyle = '#fef3c7';
      ctx.beginPath();
      ctx.roundRect(190, 840, 700, 70, 35);
      ctx.fill();
      ctx.fillStyle = '#b45309';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText(`🏆 ${getSuperlative()}`, 540, 888);

      // 3 Stats Grid
      const statY = 980;
      const colW = 240;
      const colGap = 40;
      const startX = cardX + 60;

      // Box 1: Sessions
      ctx.fillStyle = '#f5f5f4';
      ctx.beginPath();
      ctx.roundRect(startX, statY, colW, 180, 30);
      ctx.roundRect(startX + colW + colGap, statY, colW, 180, 30);
      ctx.roundRect(startX + (colW + colGap) * 2, statY, colW, 180, 30);
      ctx.fill();

      // Texts
      ctx.textAlign = 'center';
      // 1
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 54px sans-serif';
      ctx.fillText(String(sessions.length), startX + colW / 2, statY + 80);
      ctx.fillStyle = '#78716c';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('GAMES PLAYED', startX + colW / 2, statY + 130);

      // 2
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 54px sans-serif';
      ctx.fillText(`${streakDays} DAYS`, startX + colW + colGap + colW / 2, statY + 80);
      ctx.fillStyle = '#78716c';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('PLAY STREAK 🔥', startX + colW + colGap + colW / 2, statY + 130);

      // 3
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 54px sans-serif';
      ctx.fillText('99.9%', startX + (colW + colGap) * 2 + colW / 2, statY + 80);
      ctx.fillStyle = '#78716c';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('BOND SYNC', startX + (colW + colGap) * 2 + colW / 2, statY + 130);

      // Motivation quote
      ctx.fillStyle = '#44403c';
      ctx.font = 'italic 34px sans-serif';
      const quote = !dogProfile.isFoodMotivated
        ? '"Zero treats needed. Just pure speed & squeaky toys!"'
        : '"Will solve any puzzle in record time for tasty bites!"';
      ctx.fillText(quote, 540, 1260);

      // Stickers at bottom of card
      ctx.font = 'bold 28px sans-serif';
      let stickerY = 1350;
      if (activeStickers.length > 0) {
        ctx.fillStyle = '#f97316';
        ctx.fillText(activeStickers.join('   •   '), 540, stickerY);
      }

      // Hashtag / Footer
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 34px sans-serif';
      ctx.fillText('Tag @WaggingTailGames & @leoboylondon 📲', 540, 1700);
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText('Created by Leo Boy Games • Follow @leoboylondon', 540, 1755);
      ctx.font = '24px sans-serif';
      ctx.fillText('#WaggingTailGames #LeoBoyGames #DogBonding #DogOfInstagram', 540, 1805);

      canvas.toBlob((blob) => resolve(blob), 'image/png');
    });
  };

  const handleShareToStories = async () => {
    setIsExporting(true);
    soundFx.playWhistleStart();

    try {
      const blob = await generateStoryCanvas();
      if (!blob) throw new Error('Canvas rendering failed');

      const file = new File([blob], `${dogProfile.name}-WaggingTailGames-Story.png`, {
        type: 'image/png',
      });

      // Try native mobile share (Instagram / TikTok stories support)
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${dogProfile.name}'s Wagging Tail Games Story Card`,
          text: `Check out ${dogProfile.name}'s play stats on Wagging Tail Games! #WaggingTailGames #DogBonding`,
        });
      } else {
        // Fallback: Download file directly
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${dogProfile.name}-Story-1080x1920.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      // Confetti & unlock games
      confetti({
        particleCount: 130,
        spread: 90,
        origin: { y: 0.55 },
      });
      soundFx.playFanfare();
      onUnlockSecretGames();
      setCopied(true);
      setTimeout(() => setCopied(false), 4000);
    } catch (err) {
      console.error(err);
      // If user cancelled share or failed, still offer download
      soundFx.playBoop(400);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadOnly = async () => {
    setIsExporting(true);
    soundFx.playBoop(600);
    try {
      const blob = await generateStoryCanvas();
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${dogProfile.name}-IG-Story-1080x1920.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        soundFx.playFanfare();
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        onUnlockSecretGames();
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        id="story-share-modal"
        className="relative w-full max-w-sm sm:max-w-md bg-stone-900 rounded-3xl shadow-2xl border border-stone-800 text-white overflow-hidden my-auto flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center text-stone-300 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="p-4 sm:p-5 pb-2 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/20 via-orange-500/20 to-purple-500/20 border border-pink-500/30 text-pink-300 text-[11px] font-bold uppercase tracking-wider mb-1">
            <Instagram className="w-3.5 h-3.5 text-pink-400" />
            <span>Instagram & TikTok Story Ready</span>
          </div>
          <h2 className="font-display font-black text-xl text-white">
            {dogProfile.name}'s Athlete Story Card
          </h2>
          <p className="text-stone-400 text-xs mt-0.5">
            Perfect 9:16 vertical format. Share to unlock 2 secret games!
          </p>
        </div>

        {/* Scrollable Story Builder Body */}
        <div className="p-4 pt-1 space-y-4 overflow-y-auto flex-1">
          {/* 9:16 Vertical Story Preview */}
          <div className="flex justify-center">
            <div 
              ref={storyPreviewRef}
              className={`w-[260px] sm:w-[280px] aspect-[9/16] rounded-3xl p-3 shadow-2xl relative overflow-hidden flex flex-col justify-between transition-all ${
                selectedTheme === 'sunset'
                  ? 'bg-gradient-to-b from-orange-500 via-amber-600 to-amber-900 border-2 border-amber-300/40'
                  : selectedTheme === 'neon'
                  ? 'bg-gradient-to-b from-purple-600 via-indigo-700 to-cyan-600 border-2 border-cyan-400/40'
                  : selectedTheme === 'champ'
                  ? 'bg-gradient-to-b from-stone-900 via-stone-950 to-amber-950 border-2 border-amber-400/50'
                  : 'bg-gradient-to-b from-amber-700 via-amber-800 to-stone-950 border-2 border-amber-200/40'
              }`}
            >
              {/* Header inside story */}
              <div className="text-center pt-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/90 bg-black/40 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                  🐾 Wagging Tail Games
                </span>
              </div>

              {/* Main Card graphic inside Story */}
              <div className="bg-white rounded-2xl p-4 text-center text-stone-900 shadow-xl my-auto space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                  {dogProfile.breed}
                </div>

                <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 flex items-center justify-center text-4xl shadow-inner border border-amber-300/60">
                  {dogProfile.avatarEmoji || '🐕'}
                </div>

                <div>
                  <h3 className="font-display font-extrabold text-xl text-stone-900 leading-tight">
                    {dogProfile.name}
                  </h3>
                  <div className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md inline-block mt-0.5">
                    🏆 {getSuperlative()}
                  </div>
                </div>

                {/* 3 mini stats */}
                <div className="grid grid-cols-3 gap-1 bg-stone-50 rounded-xl p-2 border border-stone-100 text-center">
                  <div>
                    <div className="font-display font-bold text-amber-600 text-sm">{sessions.length}</div>
                    <div className="text-[8px] uppercase font-bold text-stone-400">Games</div>
                  </div>
                  <div className="border-x border-stone-200">
                    <div className="font-display font-bold text-red-500 text-sm">{streakDays}d 🔥</div>
                    <div className="text-[8px] uppercase font-bold text-stone-400">Streak</div>
                  </div>
                  <div>
                    <div className="font-display font-bold text-emerald-600 text-sm">99%</div>
                    <div className="text-[8px] uppercase font-bold text-stone-400">Bond</div>
                  </div>
                </div>

                {/* Stickers displayed */}
                {activeStickers.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-1 pt-1">
                    {activeStickers.map((s) => (
                      <span key={s} className="text-[8px] font-black bg-orange-100 text-orange-900 px-1.5 py-0.5 rounded">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Story footer watermark */}
              <div className="text-center pb-2 text-[9px] font-bold text-white/90">
                Created by Leo Boy Games • @leoboylondon
              </div>
            </div>
          </div>

          {/* Theme Selector */}
          <div>
            <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>Story Gradient Theme</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'sunset' as StoryTheme, label: 'Sunset Glow', bg: 'from-orange-500 to-amber-700' },
                { id: 'neon' as StoryTheme, label: 'Neon Energy', bg: 'from-purple-600 to-cyan-500' },
                { id: 'champ' as StoryTheme, label: 'Night Gold', bg: 'from-stone-900 to-amber-600' },
                { id: 'retro' as StoryTheme, label: 'Earth Bark', bg: 'from-amber-700 to-stone-800' },
              ].map((th) => (
                <button
                  key={th.id}
                  onClick={() => {
                    soundFx.playBoop(520);
                    setSelectedTheme(th.id);
                  }}
                  className={`h-11 rounded-xl bg-gradient-to-r ${th.bg} border-2 text-[10px] font-bold text-white shadow-xs transition-all flex items-center justify-center ${
                    selectedTheme === th.id ? 'border-white scale-105 shadow-md' : 'border-transparent opacity-80'
                  }`}
                >
                  {th.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sticker Overlay Toggles */}
          <div>
            <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-orange-400" />
              <span>Story Stickers (Tap to Add/Remove)</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                '🐾 Verified Good Boy',
                '⚡ 100% Zoomie Energy',
                '🔥 Play O\'Clock Streak',
                '🎾 Ball Is Life',
                '🧠 Scent Genius',
                '❤️ Best Friend Forever',
              ].map((sticker) => {
                const isActive = activeStickers.includes(sticker);
                return (
                  <button
                    key={sticker}
                    type="button"
                    onClick={() => toggleSticker(sticker)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 ${
                      isActive
                        ? 'bg-amber-400 text-stone-950 shadow-sm'
                        : 'bg-stone-800 hover:bg-stone-700 text-stone-400'
                    }`}
                  >
                    <span>{sticker}</span>
                    {isActive && <Check className="w-3 h-3 text-stone-950" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bonus Unlock Notice */}
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold text-sm shrink-0">
              🎁
            </div>
            <div className="text-left text-xs">
              <div className="font-bold text-amber-200">
                {isUnlocked ? '2 Secret Games Unlocked!' : 'Share to Unlock 2 Secret Games'}
              </div>
              <div className="text-stone-400 text-[11px]">
                {isUnlocked
                  ? 'Magic Sheet Ghost Tunnel & Missing Sock Heist are ready to play!'
                  : 'Tap Share or Download to instantly unlock the Bed Sheet Tunnel & Missing Sock games.'}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons: Share to IG/TikTok + Save to Camera Roll */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 space-y-2">
          <button
            id="share-to-stories-btn"
            disabled={isExporting}
            onClick={handleShareToStories}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-pink-500 via-orange-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white font-display font-bold text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
          >
            <Share2 className="w-4 h-4" />
            <span>
              {isExporting ? 'Generating 1080x1920 Story...' : `Share Story to Instagram / TikTok 🚀`}
            </span>
          </button>

          <button
            id="download-story-btn"
            disabled={isExporting}
            onClick={handleDownloadOnly}
            className="w-full py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Save 1080x1920 to Camera Roll / Photos</span>
          </button>

          <div className="pt-2 text-center">
            <a
              id="story-founder-link"
              href="https://www.instagram.com/leoboylondon/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-pink-400 hover:text-pink-300 transition-colors"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Created by Leo Boy London (Follow us on Instagram: @leoboylondon)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
