import React, { useState, useEffect, useCallback } from 'react';
import { squadService, authService } from '../services/api';
import './SquadManagement.css';

function SquadManagement() {
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole');

  // Admin state
  const [adminView, setAdminView] = useState('overview');
  const [allSquads, setAllSquads] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedSquad, setSelectedSquad] = useState(null);
  const [squadAnalytics, setSquadAnalytics] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // User state
  const [squad, setSquad] = useState(null);
  const [createMode, setCreateMode] = useState(false);
  const [manageMode, setManageMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    maxMembers: 4
  });
  const [allUsers, setAllUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Admin: Fetch Dashboard
  const fetchAdminDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes] = await Promise.all([
        squadService.getSquadStats(),
        authService.getAllUsers()
      ]);
      setStats(statsRes.data);
      setAllUsers(usersRes.data);
    } catch (err) {
      setError('Error loading squad dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  // Admin: Fetch All Squads
  const fetchAllSquads = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (searchTerm) params.search = searchTerm;
      
      const response = await squadService.getAllSquads(params);
      setAllSquads(response.data.squads);
    } catch (err) {
      setError('Error fetching squads');
    } finally {
      setLoading(false);
    }
  }, [filterStatus, searchTerm]);

  // Admin: Fetch Squad Analytics
  const fetchSquadAnalytics = async (squadId) => {
    try {
      setLoading(true);
      const response = await squadService.getSquadAnalytics(squadId);
      setSquadAnalytics(response.data);
      setSelectedSquad(squadId);
      setAdminView('analytics');
    } catch (err) {
      setError('Error fetching analytics');
    } finally {
      setLoading(false);
    }
  };

  // Admin: Kick Member
  const handleAdminKickMember = async (squadId, userId) => {
    if (!window.confirm('Are you sure you want to kick this member?')) return;
    
    try {
      setError('');
      setSuccess('');
      await squadService.adminKickMember(squadId, { userId, reason: 'Admin removal' });
      setSuccess('Member kicked successfully');
      await fetchSquadAnalytics(squadId);
    } catch (err) {
      setError(err.response?.data?.message || 'Error kicking member');
    }
  };

  // Admin: Add Member
  const handleAdminAddMember = async (squadId) => {
    const userId = window.prompt('Enter user ID:');
    if (!userId) return;

    try {
      setError('');
      setSuccess('');
      await squadService.adminAddMember(squadId, { userId });
      setSuccess('Member added successfully');
      await fetchSquadAnalytics(squadId);
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding member');
    }
  };

  // Admin: Delete Squad
  const handleAdminDeleteSquad = async (squadId, squadName) => {
    if (!window.confirm(`Delete squad "${squadName}"? This cannot be undone!`)) return;

    const reason = window.prompt('Reason for deletion:');
    
    try {
      setError('');
      setSuccess('');
      await squadService.adminDeleteSquad(squadId, { reason });
      setSuccess('Squad deleted successfully');
      setSelectedSquad(null);
      await fetchAllSquads();
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting squad');
    }
  };

  // User: Fetch Squad
  const fetchSquad = useCallback(async () => {
    try {
      const response = await squadService.getUserSquad(userId);
      setSquad(response.data);
    } catch (error) {
      console.log('No squad found');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // User: Fetch All Users
  const fetchAllUsersForUser = useCallback(async () => {
    try {
      const response = await authService.getAllUsers();
      setAllUsers(response.data.filter(u => u._id !== userId));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, [userId]);

  useEffect(() => {
    if (userRole === 'admin') {
      fetchAdminDashboard();
    } else {
      fetchSquad();
      fetchAllUsersForUser();
    }
  }, [userRole, fetchAdminDashboard, fetchSquad, fetchAllUsersForUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleMember = (userId) => {
    setSelectedMembers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateSquad = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (!formData.name.trim()) {
        setError('Squad name is required');
        return;
      }

      await squadService.create(formData);
      setFormData({ name: '', description: '', maxMembers: 4 });
      setSelectedMembers([]);
      setCreateMode(false);
      setSuccess('Squad created and sent for approval!');
      
      // Refresh squad data
      setTimeout(fetchSquad, 1000);
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating squad');
      console.error('Error creating squad:', error);
    }
  };

  const handleAddMember = async (userId) => {
    setError('');
    setSuccess('');

    try {
      const response = await squadService.addMember(squad._id, { userId });
      setSquad(response.data.squad);
      setSuccess('Member added successfully');
    } catch (error) {
      setError(error.response?.data?.message || 'Error adding member');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;

    setError('');
    setSuccess('');

    try {
      const response = await squadService.removeMember(squad._id, { userId });
      setSquad(response.data.squad);
      setSuccess('Member removed');
    } catch (error) {
      setError(error.response?.data?.message || 'Error removing member');
    }
  };

  const handleLeaveSquad = async () => {
    if (!window.confirm('Are you sure you want to leave this squad?')) return;

    setError('');
    setSuccess('');

    try {
      await squadService.leaveSquad(squad._id);
      setSquad(null);
      setSuccess('You have left the squad');
      setTimeout(fetchSquad, 1000);
    } catch (error) {
      setError(error.response?.data?.message || 'Error leaving squad');
    }
  };

  const handleDeactivateSquad = async () => {
    if (!window.confirm('Are you sure you want to deactivate this squad? This action cannot be undone.')) return;

    setError('');
    setSuccess('');

    try {
      await squadService.deactivateSquad(squad._id);
      setSquad(null);
      setSuccess('Squad deactivated');
      setTimeout(fetchSquad, 1000);
    } catch (error) {
      setError(error.response?.data?.message || 'Error deactivating squad');
    }
  };

  if (loading) return <div className="loading">Loading squad info...</div>;

  // ADMIN VIEW
  if (userRole === 'admin') {
    return (
      <div className="squad-management">
        <div className="container">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {/* Admin Navigation */}
          <div className="admin-squad-header">
            <h1>⚔️ Squad Management Control Panel</h1>
            <div className="admin-tabs">
              <button 
                className={`admin-tab ${adminView === 'overview' ? 'active' : ''}`}
                onClick={() => setAdminView('overview')}
              >
                📊 Overview
              </button>
              <button 
                className={`admin-tab ${adminView === 'all' ? 'active' : ''}`}
                onClick={() => {
                  setAdminView('all');
                  if (allSquads.length === 0) fetchAllSquads();
                }}
              >
                ⚔️ All Squads
              </button>
            </div>
          </div>

          {/* Overview Tab */}
          {adminView === 'overview' && stats && (
            <div className="admin-overview">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">Total Squads</div>
                  <div className="stat-value">{stats.squads.total}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Approved</div>
                  <div className="stat-value">{stats.squads.approved}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Pending</div>
                  <div className="stat-value">{stats.squads.pending}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Members</div>
                  <div className="stat-value">{stats.performance.totalMembers}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Wins</div>
                  <div className="stat-value">{stats.performance.totalWins}</div>
                </div>
              </div>
            </div>
          )}

          {/* All Squads Tab */}
          {adminView === 'all' && (
            <div className="admin-all-squads">
              <div className="search-filters">
                <input 
                  type="text" 
                  placeholder="Search squads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyUp={fetchAllSquads}
                />
                <select 
                  value={filterStatus} 
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    fetchAllSquads();
                  }}
                >
                  <option value="">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                </select>
                <button onClick={fetchAllSquads} className="refresh-btn">🔄</button>
              </div>

              {allSquads.length === 0 ? (
                <div className="no-data">No squads found</div>
              ) : (
                <div className="squads-grid">
                  {allSquads.map(squad => (
                    <div key={squad._id} className="admin-squad-card">
                      <div className="squad-title">
                        <h3>{squad.name}</h3>
                        <span className={`status-badge ${squad.status}`}>{squad.status}</span>
                      </div>
                      <div className="squad-details">
                        <p><strong>Leader:</strong> {squad.leader.username}</p>
                        <p><strong>Members:</strong> {squad.members.length}/{squad.maxMembers}</p>
                        <p><strong>Kills:</strong> {squad.analytics.totalKills}</p>
                        <p><strong>Wins:</strong> {squad.analytics.totalWins}</p>
                      </div>
                      <div className="squad-btn-group">
                        <button 
                          onClick={() => fetchSquadAnalytics(squad._id)}
                          className="btn-analytics"
                        >
                          📈 Analyze
                        </button>
                        {squad.status === 'approved' && (
                          <>
                            <button 
                              onClick={() => handleAdminAddMember(squad._id)}
                              className="btn-add-mem"
                            >
                              ➕ Add
                            </button>
                            <button 
                              onClick={() => handleAdminDeleteSquad(squad._id, squad.name)}
                              className="btn-delete-squad"
                            >
                              🗑️ Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Analytics Modal */}
          {adminView === 'analytics' && squadAnalytics && (
            <div className="analytics-modal">
              <div className="modal-content">
                <button onClick={() => {
                  setAdminView('all');
                  setSelectedSquad(null);
                }} className="close-modal">✕</button>
                
                <h2>{squadAnalytics.squadInfo.name}</h2>
                
                <div className="analytics-section">
                  <h4>Members ({squadAnalytics.memberDetails.length})</h4>
                  <div className="members-list">
                    {squadAnalytics.memberDetails.map(member => (
                      <div key={member._id} className="member-row">
                        <div>
                          <strong>{member.username}</strong>
                          <span className="member-stat">Kills: {member.kills}</span>
                        </div>
                        {!member.isLeader && (
                          <button 
                            onClick={() => handleAdminKickMember(selectedSquad, member._id)}
                            className="btn-kick-mem"
                          >
                            🚫 Kick
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {squadAnalytics.inactiveCount > 0 && (
                  <div className="inactive-warning">
                    <h4>⚠️ Inactive Members: {squadAnalytics.inactiveCount}</h4>
                    <div className="inactive-list">
                      {squadAnalytics.inactiveMembers.map(member => (
                        <div key={member._id} className="inactive-item">
                          <span>{member.username}</span>
                          <button 
                            onClick={() => handleAdminKickMember(selectedSquad, member._id)}
                            className="btn-kick-mem"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // USER VIEW
  return (
    <div className="squad-management">
      <div className="container">
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {squad && squad.status === 'approved' ? (
          <div className="squad-card">
            <div className="squad-header">
              <h1>⚔️ Squad: {squad.name}</h1>
              <div className="squad-actions">
                {squad.leader._id === userId && (
                  <>
                    <button onClick={() => setManageMode(!manageMode)} className="btn-secondary">
                      {manageMode ? 'Cancel' : 'Manage Squad'}
                    </button>
                    <button onClick={handleDeactivateSquad} className="btn-danger">
                      Deactivate Squad
                    </button>
                  </>
                )}
                {squad.leader._id !== userId && (
                  <button onClick={handleLeaveSquad} className="btn-danger">
                    Leave Squad
                  </button>
                )}
              </div>
            </div>

            {squad.description && <p className="squad-desc">{squad.description}</p>}
            
            <div className="squad-info">
              <div className="info-item">
                <span className="label">Leader:</span>
                <span className="value">{squad.leader.username}</span>
              </div>
              <div className="info-item">
                <span className="label">Members:</span>
                <span className="value">{squad.members.length}/{squad.maxMembers}</span>
              </div>
              <div className="info-item">
                <span className="label">Status:</span>
                <span className="value status-approved">APPROVED</span>
              </div>
              {squad.wins !== undefined && (
                <>
                  <div className="info-item">
                    <span className="label">Wins:</span>
                    <span className="value">{squad.wins}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Losses:</span>
                    <span className="value">{squad.losses}</span>
                  </div>
                </>
              )}
            </div>

            <h3>Squad Members</h3>
            <div className="members-grid">
              {squad.members.map(member => (
                <div key={member._id} className="member-card">
                  <div className="member-name">{member.username}</div>
                  <div className="member-id">{member.gameId}</div>
                  <div className="member-stats">
                    <span>💥 {member.kills}</span>
                    <span>🏆 {member.wins}</span>
                  </div>
                  {squad.leader._id === userId && member._id !== userId && (
                    <button 
                      onClick={() => handleRemoveMember(member._id)}
                      className="btn-remove"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            {manageMode && squad.leader._id === userId && squad.members.length < squad.maxMembers && (
              <div className="manage-section">
                <h3>Add Members</h3>
                <div className="available-members">
                  {allUsers.filter(u => !squad.members.some(m => m._id === u._id)).map(user => (
                    <div key={user._id} className="user-option">
                      <span>{user.username} ({user.gameId})</span>
                      <button 
                        onClick={() => handleAddMember(user._id)}
                        className="btn-add"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : squad ? (
          <div className="squad-card pending">
            <h1>⏳ Squad Pending Approval</h1>
            <p className="subtitle">Your squad request is under review by admins</p>
            <div className="squad-info">
              <div className="info-item">
                <span className="label">Squad Name:</span>
                <span className="value">{squad.name}</span>
              </div>
              <div className="info-item">
                <span className="label">Status:</span>
                <span className="value status-pending">PENDING</span>
              </div>
            </div>
            {squad.adminComment && (
              <div className="admin-comment">
                <strong>Admin Comment:</strong>
                <p>{squad.adminComment}</p>
              </div>
            )}
          </div>
        ) : createMode ? (
          <div className="squad-card">
            <h1>Create New Squad</h1>
            <form onSubmit={handleCreateSquad} className="squad-form">
              <div className="form-group">
                <label>Squad Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter squad name (min. 3 characters)"
                  maxLength="50"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Squad description..."
                  maxLength="500"
                ></textarea>
              </div>

              <div className="form-group">
                <label>Max Members</label>
                <input
                  type="number"
                  name="maxMembers"
                  value={formData.maxMembers}
                  onChange={handleInputChange}
                  min="2"
                  max="10"
                />
              </div>

              <div className="button-group">
                <button type="submit" className="submit-btn">Create Squad</button>
                <button type="button" onClick={() => setCreateMode(false)} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </form>
            <p className="note">Note: You will be added as the squad leader. Members can be added after admin approval.</p>
          </div>
        ) : (
          <div className="squad-card no-squad">
            <h1>No Squad Yet</h1>
            <p>You're not in any squad. Create one to form a team!</p>
            <button onClick={() => setCreateMode(true)} className="create-btn">
              Create Squad
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SquadManagement;
