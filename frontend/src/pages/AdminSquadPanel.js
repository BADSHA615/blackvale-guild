import React, { useState, useEffect } from 'react';
import { squadService, authService } from '../services/api';
import './AdminSquadPanel.css';

function AdminSquadPanel() {
  const [squadView, setSquadView] = useState('overview'); // overview, all-squads, analytics
  const [allSquads, setAllSquads] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedSquad, setSelectedSquad] = useState(null);
  const [squadAnalytics, setSquadAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
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
  };

  const fetchAllSquads = async () => {
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
  };

  const fetchSquadAnalytics = async (squadId) => {
    try {
      setLoading(true);
      const response = await squadService.getSquadAnalytics(squadId);
      setSquadAnalytics(response.data);
      setSelectedSquad(squadId);
    } catch (err) {
      setError('Error fetching analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleKickMember = async (squadId, userId, reason) => {
    if (!window.confirm('Are you sure you want to kick this member?')) return;
    
    try {
      setError('');
      setSuccess('');
      await squadService.adminKickMember(squadId, { userId, reason });
      setSuccess('Member kicked successfully');
      await fetchSquadAnalytics(squadId);
    } catch (err) {
      setError(err.response?.data?.message || 'Error kicking member');
    }
  };

  const handleAddMember = async (squadId) => {
    const userId = window.prompt('Enter user ID or select from console');
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

  const handleDeleteSquad = async (squadId, squadName) => {
    if (!window.confirm(`Are you sure you want to DELETE squad "${squadName}"? This action cannot be undone!`)) return;

    const reason = window.prompt('Enter reason for deletion:');
    
    try {
      setError('');
      setSuccess('');
      await squadService.adminDeleteSquad(squadId, { reason });
      setSuccess('Squad deleted successfully');
      await fetchAllSquads();
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting squad');
    }
  };

  return (
    <div className="admin-squad-panel">
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Navigation Tabs */}
      <div className="squad-tabs">
        <button 
          className={`tab ${squadView === 'overview' ? 'active' : ''}`}
          onClick={() => setSquadView('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab ${squadView === 'all-squads' ? 'active' : ''}`}
          onClick={() => {
            setSquadView('all-squads');
            if (allSquads.length === 0) fetchAllSquads();
          }}
        >
          ⚔️ All Squads
        </button>
        <button 
          className={`tab ${squadView === 'analytics' ? 'active' : ''}`}
          onClick={() => setSquadView('analytics')}
        >
          📈 Analytics
        </button>
      </div>

      {/* Overview Tab */}
      {squadView === 'overview' && stats && (
        <div className="overview-section">
          <h2>Squad System Overview</h2>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Total Squads</div>
              <div className="stat-value">{stats.squads.total}</div>
              <div className="stat-breakdown">
                <span className="badge approved">{stats.squads.approved} Approved</span>
                <span className="badge pending">{stats.squads.pending} Pending</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Active Members</div>
              <div className="stat-value">{stats.performance.totalMembers}</div>
              <div className="stat-detail">Across all squads</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Squad Wins</div>
              <div className="stat-value">{stats.performance.totalWins}</div>
              <div className="stat-detail">Total victories</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Squad Losses</div>
              <div className="stat-value">{stats.performance.totalLosses}</div>
              <div className="stat-detail">Total defeats</div>
            </div>
          </div>

          <div className="status-breakdown">
            <h3>Squad Status Distribution</h3>
            <div className="status-list">
              <div className="status-item">
                <span className="status-badge approved">Approved</span>
                <span className="count">{stats.squads.approved}</span>
              </div>
              <div className="status-item">
                <span className="status-badge pending">Pending</span>
                <span className="count">{stats.squads.pending}</span>
              </div>
              <div className="status-item">
                <span className="status-badge rejected">Rejected</span>
                <span className="count">{stats.squads.rejected}</span>
              </div>
              <div className="status-item">
                <span className="status-badge inactive">Inactive</span>
                <span className="count">{stats.squads.inactive}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Squads Tab */}
      {squadView === 'all-squads' && (
        <div className="all-squads-section">
          <h2>All Squads Management</h2>

          {/* Filters */}
          <div className="filters">
            <input 
              type="text" 
              placeholder="Search squads by name or leader..."
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
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="inactive">Inactive</option>
            </select>
            <button onClick={fetchAllSquads} className="refresh-btn">🔄 Refresh</button>
          </div>

          {loading ? (
            <div className="loading">Loading squads...</div>
          ) : (
            <div className="squads-list">
              {allSquads.length === 0 ? (
                <div className="no-data">No squads found</div>
              ) : (
                allSquads.map(squad => (
                  <div key={squad._id} className="squad-item">
                    <div className="squad-header">
                      <div className="squad-info">
                        <h3>{squad.name}</h3>
                        <p className="squad-leader">Leader: {squad.leader.username}</p>
                      </div>
                      <div className="squad-meta">
                        <span className={`status-badge ${squad.status}`}>{squad.status.toUpperCase()}</span>
                        <span className="members-badge">
                          {squad.members.length}/{squad.maxMembers} Members
                        </span>
                      </div>
                    </div>

                    <div className="squad-analytics">
                      <div className="analytic-item">
                        <span className="label">Kills:</span>
                        <span className="value">{squad.analytics.totalKills}</span>
                      </div>
                      <div className="analytic-item">
                        <span className="label">Wins:</span>
                        <span className="value">{squad.analytics.totalWins}</span>
                      </div>
                      <div className="analytic-item">
                        <span className="label">Avg Kills/Member:</span>
                        <span className="value">{squad.analytics.avgKills}</span>
                      </div>
                      <div className="analytic-item">
                        <span className="label">Fill Rate:</span>
                        <span className="value">{squad.analytics.fillPercentage}%</span>
                      </div>
                    </div>

                    <div className="squad-actions">
                      <button 
                        onClick={() => fetchSquadAnalytics(squad._id)}
                        className="btn-analytics"
                      >
                        📈 View Details
                      </button>
                      {squad.status === 'approved' && (
                        <>
                          <button 
                            onClick={() => handleAddMember(squad._id)}
                            className="btn-add"
                          >
                            ➕ Add Member
                          </button>
                          <button 
                            onClick={() => handleDeleteSquad(squad._id, squad.name)}
                            className="btn-delete"
                          >
                            🗑️ Delete Squad
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {squadView === 'analytics' && (
        <div className="analytics-section">
          <h2>Squad Analytics</h2>

          {!selectedSquad ? (
            <div className="select-squad-prompt">
              <p>Select a squad from the "All Squads" tab to view detailed analytics</p>
              <button onClick={() => setSquadView('all-squads')} className="btn-primary">
                Go to All Squads
              </button>
            </div>
          ) : squadAnalytics ? (
            <div className="analytics-detail">
              <div className="analytics-header">
                <h3>{squadAnalytics.squadInfo.name}</h3>
                <button onClick={() => setSelectedSquad(null)} className="btn-close">✕</button>
              </div>

              {/* Squad Info */}
              <div className="info-section">
                <h4>Squad Information</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="label">Leader:</span>
                    <span className="value">{squadAnalytics.squadInfo.leader}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Status:</span>
                    <span className={`value status-${squadAnalytics.squadInfo.status}`}>
                      {squadAnalytics.squadInfo.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Members:</span>
                    <span className="value">
                      {squadAnalytics.squadInfo.members}/{squadAnalytics.squadInfo.maxMembers}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Created:</span>
                    <span className="value">
                      {new Date(squadAnalytics.squadInfo.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Performance Stats */}
              <div className="performance-section">
                <h4>Performance Metrics</h4>
                <div className="performance-grid">
                  <div className="perf-card">
                    <span className="label">Total Kills</span>
                    <span className="value">{squadAnalytics.performance.totalKills}</span>
                  </div>
                  <div className="perf-card">
                    <span className="label">Total Wins</span>
                    <span className="value">{squadAnalytics.performance.totalWins}</span>
                  </div>
                  <div className="perf-card">
                    <span className="label">Total Matches</span>
                    <span className="value">{squadAnalytics.performance.totalMatches}</span>
                  </div>
                  <div className="perf-card">
                    <span className="label">Win Rate</span>
                    <span className="value">{squadAnalytics.performance.winRate}%</span>
                  </div>
                  <div className="perf-card">
                    <span className="label">Avg Kills/Member</span>
                    <span className="value">{squadAnalytics.performance.avgKills}</span>
                  </div>
                  <div className="perf-card">
                    <span className="label">Avg Wins/Member</span>
                    <span className="value">{squadAnalytics.performance.avgWins}</span>
                  </div>
                </div>
              </div>

              {/* Inactive Members Warning */}
              {squadAnalytics.inactiveCount > 0 && (
                <div className="inactive-section warning">
                  <h4>⚠️ Inactive Members ({squadAnalytics.inactiveCount})</h4>
                  <div className="inactive-list">
                    {squadAnalytics.inactiveMembers.map(member => (
                      <div key={member._id} className="inactive-item">
                        <div className="member-info">
                          <span className="username">{member.username}</span>
                          <span className="gameid">{member.gameId}</span>
                        </div>
                        <div className="member-stats">
                          <span>Kills: {member.kills}</span>
                          <span>Wins: {member.wins}</span>
                        </div>
                        <button 
                          onClick={() => handleKickMember(selectedSquad, member._id, 'Inactive')}
                          className="btn-kick"
                        >
                          🚫 Kick
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Members */}
              <div className="members-section">
                <h4>All Members ({squadAnalytics.memberDetails.length})</h4>
                <div className="members-table">
                  <div className="table-header">
                    <span>Username</span>
                    <span>Kills</span>
                    <span>Wins</span>
                    <span>Matches</span>
                    <span>Role</span>
                    <span>Actions</span>
                  </div>
                  {squadAnalytics.memberDetails.map(member => (
                    <div key={member._id} className="table-row">
                      <span className="username">{member.username}</span>
                      <span>{member.kills}</span>
                      <span>{member.wins}</span>
                      <span>{member.matches}</span>
                      <span className={`role ${member.isLeader ? 'leader' : ''}`}>
                        {member.isLeader ? '👑 Leader' : 'Member'}
                      </span>
                      <span className="actions">
                        {!member.isLeader && (
                          <button 
                            onClick={() => handleKickMember(selectedSquad, member._id, 'Admin removal')}
                            className="btn-kick-small"
                          >
                            Remove
                          </button>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delete Squad Button */}
              {squadAnalytics.squadInfo.status === 'approved' && (
                <div className="delete-section">
                  <button 
                    onClick={() => handleDeleteSquad(selectedSquad, squadAnalytics.squadInfo.name)}
                    className="btn-delete-large"
                  >
                    🗑️ Delete This Squad
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="loading">Loading analytics...</div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminSquadPanel;
