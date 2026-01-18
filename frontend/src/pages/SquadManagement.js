import React, { useState, useEffect, useCallback } from 'react';
import { squadService, authService } from '../services/api';
import AdminSquadPanel from './AdminSquadPanel';
import './SquadManagement.css';

function SquadManagement() {
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole');

  // If user is admin, show admin squad management panel
  if (userRole === 'admin') {
    return <AdminSquadPanel />;
  }

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

  const fetchAllUsers = useCallback(async () => {
    try {
      const response = await authService.getAllUsers();
      setAllUsers(response.data.filter(u => u._id !== userId));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, [userId]);

  useEffect(() => {
    fetchSquad();
    fetchAllUsers();
  }, [fetchSquad, fetchAllUsers]);

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
