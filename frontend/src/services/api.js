import axios from 'axios';

const API_BASE = `${process.env.REACT_APP_API_URL}/api`;

const api = axios.create({
  baseURL: API_BASE,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  getAllUsers: () => api.get('/auth/users'),
};

export const screenshotService = {
  submit: (data) => api.post('/screenshots/submit', data),
  getPending: () => api.get('/screenshots/pending'),
  approve: (id, data) => api.put(`/screenshots/approve/${id}`, data),
  reject: (id, data) => api.put(`/screenshots/reject/${id}`, data),
  getApproved: () => api.get('/screenshots/approved'),
  getUserScreenshots: (userId) => api.get(`/screenshots/user/${userId}`),
};

export const squadService = {
  create: (data) => api.post('/squads/create', data),
  getPending: () => api.get('/squads/pending/admin/list'),
  approve: (id, data) => api.put(`/squads/${id}/approve`, data),
  reject: (id, data) => api.put(`/squads/${id}/reject`, data),
  updateName: (id, data) => api.put(`/squads/${id}/update-name`, data),
  getApproved: () => api.get('/squads/approved'),
  getUserSquad: (userId) => api.get(`/squads/user/${userId}`),
  getById: (id) => api.get(`/squads/details/${id}`),
  addMember: (squadId, data) => api.put(`/squads/${squadId}/add-member`, data),
  removeMember: (squadId, data) => api.put(`/squads/${squadId}/remove-member`, data),
  leaveSquad: (squadId) => api.put(`/squads/${squadId}/leave`),
  deactivateSquad: (squadId) => api.put(`/squads/${squadId}/deactivate`),
  // Admin Squad Management
  getAllSquads: (params) => api.get('/squads/admin/all-squads', { params }),
  getSquadStats: () => api.get('/squads/admin/squad-stats'),
  getSquadAnalytics: (squadId) => api.get(`/squads/admin/analytics/${squadId}`),
  adminKickMember: (squadId, data) => api.put(`/squads/admin/kick-member/${squadId}`, data),
  adminAddMember: (squadId, data) => api.put(`/squads/admin/add-member/${squadId}`, data),
  adminDeleteSquad: (squadId, data) => api.delete(`/squads/admin/delete-squad/${squadId}`, { data })
};

export const leaderboardService = {
  getWeekly: () => api.get('/leaderboard/weekly'),
  getUserRank: (userId) => api.get(`/leaderboard/user-rank/${userId}`),
  resetWeekly: () => api.post('/leaderboard/reset-weekly'),
};

export const settingsService = {
  getSettings: () => api.get('/settings'),
  updateSettings: (data) => api.put('/settings', data),
};

export default api;
