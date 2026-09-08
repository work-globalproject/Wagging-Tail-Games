import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Play, RotateCcw } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface Props {
  illustrationKey: string;
  category: 'curiosity' | 'problem_solving' | 'agility';
  title?: string;
  className?: string;
  interactive?: boolean;
}

export const AnimatedGameIllustration: React.FC<Props> = ({
  illustrationKey,
  category,
  className = '',
  interactive = true,
}) => {
  const [clickCount, setClickCount] = useState(0);
  const [isPlayingTrigger, setIsPlayingTrigger] = useState(false);
  const [activeStage, setActiveStage] = useState(0);

  const getCategoryColor = () => {
    switch (category) {
      case 'curiosity':
        return {
          bg: 'from-amber-100/90 via-orange-50/70 to-amber-50/50',
          border: 'border-amber-200/90',
          accent: '#F59E0B',
          glow: 'rgba(245, 158, 11, 0.15)',
        };
      case 'problem_solving':
        return {
          bg: 'from-blue-100/90 via-indigo-50/70 to-sky-50/50',
          border: 'border-blue-200/90',
          accent: '#3B82F6',
          glow: 'rgba(59, 130, 246, 0.15)',
        };
      case 'agility':
        return {
          bg: 'from-emerald-100/90 via-teal-50/70 to-emerald-50/50',
          border: 'border-emerald-200/90',
          accent: '#10B981',
          glow: 'rgba(16, 185, 129, 0.15)',
        };
    }
  };

  const theme = getCategoryColor();

  const handleInteraction = () => {
    if (!interactive) return;
    setClickCount((c) => c + 1);
    setIsPlayingTrigger(true);
    setActiveStage((s) => (s + 1) % 3);
    soundFx.playBoop(520 + (clickCount % 4) * 60);
    setTimeout(() => setIsPlayingTrigger(false), 900);
  };

  const renderVisual = () => {
    switch (illustrationKey) {
      // 1. SNUFFLE MAT TREASURE DIG
      case 'snuffle_mat':
        return (
          <svg viewBox="0 0 260 190" className="w-full h-full max-h-52 drop-shadow-sm select-none">
            <defs>
              <linearGradient id="matFleece" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#CBD5E1" />
                <stop offset="100%" stopColor="#94A3B8" />
              </linearGradient>
              <radialGradient id="treatGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FDE047" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#FDE047" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Room Rug Floor */}
            <ellipse cx="130" cy="165" rx="110" ry="20" fill="#F1F5F9" />

            {/* Mat Rubber Grid Base with realistic texture */}
            <rect x="35" y="115" width="190" height="42" rx="14" fill="url(#matFleece)" stroke="#64748B" strokeWidth="2.5" />
            <line x1="50" y1="128" x2="210" y2="128" stroke="#475569" strokeWidth="1.5" strokeDasharray="6 6" />
            <line x1="50" y1="142" x2="210" y2="142" stroke="#475569" strokeWidth="1.5" strokeDasharray="6 6" />

            {/* Hidden Golden Bones / Kibble Treat with glowing pulse */}
            <circle cx="130" cy="115" r="22" fill="url(#treatGlow)" />
            <motion.g
              animate={{
                y: isPlayingTrigger ? [-10, -28, -10] : [0, -6, 0],
                scale: isPlayingTrigger ? [1, 1.35, 1] : [1, 1.08, 1],
                rotate: isPlayingTrigger ? [0, 18, -18, 0] : [-3, 3, -3],
              }}
              transition={{ repeat: Infinity, duration: isPlayingTrigger ? 0.9 : 2.2, ease: 'easeInOut' }}
            >
              <rect x="118" y="104" width="24" height="15" rx="7" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
              <circle cx="118" cy="107" r="4.5" fill="#F59E0B" />
              <circle cx="118" cy="116" r="4.5" fill="#F59E0B" />
              <circle cx="142" cy="107" r="4.5" fill="#F59E0B" />
              <circle cx="142" cy="116" r="4.5" fill="#F59E0B" />
              {/* Sparkle star on discovery */}
              <motion.path
                d="M 130 92 L 132 97 L 137 98 L 132 100 L 130 105 L 128 100 L 123 98 L 128 97 Z"
                fill="#FDE047"
                animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 1.4 }}
              />
            </motion.g>

            {/* Layered Fleece Fabric Strips (Waving in 3D depth) */}
            {[
              { x: 55, c1: '#EA580C', c2: '#F97316', dur: 2.1, maxH: 60 },
              { x: 75, c1: '#F59E0B', c2: '#FBBF24', dur: 2.7, maxH: 72 },
              { x: 95, c1: '#D97706', c2: '#F59E0B', dur: 1.9, maxH: 65 },
              { x: 115, c1: '#DC2626', c2: '#F87171', dur: 2.4, maxH: 78 },
              { x: 135, c1: '#F97316', c2: '#FDBA74', dur: 2.2, maxH: 74 },
              { x: 155, c1: '#F59E0B', c2: '#FEF08A', dur: 2.8, maxH: 66 },
              { x: 175, c1: '#EA580C', c2: '#F97316', dur: 2.0, maxH: 70 },
              { x: 195, c1: '#D97706', c2: '#FDE047', dur: 2.5, maxH: 62 },
            ].map((strip, i) => (
              <motion.path
                key={i}
                d={`M ${strip.x} 130 Q ${strip.x - 8} ${130 - strip.maxH / 2} ${strip.x + (i % 2 === 0 ? 10 : -8)} ${130 - strip.maxH} Q ${strip.x + 18} ${130 - strip.maxH / 2} ${strip.x + 10} 130 Z`}
                fill={strip.c2}
                stroke={strip.c1}
                strokeWidth="2"
                strokeLinejoin="round"
                animate={{
                  rotate: isPlayingTrigger
                    ? [i % 2 === 0 ? -18 : 18, i % 2 === 0 ? 18 : -18, i % 2 === 0 ? -18 : 18]
                    : [i % 2 === 0 ? -6 : 6, i % 2 === 0 ? 6 : -6, i % 2 === 0 ? -6 : 6],
                  originY: '130px',
                  originX: `${strip.x + 5}px`,
                }}
                transition={{ repeat: Infinity, duration: strip.dur, ease: 'easeInOut' }}
              />
            ))}

            {/* Realistic Sniffing Dog (Head, Muzzle, Floppy Ear & Dynamic Sniff Streams) */}
            <motion.g
              animate={{
                x: isPlayingTrigger ? [0, 8, -4, 0] : [0, 4, 0],
                y: isPlayingTrigger ? [0, 14, 0] : [0, 7, 0],
                rotate: isPlayingTrigger ? [-6, 6, -6] : [-2, 2, -2],
              }}
              transition={{ repeat: Infinity, duration: isPlayingTrigger ? 0.8 : 1.9, ease: 'easeInOut' }}
            >
              {/* Dog Cranium / Golden Fur */}
              <ellipse cx="62" cy="62" rx="34" ry="28" fill="#D97706" />
              <ellipse cx="60" cy="60" rx="30" ry="24" fill="#F59E0B" />

              {/* Floppy Golden Ear that swings realistically */}
              <motion.path
                d="M 44 48 C 26 65 30 100 46 102 C 58 102 54 78 54 52 Z"
                fill="#B45309"
                stroke="#78350F"
                strokeWidth="1.5"
                animate={{ rotate: isPlayingTrigger ? [-14, 20, -14] : [-6, 8, -6] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                style={{ originX: '48px', originY: '48px' }}
              />

              {/* Tapered Muzzle / Snout */}
              <ellipse cx="88" cy="74" rx="24" ry="16" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
              <ellipse cx="106" cy="77" rx="9" ry="7" fill="#1E293B" />
              {/* Nose Shine reflection */}
              <ellipse cx="104" cy="75" rx="3" ry="2" fill="#94A3B8" />

              {/* Happy squinting playful eye */}
              <path d="M 68 56 Q 76 48 84 56" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M 76 46 Q 84 44 88 47" stroke="#92400E" strokeWidth="2" strokeLinecap="round" fill="none" />

              {/* Dynamic Air Sniff Puffs (pulsing in rhythmic inhalations) */}
              <motion.g
                animate={{ opacity: [0, 1, 0], x: [0, 8, 16], y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 1.1, ease: 'easeOut' }}
              >
                <circle cx="118" cy="72" r="3" fill="#60A5FA" opacity="0.8" />
                <circle cx="126" cy="69" r="4" fill="#60A5FA" opacity="0.6" />
                <circle cx="135" cy="67" r="5" fill="#93C5FD" opacity="0.4" />
              </motion.g>
            </motion.g>
          </svg>
        );

      // 2. CARDBOARD BOX SNIFF-OUT
      case 'box_sniff':
        return (
          <svg viewBox="0 0 260 190" className="w-full h-full max-h-52 drop-shadow-sm select-none">
            {/* Ground shadow */}
            <ellipse cx="130" cy="168" rx="115" ry="18" fill="#E2E8F0" />

            {/* Background Decoy Box */}
            <g transform="translate(18, 70)">
              <rect x="0" y="25" width="60" height="55" rx="6" fill="#C89666" stroke="#8C6239" strokeWidth="2.5" />
              <polygon points="0,25 20,5 80,5 60,25" fill="#DFB78C" stroke="#8C6239" strokeWidth="2" />
              <polygon points="60,25 80,5 80,60 60,80" fill="#A7764A" />
              <text x="30" y="60" fill="#784E2D" fontSize="14" fontWeight="bold" textAnchor="middle">📦</text>
            </g>

            {/* Active Mystery Target Box with vibrating aroma burst */}
            <motion.g
              animate={{
                y: isPlayingTrigger ? [-6, 2, -6] : [-2, 2, -2],
                rotate: isPlayingTrigger ? [-4, 4, -4] : [0, 1, 0],
              }}
              transition={{ repeat: Infinity, duration: isPlayingTrigger ? 0.4 : 2.2, ease: 'easeInOut' }}
            >
              <g transform="translate(90, 60)">
                {/* Box body */}
                <rect x="0" y="30" width="80" height="70" rx="8" fill="#D4A373" stroke="#8C6239" strokeWidth="3" />
                {/* Shipping label */}
                <rect x="15" y="55" width="28" height="22" rx="3" fill="#FFFFFF" opacity="0.9" />
                <line x1="20" y1="62" x2="38" y2="62" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
                <line x1="20" y1="68" x2="34" y2="68" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
                {/* Barcode */}
                <line x1="20" y1="72" x2="20" y2="74" stroke="#0F172A" strokeWidth="2" />
                <line x1="24" y1="72" x2="24" y2="74" stroke="#0F172A" strokeWidth="1" />
                <line x1="27" y1="72" x2="27" y2="74" stroke="#0F172A" strokeWidth="2" />

                {/* Left Flap Flapping */}
                <motion.polygon
                  points="0,30 -22,2 25,12 35,30"
                  fill="#FAEDCD"
                  stroke="#8C6239"
                  strokeWidth="2"
                  animate={{ rotate: isPlayingTrigger ? [-15, 5, -15] : [-4, 4, -4] }}
                  transition={{ repeat: Infinity, duration: 1.4 }}
                  style={{ originX: '0px', originY: '30px' }}
                />
                {/* Right Flap Flapping */}
                <motion.polygon
                  points="80,30 102,2 55,12 45,30"
                  fill="#E6CCB2"
                  stroke="#8C6239"
                  strokeWidth="2"
                  animate={{ rotate: isPlayingTrigger ? [15, -5, 15] : [4, -4, 4] }}
                  transition={{ repeat: Infinity, duration: 1.4, delay: 0.2 }}
                  style={{ originX: '80px', originY: '30px' }}
                />

                {/* Scent Waves Billowing Out */}
                <motion.path
                  d="M 40 20 Q 25 -10 45 -30 Q 60 -50 45 -70"
                  stroke="#F59E0B"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray="6 6"
                  animate={{ strokeDashoffset: [0, -36], opacity: [0.3, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
                />
                <motion.path
                  d="M 50 18 Q 70 -5 55 -28 Q 40 -48 60 -65"
                  stroke="#EA580C"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray="5 5"
                  animate={{ strokeDashoffset: [0, -32], opacity: [0.2, 0.9, 0] }}
                  transition={{ repeat: Infinity, duration: 2.0, ease: 'linear', delay: 0.4 }}
                />
              </g>
            </motion.g>

            {/* Enthusiastic Dog Backside & Hyperspeed Wagging Tail */}
            <g transform="translate(185, 110)">
              {/* Dog Haunches / Body */}
              <ellipse cx="20" cy="25" rx="30" ry="26" fill="#D97706" stroke="#92400E" strokeWidth="2" />
              <ellipse cx="38" cy="40" rx="12" ry="10" fill="#B45309" />

              {/* Realistic wagging tail with motion blur arcs */}
              <motion.path
                d="M 28 10 Q 55 -8 50 -40"
                stroke="#B45309"
                strokeWidth="14"
                strokeLinecap="round"
                fill="none"
                animate={{
                  rotate: isPlayingTrigger ? [-34, 34, -34] : [-22, 22, -22],
                }}
                transition={{ repeat: Infinity, duration: isPlayingTrigger ? 0.25 : 0.45, ease: 'easeInOut' }}
                style={{ originX: '28px', originY: '10px' }}
              />
              {/* Fluffy tail tip in white/golden */}
              <motion.circle
                cx="50"
                cy="-40"
                r="8"
                fill="#FEF3C7"
                animate={{
                  rotate: isPlayingTrigger ? [-34, 34, -34] : [-22, 22, -22],
                }}
                transition={{ repeat: Infinity, duration: isPlayingTrigger ? 0.25 : 0.45, ease: 'easeInOut' }}
                style={{ originX: '28px', originY: '10px' }}
              />
            </g>
          </svg>
        );

      // 3. MUFFIN TIN SCENT PUZZLE
      case 'muffin_tin':
        return (
          <svg viewBox="0 0 260 190" className="w-full h-full max-h-52 drop-shadow-sm select-none">
            {/* Tin base on countertop */}
            <ellipse cx="130" cy="160" rx="100" ry="18" fill="#CBD5E1" />

            {/* Metallic 6-Cup Muffin Pan (Silver brushed gradient) */}
            <rect x="35" y="65" width="190" height="95" rx="20" fill="#94A3B8" stroke="#475569" strokeWidth="3.5" />
            <rect x="42" y="72" width="176" height="81" rx="14" fill="#64748B" />

            {/* 6 Pressed Metal Cups */}
            {[
              { x: 72, y: 92 },
              { x: 130, y: 92 },
              { x: 188, y: 92 },
              { x: 72, y: 132 },
              { x: 130, y: 132 },
              { x: 188, y: 132 },
            ].map((cup, i) => (
              <ellipse key={i} cx={cup.x} cy={cup.y} rx="22" ry="13" fill="#334155" stroke="#1E293B" strokeWidth="2" />
            ))}

            {/* Static Tennis Balls in 5 cups with realistic felt seams */}
            {[
              { x: 72, y: 88 },
              { x: 188, y: 88 },
              { x: 72, y: 128 },
              { x: 130, y: 128 },
              { x: 188, y: 128 },
            ].map((ball, i) => (
              <g key={i}>
                <circle cx={ball.x} cy={ball.y} r="18" fill="#84CC16" stroke="#4D7C0F" strokeWidth="2" />
                {/* Curved Tennis Ball Seam */}
                <path d={`M ${ball.x - 12} ${ball.y - 8} Q ${ball.x} ${ball.y} ${ball.x + 12} ${ball.y - 8}`} stroke="#FFFFFF" strokeWidth="2" fill="none" opacity="0.9" />
              </g>
            ))}

            {/* Center Cup Revealed Treat (Smelly meatball treat with steam aroma!) */}
            <motion.g
              animate={{ scale: [1, 1.25, 1], y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 1.6 }}
            >
              <circle cx="130" cy="90" r="10" fill="#B45309" stroke="#78350F" strokeWidth="2" />
              <circle cx="127" cy="87" r="2.5" fill="#D97706" />
              <circle cx="133" cy="92" r="2" fill="#D97706" />
            </motion.g>

            {/* Dynamic Flying Tennis Ball Bouncing Up & Spinning! */}
            <motion.g
              animate={{
                y: isPlayingTrigger ? [-15, -65, -15] : [-10, -45, -10],
                x: isPlayingTrigger ? [0, 15, 0] : [0, 8, 0],
                rotate: [0, 240, 480],
              }}
              transition={{ repeat: Infinity, duration: isPlayingTrigger ? 1.2 : 2.0, ease: 'easeInOut' }}
              style={{ originX: '130px', originY: '88px' }}
            >
              <circle cx="130" cy="88" r="19" fill="#A3E635" stroke="#4D7C0F" strokeWidth="2.5" />
              <path d="M 118 80 Q 130 88 142 80" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />
              <path d="M 118 96 Q 130 88 142 96" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />
            </motion.g>

            {/* Dog's Paw reaching in and booping the tennis ball! */}
            <motion.g
              animate={{
                x: isPlayingTrigger ? [0, 32, 0] : [0, 20, 0],
                y: isPlayingTrigger ? [0, -18, 0] : [0, -10, 0],
              }}
              transition={{ repeat: Infinity, duration: isPlayingTrigger ? 1.2 : 2.0, ease: 'easeInOut' }}
            >
              <ellipse cx="25" cy="120" rx="20" ry="14" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
              {/* Toe beans / claws */}
              <circle cx="12" cy="110" r="6" fill="#D97706" />
              <circle cx="24" cy="104" r="6.5" fill="#D97706" />
              <circle cx="36" cy="108" r="6" fill="#D97706" />
            </motion.g>
          </svg>
        );

      // 4. LIVING ROOM SCENT TRAIL
      case 'scent_trail':
        return (
          <svg viewBox="0 0 260 190" className="w-full h-full max-h-52 drop-shadow-sm select-none">
            {/* Wooden Floor Planks */}
            <rect x="20" y="25" width="220" height="145" rx="14" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="2.5" />
            <line x1="20" y1="75" x2="240" y2="75" stroke="#FDE68A" strokeWidth="1.5" />
            <line x1="20" y1="125" x2="240" y2="125" stroke="#FDE68A" strokeWidth="1.5" />

            {/* Curving Scent Trail Path */}
            <path
              id="scent-curve"
              d="M 45 140 C 95 155 70 85 125 90 C 175 95 160 40 210 45"
              stroke="#D97706"
              strokeWidth="4.5"
              strokeDasharray="8 8"
              fill="none"
              strokeLinecap="round"
            />

            {/* Dynamic Traveling Scent Particle Packet */}
            <motion.circle
              r="7"
              fill="#EF4444"
              stroke="#B91C1C"
              strokeWidth="2"
              animate={{
                offsetDistance: ['0%', '100%'],
              }}
              style={{
                offsetPath: `path("M 45 140 C 95 155 70 85 125 90 C 175 95 160 40 210 45")`,
              }}
              transition={{ repeat: Infinity, duration: isPlayingTrigger ? 2.0 : 3.6, ease: 'linear' }}
            />

            {/* Glowing Scent Pawprints along the trail */}
            {[
              { x: 55, y: 135, rot: 15 },
              { x: 88, y: 110, rot: -20 },
              { x: 125, y: 90, rot: 10 },
              { x: 165, y: 70, rot: -15 },
              { x: 195, y: 50, rot: 25 },
            ].map((pt, i) => (
              <motion.g
                key={i}
                transform={`translate(${pt.x}, ${pt.y}) rotate(${pt.rot})`}
                animate={{
                  opacity: [0.2, 1, 0.2],
                  scale: [0.9, 1.25, 0.9],
                }}
                transition={{ repeat: Infinity, duration: 1.8, delay: i * 0.35 }}
              >
                <ellipse cx="0" cy="0" rx="5" ry="4" fill="#B45309" />
                <circle cx="-4" cy="-5" r="2.5" fill="#B45309" />
                <circle cx="0" cy="-7" r="2.5" fill="#B45309" />
                <circle cx="4" cy="-5" r="2.5" fill="#B45309" />
              </motion.g>
            ))}

            {/* Treasure Box / Squeaker Trophy at the finish */}
            <motion.g
              transform="translate(210, 45)"
              animate={{
                rotate: isPlayingTrigger ? [-15, 15, -15] : [-6, 6, -6],
                scale: isPlayingTrigger ? [1, 1.3, 1] : [1, 1.1, 1],
              }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              <circle cx="0" cy="0" r="16" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2.5" />
              <text x="0" y="5" fontSize="14" textAnchor="middle">🏆</text>
            </motion.g>
          </svg>
        );

      // 5. CUP SHUFFLE (Vegas Shell Game)
      case 'cup_shuffle':
        return (
          <svg viewBox="0 0 260 190" className="w-full h-full max-h-52 drop-shadow-sm select-none">
            {/* Table Surface with wood texture */}
            <line x1="20" y1="145" x2="240" y2="145" stroke="#64748B" strokeWidth="5" strokeLinecap="round" />
            <ellipse cx="130" cy="150" rx="105" ry="12" fill="#E2E8F0" />

            {/* Left Red Cup Sliding */}
            <motion.g
              animate={{
                x: isPlayingTrigger ? [0, 60, -30, 0] : [0, 50, 0],
              }}
              transition={{ repeat: Infinity, duration: isPlayingTrigger ? 1.4 : 2.5, ease: 'easeInOut' }}
            >
              <path d="M 40 145 L 52 85 L 82 85 L 94 145 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="2.5" />
              <ellipse cx="67" cy="85" rx="15" ry="5" fill="#F87171" stroke="#B91C1C" strokeWidth="1.5" />
              <line x1="50" y1="115" x2="84" y2="115" stroke="#FFFFFF" strokeWidth="2" opacity="0.6" strokeLinecap="round" />
            </motion.g>

            {/* Middle Blue Cup (Lifting in excitement to reveal jackpot!) */}
            <motion.g
              animate={{
                y: isPlayingTrigger ? [-25, -60, -25] : [0, -40, 0],
                rotate: isPlayingTrigger ? [-12, 12, -12] : [-2, 2, -2],
              }}
              transition={{ repeat: Infinity, duration: 2.1, ease: 'easeInOut', delay: 0.3 }}
            >
              <path d="M 105 145 L 117 85 L 147 85 L 159 145 Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2.5" />
              <ellipse cx="132" cy="85" rx="15" ry="5" fill="#60A5FA" stroke="#1D4ED8" strokeWidth="1.5" />
              <line x1="115" y1="115" x2="149" y2="115" stroke="#FFFFFF" strokeWidth="2" opacity="0.6" strokeLinecap="round" />
            </motion.g>

            {/* Hidden Golden Treat Under Center Cup */}
            <motion.g
              animate={{ scale: [0.9, 1.3, 0.9] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              <circle cx="132" cy="136" r="9" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
              <path d="M 132 120 L 134 125 L 139 127 L 134 129 L 132 134 L 130 129 L 125 127 L 130 125 Z" fill="#FDE047" />
            </motion.g>

            {/* Right Green Cup Sliding */}
            <motion.g
              animate={{
                x: isPlayingTrigger ? [0, -60, 30, 0] : [0, -50, 0],
              }}
              transition={{ repeat: Infinity, duration: isPlayingTrigger ? 1.4 : 2.5, ease: 'easeInOut' }}
            >
              <path d="M 170 145 L 182 85 L 212 85 L 224 145 Z" fill="#10B981" stroke="#047857" strokeWidth="2.5" />
              <ellipse cx="197" cy="85" rx="15" ry="5" fill="#34D399" stroke="#047857" strokeWidth="1.5" />
              <line x1="180" y1="115" x2="214" y2="115" stroke="#FFFFFF" strokeWidth="2" opacity="0.6" strokeLinecap="round" />
            </motion.g>

            {/* Inquisitive Dog Head peering over table with alert twitching ears */}
            <motion.g
              animate={{
                y: isPlayingTrigger ? [-12, 2, -12] : [-4, 4, -4],
              }}
              transition={{ repeat: Infinity, duration: 1.8 }}
            >
              <ellipse cx="132" cy="42" rx="38" ry="26" fill="#D97706" />
              {/* Pointy Alert Ears */}
              <motion.polygon
                points="105,32 90,-2 122,20"
                fill="#B45309"
                animate={{ rotate: [-4, 6, -4] }}
                transition={{ repeat: Infinity, duration: 0.9 }}
                style={{ originX: '105px', originY: '32px' }}
              />
              <motion.polygon
                points="159,32 174,-2 142,20"
                fill="#B45309"
                animate={{ rotate: [4, -6, 4] }}
                transition={{ repeat: Infinity, duration: 0.9 }}
                style={{ originX: '159px', originY: '32px' }}
              />
              {/* Wide Eyes tracking cups */}
              <circle cx="118" cy="40" r="7" fill="#FFFFFF" />
              <motion.circle
                cx="119"
                cy="40"
                r="3.5"
                fill="#0F172A"
                animate={{ cx: [116, 122, 116] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
              />
              <circle cx="146" cy="40" r="7" fill="#FFFFFF" />
              <motion.circle
                cx="147"
                cy="40"
                r="3.5"
                fill="#0F172A"
                animate={{ cx: [144, 150, 144] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
              />
              <ellipse cx="132" cy="54" rx="7" ry="5" fill="#0F172A" />
            </motion.g>
          </svg>
        );

      // 6. FROZEN KONG FORTRESS
      case 'frozen_kong':
        return (
          <svg viewBox="0 0 260 190" className="w-full h-full max-h-52 drop-shadow-sm select-none">
            {/* Frost crystals and sparkling ice flakes in background */}
            {[
              { x: 45, y: 40, s: 1.2 },
              { x: 215, y: 55, s: 1.4 },
              { x: 40, y: 130, s: 0.9 },
              { x: 210, y: 135, s: 1.1 },
            ].map((flake, i) => (
              <motion.g
                key={i}
                transform={`translate(${flake.x}, ${flake.y}) scale(${flake.s})`}
                animate={{ rotate: 360, y: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 4.5 + i, ease: 'linear' }}
              >
                <path d="M 0 -8 L 0 8 M -8 0 L 8 0 M -5 -5 L 5 5 M -5 5 L 5 -5" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
              </motion.g>
            ))}

            {/* Classic Tiered Kong Rubber Toy (Wobbling and dripping peanut butter) */}
            <motion.g
              animate={{
                rotate: isPlayingTrigger ? [-16, 16, -16] : [-7, 7, -7],
                y: isPlayingTrigger ? [-6, 6, -6] : [-2, 2, -2],
              }}
              transition={{ repeat: Infinity, duration: isPlayingTrigger ? 1.0 : 2.2, ease: 'easeInOut' }}
              style={{ originX: '130px', originY: '110px' }}
            >
              {/* Bottom Large Tier */}
              <ellipse cx="130" cy="126" rx="38" ry="26" fill="#EF4444" stroke="#991B1B" strokeWidth="3.5" />
              {/* Middle Tier */}
              <ellipse cx="130" cy="98" rx="29" ry="20" fill="#EF4444" stroke="#991B1B" strokeWidth="3.5" />
              {/* Top Tier */}
              <ellipse cx="130" cy="72" rx="20" ry="14" fill="#EF4444" stroke="#991B1B" strokeWidth="3.5" />
              {/* Hollow Top Opening */}
              <ellipse cx="130" cy="62" rx="10" ry="5" fill="#7F1D1D" />

              {/* Delicious Peanut Butter / Yogurt Filling dripping down */}
              <path d="M 124 64 Q 130 82 134 90 Q 138 82 136 64 Z" fill="#F59E0B" />
              <motion.circle
                cx="134"
                cy="92"
                r="3.5"
                fill="#F59E0B"
                animate={{ y: [0, 8, 16], opacity: [1, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </motion.g>

            {/* Playful Pink Dog Tongue Licking in rhythm! */}
            <motion.path
              d="M 130 58 Q 148 35 158 48 Q 142 66 130 58"
              fill="#FB7185"
              stroke="#BE123C"
              strokeWidth="2.5"
              animate={{
                scale: isPlayingTrigger ? [0.7, 1.4, 0.7] : [0.8, 1.25, 0.8],
                rotate: isPlayingTrigger ? [-12, 16, -12] : [-6, 8, -6],
              }}
              transition={{ repeat: Infinity, duration: isPlayingTrigger ? 0.45 : 0.75, ease: 'easeInOut' }}
              style={{ originX: '130px', originY: '58px' }}
            />
          </svg>
        );

      // 7. TOWEL BURRITO UNROLL
      case 'towel_burrito':
        return (
          <svg viewBox="0 0 260 190" className="w-full h-full max-h-52 drop-shadow-sm select-none">
            {/* Living room floor rug */}
            <ellipse cx="130" cy="155" rx="110" ry="18" fill="#F1F5F9" />

            {/* Rolled Towel Cylinder with stripes */}
            <motion.g
              animate={{
                x: isPlayingTrigger ? [-25, 25, -25] : [-12, 12, -12],
                rotate: isPlayingTrigger ? [-6, 6, -6] : [-2, 2, -2],
              }}
              transition={{ repeat: Infinity, duration: isPlayingTrigger ? 1.6 : 3.0, ease: 'easeInOut' }}
            >
              {/* Main Roll Body */}
              <rect x="50" y="90" width="140" height="46" rx="23" fill="#38BDF8" stroke="#0284C7" strokeWidth="3" />
              {/* End spiral coil */}
              <ellipse cx="50" cy="113" rx="14" ry="23" fill="#0284C7" />
              <ellipse cx="50" cy="113" rx="8" ry="15" fill="#BAE6FD" />
              {/* Decorative woven stripes */}
              <line x1="85" y1="90" x2="85" y2="136" stroke="#FFFFFF" strokeWidth="4" />
              <line x1="120" y1="90" x2="120" y2="136" stroke="#FDE047" strokeWidth="4" />
              <line x1="155" y1="90" x2="155" y2="136" stroke="#FFFFFF" strokeWidth="4" />

              {/* Treats tumbling out as towel unravels! */}
              <motion.circle
                cx="120"
                cy="85"
                r="7"
                fill="#EF4444"
                stroke="#B91C1C"
                strokeWidth="1.5"
                animate={{ y: [0, -18, 0], scale: [1, 1.35, 1] }}
                transition={{ repeat: Infinity, duration: 1.4 }}
              />
            </motion.g>

            {/* Dog Head with Nose actively booping and nudging the towel! */}
            <motion.g
              animate={{
                x: isPlayingTrigger ? [-28, 18, -28] : [-16, 10, -16],
                y: isPlayingTrigger ? [-4, 6, -4] : [-2, 4, -2],
              }}
              transition={{ repeat: Infinity, duration: isPlayingTrigger ? 1.6 : 3.0, ease: 'easeInOut' }}
            >
              {/* Golden Head */}
              <ellipse cx="205" cy="90" rx="30" ry="20" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
              {/* Snout pushing roll */}
              <ellipse cx="178" cy="100" rx="16" ry="11" fill="#D97706" />
              <ellipse cx="164" cy="103" rx="7" ry="5" fill="#0F172A" />
              {/* Squinting happy eye */}
              <path d="M 200 84 Q 206 78 212 84" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />
            </motion.g>
          </svg>
        );

      // 8. BOTTLE SPINNER CONTRAPTION
      case 'bottle_spinner':
        return (
          <svg viewBox="0 0 260 190" className="w-full h-full max-h-52 drop-shadow-sm select-none">
            {/* Wooden Base & Vertical Posts */}
            <line x1="45" y1="165" x2="215" y2="165" stroke="#78716C" strokeWidth="7" strokeLinecap="round" />
            <line x1="55" y1="60" x2="55" y2="165" stroke="#A8A29E" strokeWidth="8" strokeLinecap="round" />
            <line x1="205" y1="60" x2="205" y2="165" stroke="#A8A29E" strokeWidth="8" strokeLinecap="round" />
            {/* Horizontal Axis Axle */}
            <line x1="40" y1="85" x2="220" y2="85" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" />

            {/* Rotisserie Plastic Bottle Spinning 360 Degrees! */}
            <motion.g
              animate={{
                rotate: isPlayingTrigger ? [0, 720] : [0, 360],
              }}
              transition={{ repeat: Infinity, duration: isPlayingTrigger ? 1.6 : 3.8, ease: 'easeInOut' }}
              style={{ originX: '130px', originY: '85px' }}
            >
              {/* Translucent Bottle body */}
              <rect x="112" y="40" width="36" height="85" rx="10" fill="#A5F3FC" stroke="#0891B2" strokeWidth="2.5" opacity="0.85" />
              <line x1="114" y1="65" x2="146" y2="65" stroke="#FFFFFF" strokeWidth="2" opacity="0.7" />
              <line x1="114" y1="95" x2="146" y2="95" stroke="#FFFFFF" strokeWidth="2" opacity="0.7" />
              {/* Bottle Neck Opening */}
              <rect x="122" y="125" width="16" height="18" rx="2" fill="#A5F3FC" stroke="#0891B2" strokeWidth="2" />
            </motion.g>

            {/* Falling Kibbles / Rewards cascading down upon flip */}
            <motion.g
              animate={{
                y: [0, 50],
                opacity: [0, 1, 0],
              }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeIn' }}
            >
              <circle cx="128" cy="120" r="5.5" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
              <circle cx="134" cy="132" r="4.5" fill="#EF4444" stroke="#991B1B" strokeWidth="1" />
            </motion.g>

            {/* Dog Paw Slapping the Bottle into orbit! */}
            <motion.g
              animate={{
                x: isPlayingTrigger ? [0, -32, 0] : [0, -20, 0],
                y: isPlayingTrigger ? [0, -22, 0] : [0, -12, 0],
              }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            >
              <ellipse cx="180" cy="100" rx="16" ry="12" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
              <circle cx="168" cy="94" r="5" fill="#D97706" />
              <circle cx="178" cy="90" r="5" fill="#D97706" />
            </motion.g>
          </svg>
        );

      // 9. BROOMSTICK HURDLES
      case 'broomstick_hurdle':
        return (
          <svg viewBox="0 0 260 190" className="w-full h-full max-h-52 drop-shadow-sm select-none">
            {/* Ground Line */}
            <line x1="15" y1="165" x2="245" y2="165" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />

            {/* Book Stacks Support Bases */}
            <rect x="35" y="125" width="38" height="12" rx="2" fill="#DC2626" />
            <rect x="32" y="137" width="44" height="13" rx="2" fill="#2563EB" />
            <rect x="28" y="150" width="52" height="15" rx="3" fill="#16A34A" />

            <rect x="187" y="125" width="38" height="12" rx="2" fill="#DC2626" />
            <rect x="184" y="137" width="44" height="13" rx="2" fill="#2563EB" />
            <rect x="180" y="150" width="52" height="15" rx="3" fill="#16A34A" />

            {/* Wooden Broomstick Resting on books */}
            <line x1="45" y1="123" x2="215" y2="123" stroke="#D97706" strokeWidth="6" strokeLinecap="round" />

            {/* Parabolic Jump Trajectory Arc */}
            <path d="M 60 155 Q 130 15 200 155" stroke="#CBD5E1" strokeWidth="2.5" strokeDasharray="6 6" fill="none" />

            {/* Athletic Dog Soaring Gracefully Through the Air */}
            <motion.g
              animate={{
                x: isPlayingTrigger ? [-60, 15, 90] : [-50, 10, 80],
                y: isPlayingTrigger ? [50, -60, 50] : [45, -50, 45],
                rotate: isPlayingTrigger ? [-22, 0, 26] : [-16, 0, 20],
              }}
              transition={{ repeat: Infinity, duration: isPlayingTrigger ? 1.6 : 2.4, ease: 'easeInOut' }}
              style={{ originX: '130px', originY: '85px' }}
            >
              {/* Dog Torso */}
              <ellipse cx="110" cy="80" rx="34" ry="18" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
              {/* Head */}
              <circle cx="140" cy="70" r="16" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
              {/* Windblown Ear streaming behind */}
              <motion.path
                d="M 134 60 Q 112 48 100 64"
                stroke="#B45309"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
                animate={{ rotate: [-6, 12, -6] }}
                transition={{ repeat: Infinity, duration: 0.6 }}
              />
              <circle cx="152" cy="70" r="4.5" fill="#0F172A" />
              {/* Front Paws reaching forward */}
              <line x1="128" y1="88" x2="152" y2="100" stroke="#D97706" strokeWidth="6" strokeLinecap="round" />
              {/* Rear Paws tucked aerodynamic */}
              <line x1="92" y1="86" x2="74" y2="102" stroke="#D97706" strokeWidth="6" strokeLinecap="round" />
              {/* Joyful Tail */}
              <path d="M 80 76 Q 64 60 72 48" stroke="#B45309" strokeWidth="5" strokeLinecap="round" fill="none" />
            </motion.g>
          </svg>
        );

      // 10. BACKYARD OBSTACLE DASH
      case 'obstacle_dash':
        return (
          <svg viewBox="0 0 260 190" className="w-full h-full max-h-52 drop-shadow-sm select-none">
            {/* Lawn Grass field */}
            <rect x="15" y="25" width="230" height="145" rx="14" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="2" />

            {/* Obstacle 1: Fluffy Pillow Stepping Stone */}
            <rect x="35" y="115" width="50" height="28" rx="10" fill="#F43F5E" stroke="#E11D48" strokeWidth="2" />
            <path d="M 45 129 L 75 129" stroke="#FECDD3" strokeWidth="2.5" strokeLinecap="round" />

            {/* Obstacle 2: Chair Arch Tunnel */}
            <path d="M 105 145 L 105 92 L 155 92 L 155 145" stroke="#3B82F6" strokeWidth="5" fill="#EFF6FF" />

            {/* Obstacle 3: Slalom Traffic Cone */}
            <polygon points="195,145 210,95 225,145" fill="#F97316" stroke="#EA580C" strokeWidth="2" />
            <rect x="190" y="142" width="40" height="7" rx="2" fill="#EA580C" />

            {/* High-speed zoomie dog sprinting through the course! */}
            <motion.g
              animate={{
                x: isPlayingTrigger ? [15, 80, 150, 210] : [20, 85, 145, 200],
                y: isPlayingTrigger ? [100, 125, 100, 120] : [105, 120, 105, 115],
              }}
              transition={{ repeat: Infinity, duration: isPlayingTrigger ? 1.6 : 2.6, ease: 'easeInOut' }}
            >
              <ellipse cx="25" cy="105" rx="20" ry="13" fill="#D97706" />
              <circle cx="40" cy="98" r="10" fill="#FBBF24" />
              <circle cx="48" cy="98" r="3.5" fill="#0F172A" />
              {/* Zoom Wind Lines */}
              <line x1="0" y1="100" x2="-18" y2="100" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="-5" y1="110" x2="-26" y2="110" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
            </motion.g>
          </svg>
        );

      // 11. HULA HOOP PORTAL
      case 'hula_hoop':
        return (
          <svg viewBox="0 0 260 190" className="w-full h-full max-h-52 drop-shadow-sm select-none">
            {/* Ground Line */}
            <line x1="20" y1="155" x2="240" y2="155" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />

            {/* Back half of 3D Hula Hoop ring */}
            <ellipse cx="130" cy="95" rx="38" ry="60" fill="none" stroke="#7C3AED" strokeWidth="8" />

            {/* Dog jumping directly through the ring portal */}
            <motion.g
              animate={{
                x: isPlayingTrigger ? [-50, 50] : [-38, 38],
                y: isPlayingTrigger ? [20, -22, 20] : [15, -15, 15],
              }}
              transition={{ repeat: Infinity, duration: isPlayingTrigger ? 1.2 : 1.8, ease: 'easeInOut' }}
            >
              <ellipse cx="130" cy="95" rx="30" ry="17" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
              <circle cx="152" cy="86" r="13" fill="#FBBF24" />
              <circle cx="162" cy="86" r="4" fill="#0F172A" />
              {/* Wagging tail */}
              <motion.path
                d="M 104 93 Q 86 78 94 66"
                stroke="#B45309"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
                animate={{ rotate: [-20, 20, -20] }}
                transition={{ repeat: Infinity, duration: 0.4 }}
              />
            </motion.g>

            {/* Front half of 3D Hula Hoop (creates realistic 3D depth over dog body) */}
            <path
              d="M 130 35 C 158 35 168 62 168 95 C 168 128 158 155 130 155"
              fill="none"
              stroke="#A855F7"
              strokeWidth="8"
              strokeLinecap="round"
            />

            {/* Sparkle explosion on portal pass-through */}
            <motion.path
              d="M 175 55 L 178 61 L 184 62 L 178 64 L 175 70 L 172 64 L 166 62 L 172 61 Z"
              fill="#FDE047"
              animate={{ scale: [0.8, 1.5, 0.8] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            />
          </svg>
        );

      // 12. WEAVE POLE SLALOM
      case 'weave_slalom':
        return (
          <svg viewBox="0 0 260 190" className="w-full h-full max-h-52 drop-shadow-sm select-none">
            {/* Ground Turf */}
            <ellipse cx="130" cy="155" rx="110" ry="16" fill="#F1F5F9" />

            {/* 4 Professional Agility Slalom Poles with Red & White Stripes */}
            {[50, 100, 150, 200].map((x, i) => (
              <g key={i}>
                <rect x={x - 5} y="40" width="10" height="105" rx="4" fill={i % 2 === 0 ? '#3B82F6' : '#EF4444'} />
                <ellipse cx={x} cy="145" rx="16" ry="6" fill="#64748B" />
                {/* Crisp white warning bands */}
                <rect x={x - 5} y="68" width="10" height="14" fill="#FFFFFF" />
                <rect x={x - 5} y="105" width="10" height="14" fill="#FFFFFF" />
              </g>
            ))}

            {/* Curving Agility Slalom Wave Line */}
            <path
              d="M 25 115 Q 50 80 75 115 Q 100 150 125 115 Q 150 80 175 115 Q 200 150 235 115"
              stroke="#F59E0B"
              strokeWidth="4"
              strokeDasharray="6 6"
              fill="none"
            />

            {/* Fluid Snake-like Dog Weaving */}
            <motion.g
              animate={{
                x: isPlayingTrigger ? [15, 65, 115, 165, 215] : [20, 70, 120, 170, 210],
                y: isPlayingTrigger ? [12, -20, 20, -20, 12] : [8, -15, 15, -15, 8],
              }}
              transition={{ repeat: Infinity, duration: isPlayingTrigger ? 1.8 : 3.0, ease: 'easeInOut' }}
            >
              <ellipse cx="30" cy="115" rx="20" ry="13" fill="#D97706" stroke="#92400E" strokeWidth="1.5" />
              <circle cx="46" cy="110" r="11" fill="#FBBF24" />
              <circle cx="55" cy="110" r="3.5" fill="#0F172A" />
            </motion.g>
          </svg>
        );

      // 13. SECRET GHOST TUNNEL
      case 'sheet_tunnel':
        return (
          <svg viewBox="0 0 260 190" className="w-full h-full max-h-52 drop-shadow-sm select-none">
            {/* Ambient Sheet Canopy Tented over chairs */}
            <path
              d="M 40 148 C 40 55 220 55 220 148"
              fill="#E0E7FF"
              stroke="#6366F1"
              strokeWidth="4"
            />
            <path
              d="M 60 148 C 60 78 200 78 200 148"
              fill="#1E1B4B"
            />

            {/* Glowing Peeking Dog Eyes inside the mysterious tunnel */}
            <motion.g
              animate={{
                y: isPlayingTrigger ? [-10, 4, -10] : [-4, 4, -4],
              }}
              transition={{ repeat: Infinity, duration: 1.6 }}
            >
              {/* Left Eye */}
              <circle cx="118" cy="112" r="13" fill="#FFFFFF" stroke="#312E81" strokeWidth="2" />
              <circle cx="120" cy="112" r="7" fill="#0F172A" />
              <circle cx="123" cy="109" r="2.5" fill="#FFFFFF" />

              {/* Right Eye */}
              <circle cx="142" cy="112" r="13" fill="#FFFFFF" stroke="#312E81" strokeWidth="2" />
              <circle cx="140" cy="112" r="7" fill="#0F172A" />
              <circle cx="143" cy="109" r="2.5" fill="#FFFFFF" />

              {/* Shiny Nose Booping Forward */}
              <ellipse cx="130" cy="126" rx="9" ry="6" fill="#0F172A" />
            </motion.g>

            {/* Magic twinkle stars outside */}
            <motion.circle cx="85" cy="70" r="4.5" fill="#FBBF24" animate={{ scale: [1, 1.6, 1] }} transition={{ repeat: Infinity, duration: 1.4 }} />
            <motion.circle cx="175" cy="75" r="4.5" fill="#FBBF24" animate={{ scale: [1, 1.6, 1] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.5 }} />
          </svg>
        );

      // 14. SECRET SOCK HEIST
      case 'sock_heist':
        return (
          <svg viewBox="0 0 260 190" className="w-full h-full max-h-52 drop-shadow-sm select-none">
            {/* Proud Detective Dog Trotting across the room with stolen sock! */}
            <motion.g
              animate={{
                y: isPlayingTrigger ? [-8, 8, -8] : [-4, 4, -4],
                rotate: isPlayingTrigger ? [-4, 4, -4] : [-2, 2, -2],
              }}
              transition={{ repeat: Infinity, duration: isPlayingTrigger ? 0.7 : 1.2, ease: 'easeInOut' }}
            >
              {/* Body */}
              <ellipse cx="120" cy="110" rx="40" ry="24" fill="#D97706" stroke="#92400E" strokeWidth="2" />
              {/* Head */}
              <circle cx="165" cy="88" r="22" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
              {/* Ear flapping joyfully */}
              <motion.path
                d="M 152 76 C 140 94 146 116 158 116"
                stroke="#B45309"
                strokeWidth="9"
                strokeLinecap="round"
                fill="none"
                animate={{ rotate: [-6, 10, -6] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
              />
              {/* Happy squint eye */}
              <path d="M 166 82 Q 173 75 180 82" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" fill="none" />

              {/* Striped Gym Sock Held Proudly in Jaws! */}
              <motion.g
                animate={{ rotate: isPlayingTrigger ? [-14, 14, -14] : [-8, 8, -8] }}
                transition={{ repeat: Infinity, duration: 0.6 }}
                style={{ originX: '180px', originY: '95px' }}
              >
                <path d="M 175 95 L 215 97 L 225 125 L 205 133 L 198 108 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
                <line x1="185" y1="96" x2="185" y2="105" stroke="#FFFFFF" strokeWidth="3.5" />
                <line x1="195" y1="96" x2="195" y2="107" stroke="#FFFFFF" strokeWidth="3.5" />
                <line x1="205" y1="97" x2="205" y2="112" stroke="#FFFFFF" strokeWidth="3.5" />
              </motion.g>

              {/* Trotting Leg Pairs */}
              <line x1="95" y1="126" x2="90" y2="158" stroke="#B45309" strokeWidth="7" strokeLinecap="round" />
              <line x1="135" y1="126" x2="145" y2="158" stroke="#B45309" strokeWidth="7" strokeLinecap="round" />
              {/* Upright Victory Flag Tail */}
              <path d="M 85 105 Q 65 88 75 70" stroke="#B45309" strokeWidth="7" strokeLinecap="round" fill="none" />
            </motion.g>
          </svg>
        );

      default:
        return (
          <div className="flex items-center justify-center h-48 text-6xl select-none animate-bounce">
            🐕✨
          </div>
        );
    }
  };

  return (
    <div
      id={`illustration-${illustrationKey}`}
      onClick={handleInteraction}
      className={`relative w-full rounded-3xl bg-gradient-to-b ${theme.bg} border ${theme.border} p-3 sm:p-4 flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ${
        interactive ? 'cursor-pointer hover:shadow-lg active:scale-[0.99] group' : ''
      } ${className}`}
      title={interactive ? 'Tap to trigger extra playful dog animations!' : undefined}
    >
      {/* Background Subtle Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${theme.glow} 0%, transparent 70%)`,
        }}
      />

      {/* Main Vector Stage */}
      <div className="w-full flex items-center justify-center relative z-10">
        {renderVisual()}
      </div>

      {/* Playful Interactive Pill at the Bottom */}
      {interactive && (
        <div className="mt-1.5 flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-stone-700 shadow-sm border border-stone-200/80 group-hover:border-amber-400 transition-all">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
          <span>
            {clickCount > 0
              ? `Zoomies Active! (${clickCount} ${clickCount === 1 ? 'boop' : 'boops'})`
              : 'Tap to interact & see actions!'}
          </span>
        </div>
      )}
    </div>
  );
};
