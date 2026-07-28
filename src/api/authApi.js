// src/api/authApi.js
import api from './api';

export const login = async (credentials) => {
  const response = await api.post('/Auth/login', credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/Auth/register', userData);
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/Auth/logout');
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/Auth/me');
  return response.data;
};