import React, { useState, useEffect } from 'react';
import { screenshotService } from '../services/api';
import './Dashboard.css';

function Dashboard() {
  const [screenshots, setScreenshots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovedScreenshots();
  }, []);

  const fetchApprovedScreenshots = async () => {
    try {
      const response = await screenshotService.getApproved();
      setScreenshots(response.data);
    } catch (error) {
      console.error('Error fetching screenshots:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-hero">
          <h1>⚔️ BlackVale Guild Dashboard</h1>
          <p>Showcase your Free Fire performance and dominate the leaderboard</p>
        </div>

        <section className="screenshots-section">
          <h2>Recent Player Performances</h2>
          
          {loading && <div className="loading">Loading screenshots...</div>}

          {!loading && screenshots.length === 0 && (
            <div className="no-data">No approved screenshots yet</div>
          )}

          <div className="screenshots-grid">
            {screenshots.map((screenshot) => (
              <div key={screenshot._id} className="screenshot-card">
                <div className="screenshot-image">
                  <img src={screenshot.imageUrl} alt="gameplay" />
                </div>
                <div className="screenshot-info">
                  <h3>{screenshot.player.username}</h3>
                  <p className="game-id">ID: {screenshot.player.gameId}</p>
                  <div className="stats">
                    {screenshot.kills && <span>🎯 Kills: {screenshot.kills}</span>}
                    {screenshot.headshots && <span>💥 Headshots: {screenshot.headshots}</span>}
                    {screenshot.damageDealt && <span>⚡ Damage: {screenshot.damageDealt}</span>}
                  </div>
                  {screenshot.description && (
                    <p className="description">{screenshot.description}</p>
                  )}
                  <p className="timestamp">
                    {new Date(screenshot.approvedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
