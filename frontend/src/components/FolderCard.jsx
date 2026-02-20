import React from 'react';
import { FiFolder, FiMoreHorizontal } from 'react-icons/fi';

const FolderCard = ({ title, date, color }) => {
  // Map light colors to darker versions for dark mode
  const darkColorMap = {
    'bg-blue-100': 'dark:bg-blue-900/30',
    'bg-pink-100': 'dark:bg-pink-900/30',
    'bg-yellow-100': 'dark:bg-yellow-900/30',
    'bg-green-100': 'dark:bg-green-900/30',
    'bg-purple-100': 'dark:bg-purple-900/30',
    'bg-rose-100': 'dark:bg-rose-900/30',
  };

  const darkColor = darkColorMap[color] || 'dark:bg-gray-800';

  return (
    <div className={`p-4 rounded-lg shadow ${color} ${darkColor} min-h-[120px] flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] cursor-pointer`}>
      <div className="flex justify-between items-start">
        <FiFolder className="text-gray-700 dark:text-gray-300 opacity-80" size={20}/>
        <button className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
          <FiMoreHorizontal />
        </button>
      </div>
      <div>
        <h4 className="font-semibold mb-1 text-gray-800 dark:text-gray-200">{title}</h4>
        <p className="text-xs text-gray-600 dark:text-gray-400">{date}</p>
      </div>
    </div>
  );
};

export default FolderCard;