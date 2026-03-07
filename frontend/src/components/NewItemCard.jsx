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

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className="relative w-full h-[220px] rounded-[2rem] border-2 border-dashed border-white/20 bg-[#0f0f0f]/50 backdrop-blur-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:text-white hover:border-white/40 hover:bg-[#1a1a1a]/80 transition-all duration-300 cursor-pointer group hover:scale-[1.02] overflow-hidden hover:shadow-[0_0_30px_-5px_var(--tw-shadow-color)] shadow-gray-400"
    >
      {/* Proximity Glow from mouse tracking */}
      {mousePos && rect && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-60 group-hover:opacity-100"
          style={{
            background: `radial - gradient(800px circle at ${mousePos.x - rect.left}px ${mousePos.y - rect.top}px, rgba(107, 114, 128, 0.15), transparent 40 %)`
          }}
        />
      )}

      {/* Heavy bottom inner glow haze (using neutral/white glow for new items) */}
      <div className="absolute -bottom-6 left-0 right-0 h-28 bg-gradient-to-t from-gray-500 to-transparent opacity-0 blur-2xl group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" />

      {/* Intense bright bottom border line */}
      <div className="absolute bottom-0 left-[0%] right-[0%] h-[3px] bg-gray-300 blur-[1px] opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner mb-4 group-hover:bg-white/10 transition-colors">
          {type === 'folder' ? <FiFolder size={24} /> : <FiFileText size={24} />}
        </div>
        <span className="font-medium text-lg">New {type === 'folder' ? 'Folder' : 'Note'}</span>
      </div>
    </div>
  );
};

export default NewItemCard;
