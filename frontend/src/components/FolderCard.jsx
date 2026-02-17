import React from 'react';
import { FiFolder, FiMoreHorizontal } from 'react-icons/fi';

const FolderCard = ({ title, date, color }) => (
  <div className={`p-4 rounded-lg shadow ${color} min-h-[120px] flex flex-col justify-between`}>
    <div className="flex justify-between items-start">
      <FiFolder className="text-gray-700 opacity-80" size={20}/>
      <button className="text-gray-500 hover:text-gray-800">
        <FiMoreHorizontal />
      </button>
    </div>
    <div>
      <h4 className="font-semibold mb-1 text-gray-800">{title}</h4>
      <p className="text-xs text-gray-600">{date}</p>
    </div>
  </div>
);

export default FolderCard;
