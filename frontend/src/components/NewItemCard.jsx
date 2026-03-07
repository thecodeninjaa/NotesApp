import React, { useState, useEffect, useRef } from 'react';
import { FiFolder, FiFileText } from 'react-icons/fi';

const NewItemCard = ({ type, onClick, mousePos }) => {
  const [rect, setRect] = useState(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      setRect(cardRef.current.getBoundingClientRect());
    }
  }, []);

  const isFolder = type === 'folder';

  return (
    <div ref={cardRef} className="relative group cursor-pointer transition-all duration-300 hover:scale-[1.02]">
      {/* === LIGHT MODE: Subtle behind-card glow === */}
      <div className="absolute -inset-x-2 -bottom-4 top-[30%] rounded-[2rem] bg-gray-400/30 blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 dark:hidden pointer-events-none" />
      <div className="absolute bottom-0 left-[5%] right-[5%] h-[6px] rounded-full bg-gray-400 blur-[4px] opacity-0 group-hover:opacity-50 transition-opacity duration-500 dark:hidden pointer-events-none" />

      {/* === THE CARD === */}
      <div
        onClick={onClick}
        className={`relative w-full ${isFolder ? 'h-[60px] rounded-xl px-4' : 'h-[220px] rounded-[2rem] p-6'} overflow-hidden flex flex-col items-center justify-center
          border-2 border-dashed border-gray-200/80 dark:border-white/20
          bg-gradient-to-b from-white to-gray-50 dark:from-transparent dark:to-transparent
          dark:bg-[#0f0f0f]/50
          backdrop-blur-xl
          shadow-[0_2px_8px_rgba(0,0,0,0.04)]
          dark:shadow-none
          hover:border-gray-300 dark:hover:border-white/40
          dark:hover:bg-[#1a1a1a]/80
          transition-all duration-300`}
      >
        {/* Light Mode: Subtle top edge highlight */}
        <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-white to-transparent dark:hidden pointer-events-none" />

        {/* Dark Mode: Bottom glow haze */}
        <div className="absolute -bottom-6 left-0 right-0 h-28 bg-gradient-to-t from-gray-500 to-transparent opacity-0 blur-2xl group-hover:opacity-40 transition-opacity duration-500 pointer-events-none hidden dark:block" />
        {/* Dark Mode: Bottom border line */}
        <div className="absolute bottom-0 left-[0%] right-[0%] h-[3px] bg-gray-300 blur-[1px] opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none hidden dark:block" />

        <div className={`relative z-10 flex ${isFolder ? 'flex-row items-center gap-3' : 'flex-col items-center justify-center'}`}>
          <div className={`${isFolder ? 'w-9 h-9 rounded-lg' : 'w-12 h-12 mb-4 rounded-xl'} bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 flex items-center justify-center shadow-inner group-hover:bg-gray-100 dark:group-hover:bg-white/10 transition-colors`}>
            {isFolder ? <FiFolder size={16} className="text-gray-400" /> : <FiFileText size={24} className="text-gray-400" />}
          </div>
          <span className={`font-medium ${isFolder ? 'text-sm' : 'text-lg'} text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-white transition-colors`}>New {isFolder ? 'Folder' : 'Note'}</span>
        </div>
      </div>
    </div>
  );
};

export default NewItemCard;
