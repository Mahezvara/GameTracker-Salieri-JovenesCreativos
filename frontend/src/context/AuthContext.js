import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await authService.getCurrentUser();
          setUser(response.data.data);
        } catch (err) {
          console.error('Error verificando autenticación:', err);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const register = async (nombre, email, contraseña, confirmarContraseña) => {
    setError('');
    try {
      const response = await authService.register(nombre, email, contraseña, confirmarContraseña);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      return { success: true, message: 'Registro exitoso' };
    } catch (err) {
      const message = err.response?.data?.message || 'Error en el registro';
      setError(message);
      return { success: false, message };
    }
  };

  const login = async (email, contraseña) => {
    setError('');
    try {
      const response = await authService.login(email, contraseña);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      return { success: true, message: 'Inicio de sesión exitoso' };
    } catch (err) {
      const message = err.response?.data?.message || 'Error en el inicio de sesión';
      setError(message);
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Error en logout:', err);
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setError('');
    }
  };

  const value = {
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
