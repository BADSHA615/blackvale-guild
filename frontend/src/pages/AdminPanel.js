import React, { useState, useEffect } from 'react';
import { screenshotService, squadService, settingsService } from '../services/api';
import { useTheme } from '../themes/ThemeContext';
import './AdminPanel.css';

function AdminPanel() {
  const { applyTheme, themes } = useTheme();
  const [activeTab, setActiveTab] = useState('screenshots');
  const [pendingScreenshots, setPendingScreenshots] = useState([]);
  const [pendingSquads, setPendingSquads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  const [selectedSquad, setSelectedSquad] = useState(null);
  const [comment, setComment] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  
  // Settings state
  const [settings, setSettings] = useState({
    websiteName: '',
    websiteLogo: '',
    description: '',
    theme: 'dark'
  });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState('');

  useEffect(() => {
    if (activeTab === 'screenshots') {
      fetchPendingScreenshots();
    } else if (activeTab === 'squads') {
      fetchPendingSquads();
    } else if (activeTab === 'settings') {
      fetchSettings();
    }
  }, [activeTab]);

  const fetchPendingScreenshots = async () => {
    try {
      setLoading(true);
      const response = await screenshotService.getPending();
      setPendingScreenshots(response.data);
    } catch (error) {
      console.error('Error fetching screenshots:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingSquads = async () => {
    try {
      setLoading(true);
      const response = await squadService.getPending();
      setPendingSquads(response.data);
    } catch (error) {
      console.error('Error fetching squads:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      setSettingsLoading(true);
      const response = await settingsService.getSettings();
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleThemeChange = (newTheme) => {
    setSettings({...settings, theme: newTheme});
    applyTheme(newTheme);
    setSettingsMessage('✓ Theme changed to ' + themes[newTheme].name);
    setTimeout(() => setSettingsMessage(''), 2000);
  };

  const handleLogoImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 1MB)
      if (file.size > 1024 * 1024) {
        setSettingsMessage('❌ Image must be smaller than 1MB');
        return;
      }
      
      // Check file type
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        setSettingsMessage('❌ Only JPG and PNG files are allowed');
        return;
      }

      // Convert to Base64
      const reader = new FileReader();
      reader.onload = (event) => {
        setSettings({...settings, websiteLogo: event.target.result});
        setSettingsMessage('✓ Image selected');
        setTimeout(() => setSettingsMessage(''), 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateSettings = async () => {
    try {
      setSettingsLoading(true);
      await settingsService.updateSettings(settings);
      setSettingsMessage('✅ Settings updated successfully!');
      setTimeout(() => setSettingsMessage(''), 3000);
    } catch (error) {
      setSettingsMessage('❌ Error updating settings');
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleApproveScreenshot = async () => {
    try {
      await screenshotService.approve(selectedScreenshot._id, { adminComment: comment });
      setComment('');
      setSelectedScreenshot(null);
      fetchPendingScreenshots();
    } catch (error) {
      console.error('Error approving screenshot:', error);
    }
  };

  const handleRejectScreenshot = async () => {
    try {
      await screenshotService.reject(selectedScreenshot._id, { adminComment: comment });
      setComment('');
      setSelectedScreenshot(null);
      fetchPendingScreenshots();
    } catch (error) {
      console.error('Error rejecting screenshot:', error);
    }
  };

  const toggleMember = (memberId) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleApproveSquad = async () => {
    try {
      await squadService.approve(selectedSquad._id, {
        adminComment: comment,
        selectedMembers
      });
      setComment('');
      setSelectedSquad(null);
      setSelectedMembers([]);
      fetchPendingSquads();
    } catch (error) {
      console.error('Error approving squad:', error);
    }
  };

  const handleRejectSquad = async () => {
    try {
      await squadService.reject(selectedSquad._id, { adminComment: comment });
      setComment('');
      setSelectedSquad(null);
      setSelectedMembers([]);
      fetchPendingSquads();
    } catch (error) {
      console.error('Error rejecting squad:', error);
    }
  };

  return (
    <div className="admin-panel">
      <div className="container">
        <h1>🔐 Admin Panel</h1>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'screenshots' ? 'active' : ''}`}
            onClick={() => setActiveTab('screenshots')}
          >
            Screenshots ({pendingScreenshots.length})
          </button>
          <button
            className={`tab ${activeTab === 'squads' ? 'active' : ''}`}
            onClick={() => setActiveTab('squads')}
          >
            Squads ({pendingSquads.length})
          </button>
          <button
            className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Settings
          </button>
        </div>

        <div className="admin-content">
          {loading && <div className="loading">Loading...</div>}

          {activeTab === 'screenshots' && !loading && (
            <div className="approval-section">
              {selectedScreenshot ? (
                <div className="approval-detail">
                  <button className="back-btn" onClick={() => setSelectedScreenshot(null)}>
                    ← Back
                  </button>
                  <h2>Review Screenshot</h2>
                  <div className="screenshot-review">
                    <div className="image-container">
                      <img src={selectedScreenshot.imageUrl} alt="review" />
                    </div>
                    <div className="review-info">
                      <p><strong>Player:</strong> {selectedScreenshot.player.username}</p>
                      <p><strong>Game ID:</strong> {selectedScreenshot.player.gameId}</p>
                      <p><strong>Kills:</strong> {selectedScreenshot.kills || 'N/A'}</p>
                      <p><strong>Headshots:</strong> {selectedScreenshot.headshots || 'N/A'}</p>
                      <p><strong>Damage:</strong> {selectedScreenshot.damageDealt || 'N/A'}</p>
                      {selectedScreenshot.description && (
                        <p><strong>Description:</strong> {selectedScreenshot.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="comment-section">
                    <label>Admin Comment</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment for the player..."
                      rows="4"
                    ></textarea>
                  </div>

                  <div className="button-group">
                    <button onClick={handleApproveScreenshot} className="approve-btn">
                      ✓ Approve
                    </button>
                    <button onClick={handleRejectScreenshot} className="reject-btn">
                      ✗ Reject
                    </button>
                  </div>
                </div>
              ) : (
                <div className="approval-list">
                  {pendingScreenshots.length === 0 ? (
                    <div className="no-data">No pending screenshots</div>
                  ) : (
                    pendingScreenshots.map(screenshot => (
                      <div key={screenshot._id} className="approval-item">
                        <div className="item-image">
                          <img src={screenshot.imageUrl} alt="thumbnail" />
                        </div>
                        <div className="item-info">
                          <h3>{screenshot.player.username}</h3>
                          <p className="game-id">{screenshot.player.gameId}</p>
                          {screenshot.kills && <p>💥 {screenshot.kills} kills</p>}
                          <p className="date">{new Date(screenshot.createdAt).toLocaleDateString()}</p>
                        </div>
                        <button
                          onClick={() => setSelectedScreenshot(screenshot)}
                          className="review-btn"
                        >
                          Review
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'squads' && !loading && (
            <div className="approval-section">
              {selectedSquad ? (
                <div className="approval-detail">
                  <button className="back-btn" onClick={() => setSelectedSquad(null)}>
                    ← Back
                  </button>
                  <h2>Review Squad: {selectedSquad.name}</h2>
                  
                  <div className="squad-review">
                    <p><strong>Leader:</strong> {selectedSquad.leader.username}</p>
                    <p><strong>Description:</strong> {selectedSquad.description || 'N/A'}</p>
                    <p><strong>Max Members:</strong> {selectedSquad.maxMembers}</p>
                  </div>

                  <h3>Select Members to Approve</h3>
                  <div className="members-selection">
                    {selectedSquad.leader && (
                      <div className="member-item leader">
                        <span>{selectedSquad.leader.username} (Leader)</span>
                      </div>
                    )}
                    {selectedSquad.members && selectedSquad.members.map(member => (
                      <label key={member._id} className="member-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(member._id)}
                          onChange={() => toggleMember(member._id)}
                        />
                        <span>{member.username} ({member.gameId})</span>
                      </label>
                    ))}
                  </div>

                  <div className="comment-section">
                    <label>Admin Comment</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment..."
                      rows="4"
                    ></textarea>
                  </div>

                  <div className="button-group">
                    <button onClick={handleApproveSquad} className="approve-btn">
                      ✓ Approve Squad
                    </button>
                    <button onClick={handleRejectSquad} className="reject-btn">
                      ✗ Reject Squad
                    </button>
                  </div>
                </div>
              ) : (
                <div className="approval-list">
                  {pendingSquads.length === 0 ? (
                    <div className="no-data">No pending squad requests</div>
                  ) : (
                    pendingSquads.map(squad => (
                      <div key={squad._id} className="squad-item">
                        <div className="squad-basic">
                          <h3>{squad.name}</h3>
                          <p className="leader">Leader: {squad.leader.username}</p>
                          <p className="description">{squad.description || 'No description'}</p>
                        </div>
                        <div className="squad-meta">
                          <span className="member-count">
                            {squad.members.length}/{squad.maxMembers} members
                          </span>
                          <button
                            onClick={() => setSelectedSquad(squad)}
                            className="review-btn"
                          >
                            Review
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && !loading && (
            <div className="approval-section">
              <h2>⚙️ Website Settings</h2>
              {settingsLoading ? (
                <div className="loading">Loading settings...</div>
              ) : (
                <form className="settings-form">
                  <div className="form-group">
                    <label>Website Name:</label>
                    <input 
                      type="text" 
                      value={settings.websiteName}
                      onChange={(e) => setSettings({...settings, websiteName: e.target.value})}
                      placeholder="Enter website name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Logo/Emoji or Image:</label>
                    <div className="logo-input-group">
                      <div className="logo-preview">
                        {settings.websiteLogo && settings.websiteLogo.startsWith('data:') ? (
                          <img src={settings.websiteLogo} alt="Logo preview" className="logo-image" />
                        ) : (
                          <span className="logo-emoji">{settings.websiteLogo || '⚔️'}</span>
                        )}
                      </div>
                      <div className="logo-input-controls">
                        <input 
                          type="file"
                          id="logo-upload"
                          accept="image/jpeg, image/jpg, image/png"
                          onChange={handleLogoImageChange}
                          style={{ display: 'none' }}
                        />
                        <button 
                          type="button"
                          onClick={() => document.getElementById('logo-upload').click()}
                          className="upload-btn"
                        >
                          📤 Upload Image (JPG/PNG)
                        </button>
                        <p className="help-text">or enter emoji below:</p>
                        <input 
                          type="text" 
                          value={settings.websiteLogo.startsWith('data:') ? '' : settings.websiteLogo}
                          onChange={(e) => setSettings({...settings, websiteLogo: e.target.value})}
                          placeholder="Enter emoji or text"
                          maxLength="10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Website Theme:</label>
                    <div className="theme-selector">
                      {Object.entries(themes).map(([key, theme]) => (
                        <button
                          key={key}
                          type="button"
                          className={`theme-option ${settings.theme === key ? 'active' : ''}`}
                          onClick={() => handleThemeChange(key)}
                          title={theme.description}
                        >
                          <div className="theme-preview" style={{
                            background: theme.primaryBg,
                            border: `2px solid ${theme.accentColor}`
                          }}></div>
                          <span className="theme-name">{theme.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Description:</label>
                    <textarea 
                      value={settings.description}
                      onChange={(e) => setSettings({...settings, description: e.target.value})}
                      placeholder="Enter website description"
                      rows="4"
                    ></textarea>
                  </div>

                  <div className="button-group">
                    <button 
                      type="button" 
                      onClick={handleUpdateSettings} 
                      disabled={settingsLoading}
                      className="approve-btn"
                    >
                      {settingsLoading ? '🔄 Updating...' : '✓ Update Settings'}
                    </button>
                  </div>

                  {settingsMessage && (
                    <div className={`message ${settingsMessage.includes('successfully') ? 'success' : 'error'}`}>
                      {settingsMessage}
                    </div>
                  )}
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
