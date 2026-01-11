import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    if (!token) return;
    const fetchMe = async () => {
      try {
        const res = await axios.get('/api/users/me', {
          headers: { 'x-auth-token': token }
        });
        setUser(res.data);
      } catch {
        setToken(null);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [token]);

  const login = async (email, password, role) => {
    const res = await axios.post('/api/auth/login', { email, password, role });
    const jwt = res.data.token;
    setToken(jwt);
    localStorage.setItem('token', jwt);
    const me = await axios.get('/api/users/me', {
      headers: { 'x-auth-token': jwt }
    });
    setUser(me.data);
    return me.data;
  };

  const register = async (payload) => {
    const res = await axios.post('/api/auth/register', payload);
    const jwt = res.data.token;
    setToken(jwt);
    localStorage.setItem('token', jwt);
    const me = await axios.get('/api/users/me', {
      headers: { 'x-auth-token': jwt }
    });
    setUser(me.data);
    return me.data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);









