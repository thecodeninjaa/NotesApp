import React from 'react';
import { FiFolder, FiFileText } from 'react-icons/fi';

const NewItemCard = ({ type, onClick }) => (
  <div
    onClick={onClick}
    className="p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 min-h-[120px] flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition cursor-pointer"
  >
    {type === 'folder' ? <FiFolder size={24} className="mb-2"/> : <FiFileText size={24} className="mb-2"/>}
    New {type === 'folder' ? 'Folder' : 'Note'}
  </div>
);

export default NewItemCard;
