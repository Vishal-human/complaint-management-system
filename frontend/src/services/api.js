import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const complaintAPI = {
  create: (data) => api.post('/complaints', data),
  getAll: () => api.get('/complaints'),
  updateStatus: (id, status) => api.put(`/complaints/${id}/status`, { status }),
};

export const notificationAPI = {
  create: (data) => api.post('/notifications', data),
  getAll: () => api.get('/notifications'),
  delete: (id) => api.delete(`/notifications/${id}`),
};

export default api;
