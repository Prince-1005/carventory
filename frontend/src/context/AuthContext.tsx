import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { User } from '../types';
import { authService } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (username: string, email: string, password?: string, role?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('apex_token') || localStorage.getItem('token');
    const savedUser = localStorage.getItem('apex_user');

    if (savedToken) {
      setToken(savedToken);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          // parse error
        }
      } else {
        try {
          const decoded: any = jwtDecode(savedToken);
          setUser({
            id: decoded.id || decoded.sub || 'u_100',
            username: decoded.username || decoded.name || 'Dealership Executive',
            email: decoded.email || 'executive@apexmotors.com',
            role: decoded.role || 'user',
          });
        } catch {
          // Fallback
        }
      }
    }
    setLoading(false);
  }, []);

  const saveAuthSession = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('apex_token', newToken);
    localStorage.setItem('token', newToken);
    localStorage.setItem('apex_user', JSON.stringify(newUser));
  };

  const login = async (email: string, password?: string) => {
    setLoading(true);
    try {
      const res = await authService.login({ email, password });
      let userObj: User;
      
      if (res.user) {
        userObj = {
          id: res.user.id || res.user._id || 'u_' + Date.now(),
          username: res.user.username || email.split('@')[0],
          email: res.user.email || email,
          role: res.user.role || 'user',
        };
      } else {
        try {
          const decoded: any = jwtDecode(res.token);
          userObj = {
            id: decoded.id || 'u_' + Date.now(),
            username: decoded.username || email.split('@')[0],
            email: decoded.email || email,
            role: decoded.role || 'user',
          };
        } catch {
          userObj = {
            id: 'u_' + Date.now(),
            username: email.split('@')[0],
            email: email,
            role: 'user',
          };
        }
      }

      saveAuthSession(res.token, userObj);
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password?: string, role: string = 'user') => {
    setLoading(true);
    try {
      const res = await authService.register({ username, email, password, role });
      const userObj: User = {
        id: res.user?.id || 'u_' + Date.now(),
        username: username,
        email: email,
        role: (res.user?.role as 'admin' | 'user') || 'user',
      };
      saveAuthSession(res.token || 'registered_token', userObj);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('apex_token');
    localStorage.removeItem('token');
    localStorage.removeItem('apex_user');
  };

  const isAuthenticated = Boolean(token && user);
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
