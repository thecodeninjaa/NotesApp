import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiPlus, FiCalendar, FiArchive, FiTrash2, FiSun, FiMoon, 
  FiChevronsLeft, FiChevronsRight // Icons for toggle
} from 'react-icons/fi';

// Accept props for state and toggle function
function Sidebar({ isCollapsed, toggleSidebar }) {

  return (
    // Apply dynamic width and padding based on collapsed state
    <div 
      className={`bg-white flex flex-col border-r border-gray-200 transition-all duration-300 ease-in-out relative ${isCollapsed ? 'w-20 p-3' : 'w-64 p-6'}`}
    >
      {/* Toggle Button - Positioned absolutely */}
      <button 
        onClick={toggleSidebar} 
        className="absolute -right-3 top-9 z-10 p-1 bg-white border border-gray-300 rounded-full shadow-md text-gray-600 hover:bg-gray-100 transition"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <FiChevronsRight size={18}/> : <FiChevronsLeft size={18}/>}
      </button>
      
      {/* Logo - Adjust size/visibility */}
      <div className={`text-2xl font-bold text-blue-600 mb-6 ${isCollapsed ? 'text-center text-xl' : ''}`}>
        {isCollapsed ? 'M' : 'MINO'}
      </div>

      {/* Add New Button - Show icon only when collapsed */}
      <button className={`w-full flex items-center justify-center bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition mb-6 ${isCollapsed ? 'px-2' : ''}`}>
        <FiPlus className={`${!isCollapsed ? 'mr-2' : ''}`} />
        {!isCollapsed && 'Add new'}
      </button>

      {/* Color Dots - Hide when collapsed */}
      {!isCollapsed && (
        <div className="flex space-x-2 mb-6">
          <span className="w-4 h-4 bg-red-400 rounded-full"></span>
          <span className="w-4 h-4 bg-blue-400 rounded-full"></span>
          <span className="w-4 h-4 bg-green-400 rounded-full"></span>
        </div>
      )}

      {/* Navigation Links - Adjust padding and hide text when collapsed */}
      <nav className="flex-grow">
        <ul className="space-y-2">
          <li>
            <Link to="/calendar" className={`flex items-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded ${isCollapsed ? 'justify-center' : ''}`}>
              <FiCalendar className={`${!isCollapsed ? 'mr-3' : ''}`} /> {!isCollapsed && 'Calendar'}
            </Link>
          </li>
          <li>
            <Link to="/archive" className={`flex items-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded ${isCollapsed ? 'justify-center' : ''}`}>
              <FiArchive className={`${!isCollapsed ? 'mr-3' : ''}`} /> {!isCollapsed && 'Archive'}
            </Link>
          </li>
          <li>
            <Link to="/trash" className={`flex items-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded ${isCollapsed ? 'justify-center' : ''}`}>
              <FiTrash2 className={`${!isCollapsed ? 'mr-3' : ''}`} /> {!isCollapsed && 'Trash'}
            </Link>
          </li>
        </ul>
      </nav>

      {/* Upgrade Section - Hide when collapsed */}
      {!isCollapsed && (
        <div className="mt-auto p-4 bg-gray-50 rounded-lg text-center">
          <div className="text-sm text-gray-600 mb-2">Want unlimited notes?</div>
          <div className="w-20 h-20 bg-gray-300 mx-auto mb-3 rounded-full"></div>
          <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition text-sm">
            Upgrade Pro
          </button>
        </div>
      )}

    </div>
  );
}

export default Sidebar; 