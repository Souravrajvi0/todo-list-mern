import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

export const getTasks = (params) => api.get('/tasks', { params }).then((r) => r.data);
export const getWeeklyStats = (weekStart) =>
  api.get('/tasks/stats/week', { params: weekStart ? { weekStart } : {} }).then((r) => r.data);
export const getWeeksOverview = (weeks = 6) =>
  api.get('/tasks/stats/weeks', { params: { weeks } }).then((r) => r.data);
export const searchTasks = (q) => api.get('/tasks/search', { params: { q } }).then((r) => r.data);
export const createTask = (payload) => api.post('/tasks', payload).then((r) => r.data);
export const updateTask = (id, payload) => api.put(`/tasks/${id}`, payload).then((r) => r.data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`).then((r) => r.data);

export default api;
