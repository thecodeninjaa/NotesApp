import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import { supabase } from './supabaseClient';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { ThemeProvider } from './context/ThemeContext';
import NotesPage from './pages/NotesPage';
import Sidebar from './components/Sidebar';

function App() {
  const [session, setSession] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mousePos, setMousePos] = useState(null); // Hoisted mouse pos state

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const isLoggedIn = !!session;

  return (
    <ThemeProvider>
      <Router>
        <div
          onMouseMove={handleMouseMove}
          className="flex w-full h-screen bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:via-black dark:to-gray-900 transition-all duration-300 ease-in-out"
        >
          {isLoggedIn && (
            <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} mousePos={mousePos} />
          )}
          <div className="flex-1 flex flex-col overflow-hidden w-full">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/" element={isLoggedIn ? <NotesPage session={session} mousePos={mousePos} /> : <LoginPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
