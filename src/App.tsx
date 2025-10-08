import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { BoardPage } from './pages/BoardPage';
import { IssueDetailPage } from './pages/IssueDetailPage';
import { SettingsPage } from './pages/SettingsPage';
import { Navigation } from './components/Navigation';
import { useThemeStore } from './store/themeStore';
import 'react-toastify/dist/ReactToastify.css';

export const App = () => {
  const { isDarkMode, setTheme } = useThemeStore();

  useEffect(() => {
    // Initialize theme on app load
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = stored === 'dark' || (!stored && prefersDark);
    
    setTheme(shouldBeDark);
  }, [setTheme]);

  return (
      <Router>
        <Navigation />
        <Routes>
          <Route path="/board" element={<BoardPage />} />
          <Route path="/issue/:id" element={<IssueDetailPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/board" />} />
        </Routes>
        <ToastContainer 
          position="bottom-right" 
          theme={isDarkMode ? 'dark' : 'light'}
        />
      </Router>
  );
}