// src/hooks/useTheme.js
import { useState, useEffect } from 'react';
import { STORAGE_KEYS, getStorageItem, setStorageItem } from '../utils/constants';

export const useTheme = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = getStorageItem(STORAGE_KEYS.THEME, 'light');
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setStorageItem(STORAGE_KEYS.THEME, newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return { theme, toggleTheme };
};

export default useTheme;
