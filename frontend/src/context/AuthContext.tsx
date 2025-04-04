import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<boolean>;
  setAuthState: (isAuth: boolean, userData: User | null) => void;
}

const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Add axios interceptor to include token in all requests
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // Direct method to set auth state (useful for callbacks)
  const setAuthState = (isAuth: boolean, userData: User | null) => {
    setIsAuthenticated(isAuth);
    setUser(userData);
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set auth state and token
      setAuthState(true, user);
      setToken(token);
      
      // Set token in axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/register`, { name, email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set auth state and token
      setAuthState(true, user);
      setToken(token);
      
      // Set token in axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Set auth state and token
      setAuthState(false, null);
      setToken(null);
      
      // Remove token from axios headers
      delete axios.defaults.headers.common['Authorization'];
      
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      // Even if the server request fails, still log out locally
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Set auth state and token
      setAuthState(false, null);
      setToken(null);
      
      // Remove token from axios headers
      delete axios.defaults.headers.common['Authorization'];
      
      navigate('/');
    }
  };

  const checkAuthStatus = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const storedToken = localStorage.getItem('token');
      
      if (!storedToken) {
        setAuthState(false, null);
        setToken(null);
        delete axios.defaults.headers.common['Authorization'];
        setIsLoading(false);
        return false;
      }

      // Set token in axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      setToken(storedToken);
      
      const response = await axios.get(`${API_URL}/status`);
      
      if (response.data.isAuthenticated && response.data.user) {
        // Set auth state
        setAuthState(true, response.data.user);
        
        // Update stored user data
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setIsLoading(false);
        return true;
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        
        // Set auth state and token
        setAuthState(false, null);
        setToken(null);
        
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      
      // Set auth state and token
      setAuthState(false, null);
      setToken(null);
      
      setIsLoading(false);
      return false;
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Don't render children until we've checked auth status
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-semibold">Loading...</h2>
        <p className="text-muted-foreground">Please wait while we set up your experience.</p>
      </div>
    </div>;
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      token,
      login, 
      register, 
      logout, 
      checkAuthStatus,
      setAuthState
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}