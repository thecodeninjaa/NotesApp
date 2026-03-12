import React from 'react';

const LoadingSkeleton = ({ count = 4, type = 'note' }) => {
  if (type === 'folder') {
    return (
      <>
        {[...Array(count)].map((_, i) => (
          <div key={`folder-skeleton-${i}`} className="w-full h-[60px] rounded-xl bg-gray-200 dark:bg-[#1a1a1a] animate-pulse border border-gray-100 dark:border-white/5 flex items-center px-4">
             <div className="w-9 h-9 rounded-lg bg-gray-300 dark:bg-[#2a2a2a] mr-3"></div>
             <div className="h-4 bg-gray-300 dark:bg-[#2a2a2a] rounded w-1/2"></div>
          </div>
        ))}
      </>
    );
  }

  // Note type skeleton
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div key={`note-skeleton-${i}`} className="w-full h-[220px] rounded-[2rem] bg-gray-200 dark:bg-[#1a1a1a] animate-pulse border border-gray-100 dark:border-white/5 p-6 flex flex-col">
          <div className="flex justify-between items-start mb-4">
             <div className="w-12 h-12 rounded-2xl bg-gray-300 dark:bg-[#2a2a2a]"></div>
             <div className="flex gap-1">
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-[#2a2a2a]"></div>
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-[#2a2a2a]"></div>
             </div>
          </div>
          <div className="mt-auto">
             <div className="h-5 bg-gray-300 dark:bg-[#2a2a2a] rounded w-3/4 mb-4"></div>
             <div className="h-3 bg-gray-300 dark:bg-[#2a2a2a] rounded w-full mb-2"></div>
             <div className="h-3 bg-gray-300 dark:bg-[#2a2a2a] rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export default LoadingSkeleton;
