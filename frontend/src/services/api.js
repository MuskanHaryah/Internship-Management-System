import axios from 'axios';
import { formatErrorMessage, logError } from '../utils/errorHandler';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    logError(error, 'Request Interceptor');
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error for debugging
    logError(error, 'API Response');
    
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // Add formatted error message
    error.formattedMessage = formatErrorMessage(error);
    
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/update-profile', data),
  updatePassword: (passwords) => api.put('/auth/update-password', passwords),
};

// User API calls
export const userAPI = {
  getAllUsers: () => api.get('/users'),
  getInterns: () => api.get('/users/interns'),
  getUser: (id) => api.get(`/users/${id}`),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

// Task API calls
export const taskAPI = {
  getTasks: () => api.get('/tasks'),
  getAllTasks: () => api.get('/tasks'), // Alias for consistency
  getMyTasks: () => api.get('/tasks/my-tasks'),
  getTask: (id) => api.get(`/tasks/${id}`),
  createTask: (taskData) => api.post('/tasks', taskData),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  submitTask: (id, submissionData) => api.put(`/tasks/${id}/submit`, submissionData),
};

// Progress API calls
export const progressAPI = {
  getProgress: () => api.get('/progress'),
  createProgress: (data) => api.post('/progress', data),
  updateProgress: (id, data) => api.put(`/progress/${id}`, data),
  getTaskProgress: (taskId) => api.get(`/progress/task/${taskId}`),
  getInternProgress: (internId) => api.get(`/progress/intern/${internId}`),
};

// Feedback API calls
export const feedbackAPI = {
  getAllFeedback: () => api.get('/feedback'),
  createFeedback: (data) => api.post('/feedback', data),
  getInternFeedback: (internId) => api.get(`/feedback/intern/${internId}`),
  getFeedback: (id) => api.get(`/feedback/${id}`),
  updateFeedback: (id, data) => api.put(`/feedback/${id}`, data),
  deleteFeedback: (id) => api.delete(`/feedback/${id}`),
};

// Notification API calls
export const notificationAPI = {
  getNotifications: (params) => api.get('/notifications', { params }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/mark-all-read'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

export default api;
