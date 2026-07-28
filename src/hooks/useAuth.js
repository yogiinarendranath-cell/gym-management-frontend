// src/hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
import { login, register, logout, getCurrentUser } from '../api/authApi';
import { useLocalStorage } from './useLocalStorage';

export const useAuth = () => {
  const [user, setUser] = useLocalStorage('gym_user', null);
  const [token, setToken] = useLocalStorage('gym_token', null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loginUser = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await login(credentials);
      setUser(response.user);
      setToken(response.token);
      return response;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setUser, setToken]);

  const registerUser = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await register(userData);
      setUser(response.user);
      setToken(response.token);
      return response;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setUser, setToken]);

  const logoutUser = useCallback(async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setToken(null);
    }
  }, [setUser, setToken]);

  const loadUser = useCallback(async () => {
    if (!token) return null;
    try {
      const userData = await getCurrentUser();
      setUser(userData);
      return userData;
    } catch (err) {
      setUser(null);
      setToken(null);
      return null;
    }
  }, [token, setUser, setToken]);

  useEffect(() => {
    if (token && !user) {
      loadUser();
    }
  }, [token, user, loadUser]);

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user && !!token,
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
    loadUser
  };
};

export default useAuth;