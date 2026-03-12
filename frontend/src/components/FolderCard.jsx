import React, { useState, useEffect, useRef } from 'react';
import { FiFolder } from 'react-icons/fi';

const FolderCard = ({ title, date, color, mousePos }) => {
  const [rect, setRect] = useState(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      setRect(cardRef.current.getBoundingClientRect());
    }
  }, []);

  // Consolidated color themes mapping
  const colorThemes = {
    'bg-blue-100': {
      glow: 'rgba(37, 99, 235, 0.15)',
      bottomGlow: 'from-blue-600',
      border: 'bg-blue-400',
      innerGlow: 'from-blue-500/40',
      lightBehindGlow: 'bg-blue-400/60',
      lightBehindLine: 'bg-blue-400',
      lightIconColor: 'text-blue-500'
    },
    'bg-pink-100': {
      glow: 'rgba(219, 39, 119, 0.15)',
      bottomGlow: 'from-pink-600',
      border: 'bg-pink-400',
      innerGlow: 'from-pink-500/40',
      lightBehindGlow: 'bg-pink-400/60',
      lightBehindLine: 'bg-pink-400',
      lightIconColor: 'text-pink-500'
    },
    'bg-yellow-100': {
      glow: 'rgba(245, 158, 11, 0.15)',
      bottomGlow: 'from-amber-500',
      border: 'bg-amber-300',
      innerGlow: 'from-amber-400/40',
      lightBehindGlow: 'bg-amber-400/60',
      lightBehindLine: 'bg-amber-400',
      lightIconColor: 'text-amber-500'
    },
    'bg-green-100': {
      glow: 'rgba(16, 185, 129, 0.15)',
      bottomGlow: 'from-emerald-500',
      border: 'bg-emerald-400',
      innerGlow: 'from-emerald-400/40',
      lightBehindGlow: 'bg-emerald-400/60',
      lightBehindLine: 'bg-emerald-400',
      lightIconColor: 'text-emerald-500'
    },
    'bg-purple-100': {
      glow: 'rgba(147, 51, 234, 0.15)',
      bottomGlow: 'from-purple-600',
      border: 'bg-purple-400',
      innerGlow: 'from-purple-500/40',
      lightBehindGlow: 'bg-purple-400/60',
      lightBehindLine: 'bg-purple-400',
      lightIconColor: 'text-purple-500'
    },
    'bg-rose-100': {
      glow: 'rgba(225, 29, 72, 0.15)',
      bottomGlow: 'from-rose-600',
      border: 'bg-rose-400',
      innerGlow: 'from-rose-500/40',
      lightBehindGlow: 'bg-rose-400/60',
      lightBehindLine: 'bg-rose-400',
      lightIconColor: 'text-rose-500'
    }
  };

  const theme = colorThemes[color] || {
    glow: 'rgba(75, 85, 99, 0.15)',
    bottomGlow: 'from-gray-600',
    border: 'bg-gray-400',
    innerGlow: 'from-gray-500/40',
    lightBehindGlow: 'bg-gray-400/60',
    lightBehindLine: 'bg-gray-400',
    lightIconColor: 'text-gray-500',
  };

  const glowColorStr = theme.glow;
  const bottomGlowColor = theme.bottomGlow;
  const borderColor = theme.border;
  const lightBehindGlow = theme.lightBehindGlow;
  const lightBehindLine = theme.lightBehindLine;
  const lightIconColor = theme.lightIconColor;

  return (
    <div ref={cardRef} className="relative group cursor-pointer transition-all duration-300 hover:scale-[1.02]">
      {/* === LIGHT MODE: BEHIND-CARD GLOW === */}
      <div className={`absolute -inset-x-2 -bottom-4 top-[30%] rounded-[2rem] ${lightBehindGlow} blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500 dark:hidden pointer-events-none`} />
      <div className={`absolute bottom-0 left-[5%] right-[5%] h-[6px] rounded-full ${lightBehindLine} blur-[4px] opacity-70 group-hover:opacity-90 transition-opacity duration-500 dark:hidden pointer-events-none`} />


      {/* === THE CARD (solid opaque surface) === */}
      <div
        className={`relative w-full h-[60px] rounded-xl overflow-hidden flex items-center
          border border-gray-200/80 dark:border-white/10
          bg-gradient-to-b from-white to-gray-50 dark:from-transparent dark:to-transparent
          dark:bg-[#0f0f0f]/80
          backdrop-blur-xl
          shadow-[0_2px_8px_rgba(0,0,0,0.06)]
          dark:shadow-none
          px-4`}
      >
        {/* Proximity Glow (inside card so it's visible) */}
        {mousePos && rect && (
          <div
            className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300 opacity-60 group-hover:opacity-100 hidden dark:block"
            style={{
              background: `radial-gradient(800px circle at ${mousePos.x - rect.left}px ${mousePos.y - rect.top}px, ${glowColorStr}, transparent 40%)`
            }}
          />
        )}
        {mousePos && rect && (
          <div
            className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300 block dark:hidden z-[1]"
            style={{
              background: `radial-gradient(600px circle at ${mousePos.x - rect.left}px ${mousePos.y - rect.top}px, ${glowColorStr.replace('0.15', '0.08')}, transparent 40%)`
            }}
          />
        )}
        {/* Light Mode: Subtle top edge highlight */}
        <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-white to-transparent dark:hidden pointer-events-none" />

        {/* Dark Mode: Bottom glow haze */}
        <div className={`absolute -bottom-6 left-0 right-0 h-28 bg-gradient-to-t ${bottomGlowColor} to-transparent opacity-60 blur-2xl group-hover:opacity-90 transition-opacity duration-500 pointer-events-none hidden dark:block`} />
        {/* Dark Mode: Bottom border line */}
        <div className={`absolute bottom-0 left-[0%] right-[0%] h-[3px] ${borderColor} blur-[1px] opacity-80 group-hover:opacity-100 transition-all duration-500 pointer-events-none hidden dark:block`} />

        {/* Main card content */}
        <div className="relative z-10 flex items-center gap-3 w-full">
          <div className={`relative w-9 h-9 shrink-0 rounded-lg bg-gray-50 dark:bg-black border border-gray-200/60 dark:border-white/10 flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_8px_rgba(0,0,0,0.6)] overflow-hidden`}>
            <FiFolder className={`relative z-10 ${lightIconColor} dark:text-white`} size={16} />
          </div>
          <h4 className="text-sm font-semibold text-gray-800 dark:text-white tracking-tight truncate flex-1 min-w-0">{title}</h4>
        </div>
      </div>
    </div>
  );
};

export default FolderCard;