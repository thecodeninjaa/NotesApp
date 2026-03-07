import React, { useState, useEffect, useRef } from 'react';
import { FiFolder, FiMoreHorizontal } from 'react-icons/fi';

const FolderCard = ({ title, date, color, mousePos }) => {
  const [rect, setRect] = useState(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      setRect(cardRef.current.getBoundingClientRect());
    }
  }, []);

  // Map the existing light background classes to their corresponding glowing colors
  const glowMap = {
    'bg-blue-100': 'rgba(37, 99, 235, 0.15)', // blue-600
    'bg-pink-100': 'rgba(219, 39, 119, 0.15)', // pink-600
    'bg-yellow-100': 'rgba(245, 158, 11, 0.15)', // amber-500
    'bg-green-100': 'rgba(16, 185, 129, 0.15)', // emerald-500
    'bg-purple-100': 'rgba(147, 51, 234, 0.15)', // purple-600
    'bg-rose-100': 'rgba(225, 29, 72, 0.15)', // rose-600
  };

  const bottomGlowMap = {
    'bg-blue-100': 'from-blue-600',
    'bg-pink-100': 'from-pink-600',
    'bg-yellow-100': 'from-amber-500',
    'bg-green-100': 'from-emerald-500',
    'bg-purple-100': 'from-purple-600',
    'bg-rose-100': 'from-rose-600',
  };

  const borderGlowMap = {
    'bg-blue-100': 'bg-blue-400',
    'bg-pink-100': 'bg-pink-400',
    'bg-yellow-100': 'bg-amber-300',
    'bg-green-100': 'bg-emerald-400',
    'bg-purple-100': 'bg-purple-400',
    'bg-rose-100': 'bg-rose-400',
  };

  const innerGlowMap = {
    'bg-blue-100': 'from-blue-500/40',
    'bg-pink-100': 'from-pink-500/40',
    'bg-yellow-100': 'from-amber-400/40',
    'bg-green-100': 'from-emerald-400/40',
    'bg-purple-100': 'from-purple-500/40',
    'bg-rose-100': 'from-rose-500/40',
  };

  const lightModeBlobMap = {
    'bg-blue-100': 'from-cyan-100 via-blue-300 to-blue-500',
    'bg-pink-100': 'from-fuchsia-100 via-pink-300 to-rose-400',
    'bg-yellow-100': 'from-orange-100 via-amber-300 to-yellow-500',
    'bg-green-100': 'from-emerald-100 via-teal-300 to-green-500',
    'bg-purple-100': 'from-purple-100 via-purple-300 to-indigo-400',
    'bg-rose-100': 'from-rose-100 via-rose-300 to-pink-500',
  };

  // Light mode inner gradient maps
  const lightInnerGradientMap = {
    'bg-blue-100': 'from-sky-100/80 via-blue-200/70 to-indigo-400/60',
    'bg-pink-100': 'from-pink-100/80 via-fuchsia-200/70 to-rose-400/60',
    'bg-yellow-100': 'from-amber-100/80 via-orange-200/70 to-yellow-400/60',
    'bg-green-100': 'from-emerald-100/80 via-teal-200/70 to-green-400/60',
    'bg-purple-100': 'from-violet-100/80 via-purple-200/70 to-indigo-400/60',
    'bg-rose-100': 'from-rose-100/80 via-pink-200/70 to-fuchsia-400/60',
  };

  const lightHotspotMap = {
    'bg-blue-100': 'from-blue-400/50 via-indigo-300/30',
    'bg-pink-100': 'from-fuchsia-400/50 via-pink-300/30',
    'bg-yellow-100': 'from-amber-400/50 via-orange-300/30',
    'bg-green-100': 'from-emerald-400/50 via-teal-300/30',
    'bg-purple-100': 'from-purple-400/50 via-violet-300/30',
    'bg-rose-100': 'from-rose-400/50 via-pink-300/30',
  };

  const lightOuterGlowMap = {
    'bg-blue-100': 'from-blue-200/60 via-indigo-300/40 to-cyan-200/50',
    'bg-pink-100': 'from-pink-200/60 via-fuchsia-300/40 to-rose-200/50',
    'bg-yellow-100': 'from-amber-200/60 via-orange-300/40 to-yellow-200/50',
    'bg-green-100': 'from-emerald-200/60 via-teal-300/40 to-green-200/50',
    'bg-purple-100': 'from-purple-200/60 via-violet-300/40 to-indigo-200/50',
    'bg-rose-100': 'from-rose-200/60 via-pink-300/40 to-fuchsia-200/50',
  };

  // Behind-card glow color for light mode
  const lightBehindGlowMap = {
    'bg-blue-100': 'bg-blue-400/60',
    'bg-pink-100': 'bg-pink-400/60',
    'bg-yellow-100': 'bg-amber-400/60',
    'bg-green-100': 'bg-emerald-400/60',
    'bg-purple-100': 'bg-purple-400/60',
    'bg-rose-100': 'bg-rose-400/60',
  };

  const lightBehindLineMap = {
    'bg-blue-100': 'bg-blue-400',
    'bg-pink-100': 'bg-pink-400',
    'bg-yellow-100': 'bg-amber-400',
    'bg-green-100': 'bg-emerald-400',
    'bg-purple-100': 'bg-purple-400',
    'bg-rose-100': 'bg-rose-400',
  };

  const lightIconColorMap = {
    'bg-blue-100': 'text-blue-500',
    'bg-pink-100': 'text-pink-500',
    'bg-yellow-100': 'text-amber-500',
    'bg-green-100': 'text-emerald-500',
    'bg-purple-100': 'text-purple-500',
    'bg-rose-100': 'text-rose-500',
  };

  const glowColorStr = glowMap[color] || 'rgba(75, 85, 99, 0.15)';
  const bottomGlowColor = bottomGlowMap[color] || 'from-gray-600';
  const borderColor = borderGlowMap[color] || 'bg-gray-400';
  const innerGlow = innerGlowMap[color] || 'from-gray-500/40';
  const lightBehindGlow = lightBehindGlowMap[color] || 'bg-gray-400/60';
  const lightBehindLine = lightBehindLineMap[color] || 'bg-gray-400';
  const lightIconColor = lightIconColorMap[color] || 'text-gray-500';

  return (
    <div ref={cardRef} className="relative group cursor-pointer transition-all duration-300 hover:scale-[1.02]">
      {/* === LIGHT MODE: BEHIND-CARD GLOW === */}
      <div className={`absolute -inset-x-2 -bottom-4 top-[30%] rounded-[2rem] ${lightBehindGlow} blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500 dark:hidden pointer-events-none`} />
      <div className={`absolute bottom-0 left-[5%] right-[5%] h-[6px] rounded-full ${lightBehindLine} blur-[4px] opacity-70 group-hover:opacity-90 transition-opacity duration-500 dark:hidden pointer-events-none`} />

      {/* === DARK MODE: Proximity Glow === */}
      {mousePos && rect && (
        <div
          className="absolute inset-0 rounded-[2rem] pointer-events-none transition-opacity duration-300 opacity-60 group-hover:opacity-100 hidden dark:block"
          style={{
            background: `radial-gradient(800px circle at ${mousePos.x - rect.left}px ${mousePos.y - rect.top}px, ${glowColorStr}, transparent 40%)`
          }}
        />
      )}
      {/* === LIGHT MODE: Proximity Glow === */}
      {mousePos && rect && (
        <div
          className="absolute inset-0 rounded-[2rem] pointer-events-none transition-opacity duration-300 block dark:hidden z-[1]"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x - rect.left}px ${mousePos.y - rect.top}px, ${glowColorStr.replace('0.15', '0.08')}, transparent 40%)`
          }}
        />
      )}

      {/* === THE CARD (solid opaque surface) === */}
      <div
        className={`relative w-full h-[220px] rounded-[2rem] overflow-hidden flex flex-col
          border border-gray-200/80 dark:border-white/10
          bg-gradient-to-b from-white to-gray-50 dark:from-transparent dark:to-transparent
          dark:bg-[#0f0f0f]/80
          backdrop-blur-xl
          shadow-[0_2px_8px_rgba(0,0,0,0.06)]
          dark:shadow-none
          p-6`}
      >
        {/* Light Mode: Subtle top edge highlight */}
        <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-white to-transparent dark:hidden pointer-events-none" />

        {/* Dark Mode: Bottom glow haze */}
        <div className={`absolute -bottom-6 left-0 right-0 h-28 bg-gradient-to-t ${bottomGlowColor} to-transparent opacity-60 blur-2xl group-hover:opacity-90 transition-opacity duration-500 pointer-events-none hidden dark:block`} />
        {/* Dark Mode: Bottom border line */}
        <div className={`absolute bottom-0 left-[0%] right-[0%] h-[3px] ${borderColor} blur-[1px] opacity-80 group-hover:opacity-100 transition-all duration-500 pointer-events-none hidden dark:block`} />

        {/* Main card content */}
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex justify-between items-start mb-6">
            <div className={`relative w-12 h-12 rounded-2xl bg-gray-50 dark:bg-black border border-gray-200/60 dark:border-white/10 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_16px_rgba(0,0,0,0.6),0_0_20px_var(--tw-shadow-color)] dark:shadow-${borderColor}/20 overflow-hidden group/icon transition-all`}>
              {/* Dark Mode: Intense top edge light reflection */}
              <div className={`absolute top-0 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-0 dark:opacity-90 drop-shadow-[0_0_5px_var(--tw-shadow-color)] shadow-${borderColor}`} />
              {/* Dark Mode: Soft inner top gradient blur */}
              <div className={`absolute inset-0 bg-gradient-to-b ${innerGlow} via-transparent to-transparent opacity-0 dark:opacity-100 pointer-events-none blur-[2px]`} />
              <FiFolder className={`relative z-10 ${lightIconColor} dark:text-white drop-shadow-none dark:drop-shadow-[0_0_12px_var(--tw-shadow-color)] dark:shadow-${borderColor}`} size={22} />
            </div>
            <button className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-white transition-colors p-2 -mr-2 -mt-2">
              <FiMoreHorizontal size={20} />
            </button>
          </div>

          {/* Text Area */}
          <div className="mt-auto relative z-10">
            <h4 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white tracking-tight">{title}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Folder created {date}</p>
            <div className="text-gray-600 dark:text-white text-sm font-medium mt-4 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
              Open folder <span className="ml-1">→</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FolderCard;