import React, { useState, useEffect } from 'react';
import { authService, screenshotService } from '../services/api';
import './PlayerProfile.css';

function PlayerProfile() {
  const [user, setUser] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const userResponse = await authService.getProfile();
      setUser(userResponse.data);
      setFormData(userResponse.data);
      
      const screenshotsResponse = await screenshotService.getUserScreenshots(userResponse.data._id);
      setScreenshots(screenshotsResponse.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const updateData = {
        username: formData.username,
        gameId: formData.gameId,
        kills: parseInt(formData.kills) || 0,
        deaths: parseInt(formData.deaths) || 0,
        wins: parseInt(formData.wins) || 0,
        matches: parseInt(formData.matches) || 0
      };
      await authService.updateProfile(updateData);
      setUser(formData);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) return <div className="loading">Loading profile...</div>;

  return (
    <div className="player-profile">
      <div className="container">
        {user && (
          <>
            <div className="profile-card">
              <div className="profile-header">
                <h1>{user.username}</h1>
                <span className={`role-badge ${user.role}`}>{user.role.toUpperCase()}</span>
              </div>

              <div className="profile-content">
                {editMode ? (
                  <div className="edit-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Username</label>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Game ID</label>
                        <input
                          type="text"
                          name="gameId"
                          value={formData.gameId}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Kills</label>
                        <input
                          type="number"
                          name="kills"
                          value={formData.kills || 0}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Deaths</label>
                        <input
                          type="number"
                          name="deaths"
                          value={formData.deaths || 0}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Wins</label>
                        <input
                          type="number"
                          name="wins"
                          value={formData.wins || 0}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Matches</label>
                        <input
                          type="number"
                          name="matches"
                          value={formData.matches || 0}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="button-group">
                      <button onClick={handleSave} className="save-btn">Save Changes</button>
                      <button onClick={() => setEditMode(false)} className="cancel-btn">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="profile-info">
                    <div className="info-row">
                      <span className="label">Game ID:</span>
                      <span className="value">{user.gameId}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Email:</span>
                      <span className="value">{user.email}</span>
                    </div>
                    
                    <h3>Statistics</h3>
                    <div className="stats-grid">
                      <div className="stat">
                        <div className="stat-value">{user.kills || 0}</div>
                        <div className="stat-label">Total Kills</div>
                      </div>
                      <div className="stat">
                        <div className="stat-value">{user.deaths || 0}</div>
                        <div className="stat-label">Deaths</div>
                      </div>
                      <div className="stat">
                        <div className="stat-value">{user.wins || 0}</div>
                        <div className="stat-label">Wins</div>
                      </div>
                      <div className="stat">
                        <div className="stat-value">{user.matches || 0}</div>
                        <div className="stat-label">Matches</div>
                      </div>
                    </div>

                    {user.weeklyScore && (
                      <div className="weekly-score">
                        <h3>Weekly Score: <span className="highlight">{user.weeklyScore}</span></h3>
                      </div>
                    )}

                    <button onClick={() => setEditMode(true)} className="edit-btn">Edit Profile</button>
                  </div>
                )}
              </div>
            </div>

            <div className="screenshots-section">
              <h2>Your Submitted Screenshots</h2>
              {screenshots.length === 0 ? (
                <p className="no-data">No screenshots submitted yet</p>
              ) : (
                <div className="screenshots-list">
                  {screenshots.map(screenshot => (
                    <div key={screenshot._id} className="screenshot-item">
                      <div className="thumbnail">
                        <img src={screenshot.imageUrl} alt="screenshot" />
                      </div>
                      <div className="screenshot-details">
                        <div className="status-badge" data-status={screenshot.status}>
                          {screenshot.status.toUpperCase()}
                        </div>
                        {screenshot.adminComment && (
                          <p className="admin-comment">Admin: {screenshot.adminComment}</p>
                        )}
                        <p className="date">{new Date(screenshot.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PlayerProfile;
