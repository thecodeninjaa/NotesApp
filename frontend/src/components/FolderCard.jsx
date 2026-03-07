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

  const glowColorStr = glowMap[color] || 'rgba(75, 85, 99, 0.15)';
  const bottomGlowColor = bottomGlowMap[color] || 'from-gray-600';
  const borderColor = borderGlowMap[color] || 'bg-gray-400';

  return (
    <div
      ref={cardRef}
      className={`relative w-full h-[220px] rounded-[2rem] border border-white/10 bg-[#0f0f0f]/80 backdrop-blur-xl p-6 overflow-hidden flex flex-col group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_-5px_var(--tw-shadow-color)] shadow-${borderColor}`}
    >
      {/* Proximity Glow from mouse tracking */}
      {mousePos && rect && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-60 group-hover:opacity-100"
          style={{
            background: `radial-gradient(800px circle at ${mousePos.x - rect.left}px ${mousePos.y - rect.top}px, ${glowColorStr}, transparent 40%)`
          }}
        />
      )}

      {/* Heavy bottom inner glow haze */}
      <div className={`absolute -bottom-6 left-0 right-0 h-28 bg-gradient-to-t ${bottomGlowColor} to-transparent opacity-60 blur-2xl group-hover:opacity-90 transition-opacity duration-500 pointer-events-none`} />

      {/* Intense bright bottom border line */}
      <div className={`absolute bottom-0 left-[0%] right-[0%] h-[3px] ${borderColor} blur-[1px] opacity-80 group-hover:opacity-100 transition-all duration-500 pointer-events-none`} />

      {/* Main card content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Top Icon Area */}
        <div className="flex justify-between items-start mb-6">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
            <FiFolder className="text-gray-300" size={18} />
          </div>
          <button className="text-gray-500 hover:text-white transition-colors p-2 -mr-2 -mt-2">
            <FiMoreHorizontal size={20} />
          </button>
        </div>

        {/* Text Area */}
        <div className="mt-auto">
          <h4 className="text-xl font-semibold mb-2 text-white tracking-tight">{title}</h4>
          <p className="text-sm text-gray-400 mb-2">Folder created {date}</p>
          <div className="text-white text-sm font-medium mt-4 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            Open folder <span className="ml-1">→</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FolderCard;