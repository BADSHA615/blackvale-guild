import React, { useState, useEffect } from 'react';
import { squadService, authService } from '../services/api';
import './SquadManagement.css';

function SquadManagement() {
  const [squad, setSquad] = useState(null);
  const [createMode, setCreateMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    maxMembers: 4
  });
  const [allUsers, setAllUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchSquad();
    fetchAllUsers();
  }, []);

  const fetchSquad = async () => {
    try {
      const response = await squadService.getUserSquad(userId);
      setSquad(response.data);
    } catch (error) {
      console.log('No squad found');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await authService.getAllUsers();
      setAllUsers(response.data.filter(u => u._id !== userId));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

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
    try {
      await squadService.create(formData);
      setFormData({ name: '', description: '', maxMembers: 4 });
      setSelectedMembers([]);
      setCreateMode(false);
      // Note: Squad request sent, await admin approval
      alert('Squad request submitted! Waiting for admin approval.');
    } catch (error) {
      console.error('Error creating squad:', error);
    }
  };

  if (loading) return <div className="loading">Loading squad info...</div>;

  return (
    <div className="squad-management">
      <div className="container">
        {squad && squad.status === 'approved' ? (
          <div className="squad-card">
            <h1>⚔️ Squad: {squad.name}</h1>
            <p className="squad-desc">{squad.description}</p>
            
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
                </div>
              ))}
            </div>
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
                  placeholder="Enter squad name"
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

              <h3>Invite Members</h3>
              <div className="members-selection">
                {allUsers.map(user => (
                  <label key={user._id} className="member-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(user._id)}
                      onChange={() => toggleMember(user._id)}
                    />
                    <span className="checkmark"></span>
                    <span className="member-info">
                      {user.username} ({user.gameId})
                    </span>
                  </label>
                ))}
              </div>

              <div className="button-group">
                <button type="submit" className="submit-btn">Create Squad</button>
                <button type="button" onClick={() => setCreateMode(false)} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </form>
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
