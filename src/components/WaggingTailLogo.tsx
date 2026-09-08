import React, { useState } from 'react';

interface Props {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'horizontal';
  showSubtitle?: boolean;
  className?: string;
  animateOnHover?: boolean;
}

export default function WaggingTailLogo({
  size = 'md',
  variant = 'horizontal',
  showSubtitle = true,
  className = '',
}: Props) {
  const [isHovered, setIsHovered] = useState(false);

  // Dimension presets for the tail icon
  const iconSizes = {
    xs: 28,
    sm: 36,
    md: 46,
    lg: 64,
    xl: 92,
  };

  const dim = iconSizes[size];

  // Pure Animated Tail Emblem (No enclosing circle, bold, high-visibility)
  const Emblem = (
    <div
      className="relative select-none shrink-0 inline-flex items-center justify-center"
      style={{ width: dim, height: dim }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title="Wagging Tail Games"
    >
      <style>{`
        @keyframes wagLoop {
          0% { transform: rotate(-10deg); }
          50% { transform: rotate(14deg); }
          100% { transform: rotate(-10deg); }
        }
        @keyframes wagLoopFast {
          0% { transform: rotate(-14deg); }
          50% { transform: rotate(18deg); }
          100% { transform: rotate(-14deg); }
        }
        @keyframes wagSwooshLeft {
          0%, 100% { opacity: 0.15; transform: translateY(0px) scale(0.95); }
          50% { opacity: 0.95; transform: translateY(-2px) scale(1.05); }
        }
        @keyframes wagSwooshRight {
          0%, 100% { opacity: 0.95; transform: translateY(-2px) scale(1.05); }
          50% { opacity: 0.15; transform: translateY(0px) scale(0.95); }
        }
        .wag-tail-motion {
          transform-origin: 30px 135px;
          animation: wagLoop 1.4s ease-in-out infinite;
        }
        .wag-tail-motion.fast {
          animation: wagLoopFast 0.65s ease-in-out infinite;
        }
        .swoosh-left {
          animation: wagSwooshLeft 1.4s ease-in-out infinite;
        }
        .swoosh-right {
          animation: wagSwooshRight 1.4s ease-in-out infinite;
        }
      `}</style>

      <svg
        viewBox="0 0 160 160"
        width={dim}
        height={dim}
        className="w-full h-full overflow-visible drop-shadow-sm"
      >
        {/* Animated motion wag swooshes */}
        <g className="pointer-events-none">
          {/* Left swoosh lines */}
          <path
            d="M 40 45 C 50 30, 68 22, 85 24"
            fill="none"
            stroke="#40B3C9"
            strokeWidth="4"
            strokeLinecap="round"
            className="swoosh-left"
          />
          <path
            d="M 52 60 C 60 48, 76 42, 90 44"
            fill="none"
            stroke="#184D7A"
            strokeWidth="3"
            strokeLinecap="round"
            className="swoosh-left"
            opacity="0.8"
          />

          {/* Right swoosh lines */}
          <path
            d="M 125 32 C 142 42, 148 60, 144 78"
            fill="none"
            stroke="#40B3C9"
            strokeWidth="4"
            strokeLinecap="round"
            className="swoosh-right"
          />
          <path
            d="M 136 50 C 148 62, 150 78, 145 92"
            fill="none"
            stroke="#184D7A"
            strokeWidth="3"
            strokeLinecap="round"
            className="swoosh-right"
            opacity="0.8"
          />
        </g>

        {/* Fluffy Dog Tail with lively continuous wag animation */}
        <g className={`wag-tail-motion ${isHovered ? 'fast' : ''}`}>
          {/* Outer Saffron Orange fluffy tail body */}
          <path
            d="M 32 140 
               C 38 120, 68 100, 94 82
               C 108 72, 118 52, 122 34
               C 126 55, 122 72, 134 76
               C 128 92, 134 104, 139 112
               C 130 120, 126 130, 130 142
               C 119 140, 109 146, 106 154
               C 96 145, 80 142, 74 150
               C 62 140, 50 140, 44 144
               C 36 142, 33 141, 32 140 Z"
            fill="#FF7C00"
            stroke="#184D7A"
            strokeWidth="7"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Papaya Orange Inner Fur Highlight */}
          <path
            d="M 42 133 
               C 60 115, 84 94, 104 80
               C 114 72, 120 54, 122 35
               C 124 50, 121 64, 129 68
               C 118 78, 106 96, 94 110
               C 74 128, 58 135, 42 133 Z"
            fill="#FFB82E"
            opacity="0.95"
          />

          {/* Subtle fur accent tuft */}
          <path
            d="M 98 86 C 104 94, 112 100, 118 102"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.75"
          />
        </g>
      </svg>
    </div>
  );

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        {Emblem}
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div
        className={`flex flex-col items-center text-center select-none ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {Emblem}
        <div className="mt-2">
          <h1 className="font-display font-black text-xl sm:text-2xl text-[#184D7A] tracking-tight leading-tight">
            Wagging Tail Games
          </h1>
          {showSubtitle && (
            <p className="text-[11px] font-semibold text-[#40B3C9] mt-0.5 tracking-wide">
              by Leo Boy Games
            </p>
          )}
        </div>
      </div>
    );
  }

  // Variant: horizontal (default, optimal for header & navbars)
  return (
    <div
      className={`inline-flex items-center gap-2 sm:gap-2.5 select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {Emblem}
      <div className="flex flex-col justify-center">
        <span className="font-display font-black text-base sm:text-lg text-[#184D7A] tracking-tight leading-tight">
          Wagging Tail Games
        </span>
        {showSubtitle && (
          <span className="text-[10px] sm:text-[11px] font-semibold text-[#40B3C9] tracking-wide leading-none mt-0.5">
            by Leo Boy Games
          </span>
        )}
      </div>
    </div>
  );
}
