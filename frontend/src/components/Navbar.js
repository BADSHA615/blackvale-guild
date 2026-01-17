import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ isAuthenticated, userRole, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          ⚔️ BlackVale Guild
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
