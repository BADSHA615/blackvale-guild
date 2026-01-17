import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import PlayerProfile from './pages/PlayerProfile';
import ScreenshotSubmission from './pages/ScreenshotSubmission';
import SquadManagement from './pages/SquadManagement';
import Leaderboard from './pages/Leaderboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    setIsAuthenticated(!!token);
    setUserRole(role);
  }, []);

  const handleLogin = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role);
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    setUserRole(null);
  };

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} userRole={userRole} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register onLogin={handleLogin} />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile" element={isAuthenticated ? <PlayerProfile /> : <Navigate to="/login" />} />
        <Route path="/submit-screenshot" element={isAuthenticated ? <ScreenshotSubmission /> : <Navigate to="/login" />} />
        <Route path="/squad" element={isAuthenticated ? <SquadManagement /> : <Navigate to="/login" />} />
        <Route path="/admin" element={isAuthenticated && userRole === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
