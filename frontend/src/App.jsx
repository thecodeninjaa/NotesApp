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

  const isLoggedIn = !!session;

  return (
    <ThemeProvider>
      <Router>
        <div className="flex w-full h-screen bg-gray-100 dark:bg-gray-900 transition-all duration-300 ease-in-out">
          {isLoggedIn && (
            <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
          )}
          <div className="flex-1 flex flex-col overflow-hidden w-full">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/" element={isLoggedIn ? <NotesPage session={session} /> : <LoginPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
