import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RoleSwitcher } from '../RoleSwitcher';
import { ThemeToggle } from '../ThemeToggle';
import './Navigation.css';

export const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav className="navigation">
      <div className="navigation-links">
        <Link to="/board" className="navigation-brand">
          🚀 Issue Tracker
        </Link>
        <Link 
          to="/board" 
          className={`navigation-link ${location.pathname === '/board' ? 'active' : ''}`}
        >
          Board
        </Link>
        <Link 
          to="/settings" 
          className={`navigation-link ${location.pathname === '/settings' ? 'active' : ''}`}
        >
          Settings
        </Link>
      </div>
      <div className="navigation-controls">
        <ThemeToggle />
        <RoleSwitcher />
      </div>
    </nav>
  );
};