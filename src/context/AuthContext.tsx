import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  sendOtp: (email: string) => Promise<void>;
}
const backendUrl = import.meta.env.VITE_BACKEND_URL;
// Create context with default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize token from localStorage
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();


  // Check authentication status whenever token changes
  const checkAuth = useCallback(async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${backendUrl}/check-auth`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Check Auth Response:", res.data);

      if (res.data.user) {
        setUser(res.data.user);
      } else {
        // If server returns success but no user, handle as error
        console.error('Check Auth: No user in response');
        setUser(null);
        localStorage.removeItem('token');
        setToken(null);
      }
    } catch (err) {
      console.error('Check Auth Error:', err.response?.data || err.message);
      setUser(null);
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Run authentication check on initial load and when token changes
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Handle automatic redirects
  useEffect(() => {
    // Only redirect when loading is complete
    if (!loading) {
      if (user && location.pathname === '/admin-login') {
        console.log("User is authenticated, redirecting to /admin");
        navigate('/admin', { replace: true });
      }
    }
  }, [user, loading, location.pathname, navigate]);

  const sendOtp = async (email: string) => {
    try {
      await axios.post(`${backendUrl}/send-otp`, { email }, { withCredentials: true });
    } catch (error) {
      console.error('Send OTP Error:', error.response?.data || error.message);
      throw error.response?.data?.error || 'Failed to send OTP';
    }
  };

  const login = async (email: string, otp: string) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${backendUrl}/admin-login`,
        { email, password: otp },
        { withCredentials: true }
      );

      // Important: Save token to localStorage first
      const newToken = res.data.token;
      localStorage.setItem('token', newToken);
      setToken(newToken);

      // Then set the user
      setUser(res.data.user);

      console.log("Login successful, user and token set:", res.data.user);
      return res.data;
    } catch (error) {
      console.error('Login Error:', error.response?.data || error.message);
      throw error.response?.data?.message || 'Login failed';
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await axios.get(`${backendUrl}/admin-logout`, { withCredentials: true });
    } catch (error) {
      console.error('Logout Error:', error);
      // Continue with local logout even if API fails
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      setLoading(false);
      console.log("Logout successful");
    }
  };

  const contextValue: AuthContextType = {
    user,
    token,
    loading,
    login,
    logout,
    sendOtp
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};