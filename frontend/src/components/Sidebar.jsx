import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiPlus, FiCalendar, FiArchive, FiTrash2, FiSun, FiMoon,
  FiChevronsLeft, FiChevronsRight // Icons for toggle
} from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const SidebarGlowItem = ({ mousePos, children, className, as: Component = 'button', to, onClick, 'aria-label': ariaLabel }) => {
  const [rect, setRect] = useState(null);
  const itemRef = useRef(null);

  const handleMouseEnter = () => {
    if (itemRef.current) {
      setRect(itemRef.current.getBoundingClientRect());
    }
  };

  return (
    <Component
      ref={itemRef}
      to={to}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      aria-label={ariaLabel}
      className={className}
    >
      {/* Proximity Glow */}
      {mousePos && rect && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0 hidden dark:block"
          style={{
            background: `radial-gradient(120px circle at ${mousePos.x - rect.left}px ${mousePos.y - rect.top}px, rgba(255, 255, 255, 0.1), transparent 40%)`
          }}
        />
      )}
      {children}
    </Component>
  );
};

// Accept props for state and toggle function
function Sidebar({ isCollapsed, toggleSidebar, mousePos }) {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    // Apply dynamic width and padding based on collapsed state. Glassmorphic base.
    <div
      className={`bg-transparent flex flex-col transition-all duration-300 ease-in-out relative ${isCollapsed ? 'w-20 p-3' : 'w-64 p-6'}`}
    >
      {/* Light Mode Border */}
      <div className="dark:hidden absolute right-0 top-0 bottom-0 w-px bg-orange-200 pointer-events-none" />

      {/* Dark Mode Glowing Right Border Streak */}
      <div className="hidden dark:block absolute right-[0px] top-[10%] bottom-[10%] w-[2px] bg-gradient-to-b from-transparent via-white/50 to-transparent blur-[1px] opacity-80 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] pointer-events-none" />
      <div className="hidden dark:block absolute right-0 top-[5%] bottom-[5%] w-[1px] bg-gradient-to-b from-transparent via-white/80 to-transparent pointer-events-none" />

      {/* Toggle Button - Positioned absolutely */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-9 z-[60] p-1 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-white/20 rounded-full shadow-[0_0_15px_-3px_rgba(255,255,255,0.1)] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <FiChevronsRight size={18} /> : <FiChevronsLeft size={18} />}
      </button>

      {/* Logo */}
      <div className={`text-2xl font-bold mb-6 transition-all text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-400 dark:from-amber-400 dark:to-orange-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] ${isCollapsed ? 'text-center text-xl' : ''}`}>
        {isCollapsed ? 'N' : 'NoteFlow'}
      </div>

      {/* Add New Button - Vibrant Orange Glow */}
      <SidebarGlowItem
        as="button"
        mousePos={mousePos}
        className={`relative overflow-hidden group w-full flex items-center justify-center bg-orange-500 dark:bg-white/5 border border-transparent dark:border-white/10 text-white py-2.5 px-4 rounded-xl shadow-[0_0_15px_-3px_rgba(249,115,22,0.4)] dark:shadow-[0_0_20px_-5px_rgba(249,115,22,0.5)] transition-all mb-6 ${isCollapsed ? 'px-2' : ''} hover:scale-[1.02] dark:hover:border-orange-500/50`}
      >
        {/* Glow Haze */}
        <div className="absolute -bottom-6 left-0 right-0 h-16 bg-gradient-to-t from-orange-500 to-transparent opacity-0 blur-xl group-hover:opacity-80 transition-opacity duration-500 pointer-events-none" />
        {/* Glow Line */}
        <div className="absolute bottom-0 left-[0%] right-[0%] h-[2px] bg-orange-400 blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <FiPlus className={`relative z-10 ${!isCollapsed ? 'mr-2' : ''}`} />
        {!isCollapsed && <span className="relative z-10 font-semibold tracking-wide">Add new</span>}
      </SidebarGlowItem>

      {/* Navigation Links */}
      <nav className="grow">
        <ul className="space-y-3">
          <li>
            <SidebarGlowItem
              as={Link}
              to="/calendar"
              mousePos={mousePos}
              className={`relative overflow-hidden group flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white dark:hover:bg-[#1a1a1a]/80 p-3 rounded-xl transition-all border border-transparent dark:hover:border-white/10 ${isCollapsed ? 'justify-center' : ''} ${isActive('/calendar') ? 'dark:bg-white/5 dark:border-white/10 dark:text-white' : ''}`}
            >
              {/* Electric Blue Glow */}
              <div className="absolute -bottom-6 left-0 right-0 h-16 bg-gradient-to-t from-blue-500 to-transparent opacity-0 blur-xl group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" />
              <div className="absolute bottom-0 left-[0%] right-[0%] h-[2px] bg-blue-400 blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <FiCalendar className={`relative z-10 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] ${!isCollapsed ? 'mr-3' : ''}`} />
              {!isCollapsed && <span className="relative z-10 font-medium">Calendar</span>}
            </SidebarGlowItem>
          </li>
          <li>
            <SidebarGlowItem
              as={Link}
              to="/archive"
              mousePos={mousePos}
              className={`relative overflow-hidden group flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white dark:hover:bg-[#1a1a1a]/80 p-3 rounded-xl transition-all border border-transparent dark:hover:border-white/10 ${isCollapsed ? 'justify-center' : ''} ${isActive('/archive') ? 'dark:bg-white/5 dark:border-white/10 dark:text-white' : ''}`}
            >
              {/* Deep Purple Glow */}
              <div className="absolute -bottom-6 left-0 right-0 h-16 bg-gradient-to-t from-purple-500 to-transparent opacity-0 blur-xl group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" />
              <div className="absolute bottom-0 left-[0%] right-[0%] h-[2px] bg-purple-400 blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <FiArchive className={`relative z-10 group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)] ${!isCollapsed ? 'mr-3' : ''}`} />
              {!isCollapsed && <span className="relative z-10 font-medium">Archive</span>}
            </SidebarGlowItem>
          </li>
          <li>
            <SidebarGlowItem
              as={Link}
              to="/trash"
              mousePos={mousePos}
              className={`relative overflow-hidden group flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white dark:hover:bg-[#1a1a1a]/80 p-3 rounded-xl transition-all border border-transparent dark:hover:border-white/10 ${isCollapsed ? 'justify-center' : ''} ${isActive('/trash') ? 'dark:bg-white/5 dark:border-white/10 dark:text-white' : ''}`}
            >
              {/* Crimson Rose Glow */}
              <div className="absolute -bottom-6 left-0 right-0 h-16 bg-gradient-to-t from-rose-500 to-transparent opacity-0 blur-xl group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" />
              <div className="absolute bottom-0 left-[0%] right-[0%] h-[2px] bg-rose-400 blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <FiTrash2 className={`relative z-10 group-hover:drop-shadow-[0_0_8px_rgba(244,63,94,0.8)] ${!isCollapsed ? 'mr-3' : ''}`} />
              {!isCollapsed && <span className="relative z-10 font-medium">Trash</span>}
            </SidebarGlowItem>
          </li>
        </ul>
      </nav>

      {/* Theme Toggle - Subtle Neutral/Yellow-Blue Glow */}
      <div className="mt-auto">
        <SidebarGlowItem
          as="button"
          onClick={toggleTheme}
          mousePos={mousePos}
          className={`relative overflow-hidden group w-full flex items-center justify-center p-3 rounded-xl transition-all border border-transparent dark:hover:border-white/10 text-gray-600 dark:bg-white/5 dark:text-gray-300 dark:hover:text-white ${isCollapsed ? 'px-2' : ''}`}
        >
          {/* Theme Dynamic Glow */}
          <div className={`absolute -bottom-6 left-0 right-0 h-16 bg-gradient-to-t ${isDark ? 'from-amber-500' : 'from-blue-400'} to-transparent opacity-0 blur-xl group-hover:opacity-30 transition-opacity duration-500 pointer-events-none`} />
          <div className={`absolute bottom-0 left-[0%] right-[0%] h-[2px] ${isDark ? 'bg-amber-400' : 'bg-blue-300'} blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

          {isDark ?
            <FiSun className={`relative z-10 group-hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] text-amber-400 ${!isCollapsed ? 'mr-2' : ''}`} /> :
            <FiMoon className={`relative z-10 group-hover:drop-shadow-[0_0_8px_rgba(96,165,250,0.8)] text-blue-400 ${!isCollapsed ? 'mr-2' : ''}`} />
          }
          {!isCollapsed && (
            <span className="relative z-10 font-medium">{isDark ? 'Light mode' : 'Dark mode'}</span>
          )}
        </SidebarGlowItem>
      </div>

      {/* Upgrade Section - Emerald Glow */}
      {!isCollapsed && (
        <div className="relative overflow-hidden group mt-4 p-5 bg-orange-100 dark:bg-white/5 border border-transparent dark:border-white/10 rounded-[1.5rem] text-center transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)] dark:hover:border-emerald-500/30">
          <div className="absolute -bottom-4 left-0 right-0 h-20 bg-gradient-to-t from-emerald-500 to-transparent opacity-0 blur-2xl group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" />
          <div className="absolute bottom-0 left-[0%] right-[0%] h-[2px] bg-emerald-400 blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div className="relative z-10 text-sm font-medium text-gray-600 dark:text-gray-300 mb-3">Want unlimited notes?</div>
          <div className="relative z-10 w-20 h-20 bg-white/10 border border-white/20 mx-auto mb-4 rounded-full flex items-center justify-center shadow-inner group-hover:bg-white/20 transition-colors">
            <span className="text-xl">🚀</span>
          </div>
          <button className="relative z-10 w-full bg-emerald-500 text-white font-semibold py-2.5 px-4 rounded-xl shadow-[0_0_15px_-3px_rgba(16,185,129,0.4)] hover:bg-emerald-400 transition-colors text-sm tracking-wide">
            Upgrade Pro
          </button>
        </div>
      )}

    </div>
  );
}

export default Sidebar; 