import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { settingsService } from '../services/api';
import './Navbar.css';

function Navbar({ isAuthenticated, userRole, onLogout }) {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    websiteLogo: '⚔️',
    websiteName: 'BlackVale Guild'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await settingsService.getSettings();
        setSettings(response.data);
      } catch (error) {
        console.log('Using default settings');
      }
    };
    fetchSettings();
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const renderLogo = () => {
    if (settings.websiteLogo && settings.websiteLogo.startsWith('data:')) {
      // It's an image - show as img tag
      return (
        <img 
          src={settings.websiteLogo} 
          alt="Logo" 
          style={{ height: '40px', marginRight: '10px', objectFit: 'contain' }}
        />
      );
    }
    // It's text/emoji
    return settings.websiteLogo || '⚔️';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center' }}>
          {renderLogo()} {settings.websiteName}
        </Link>
        <ul className="nav-menu">
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/leaderboard">Leaderboard</Link></li>
          
          {isAuthenticated && (
            <>
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/submit-screenshot">Upload Screenshot</Link></li>
              <li><Link to="/squad">Squad</Link></li>
              {userRole === 'admin' && (
                <li><Link to="/admin" className="admin-link">Admin Panel</Link></li>
              )}
              <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
            </>
          )}
          
          {!isAuthenticated && (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
