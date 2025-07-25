// Custom hook for authentication management
import { useState, useEffect, useContext, createContext } from 'react';
import { User, AuthState } from '../types';
import { ApiService } from '../services/api';
import { LocalStorage } from '../utils/storage';

const AuthContext = createContext<{
  auth: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
} | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = LocalStorage.getAuthToken();
      if (token) {
        try {
          const response = await ApiService.getCurrentUser();
          if (response.success && response.data) {
            setAuth({
              user: response.data,
              token,
              isAuthenticated: true,
              loading: false
            });
          } else {
            LocalStorage.removeAuthToken();
            setAuth(prev => ({ ...prev, loading: false }));
          }
        } catch (error) {
          LocalStorage.removeAuthToken();
          setAuth(prev => ({ ...prev, loading: false }));
        }
      } else {
        setAuth(prev => ({ ...prev, loading: false }));
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await ApiService.login(email, password);
      if (response.success && response.data) {
        setAuth({
          user: response.data.user,
          token: response.data.token,
          isAuthenticated: true,
          loading: false
        });
        setLoading(false);
        return true;
      }
      setLoading(false);
      return false;
    } catch (error) {
      setLoading(false);
      return false;
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await ApiService.register(userData);
      if (response.success && response.data) {
        setAuth({
          user: response.data.user,
          token: response.data.token,
          isAuthenticated: true,
          loading: false
        });
        setLoading(false);
        return true;
      }
      setLoading(false);
      return false;
    } catch (error) {
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    LocalStorage.removeAuthToken();
    setAuth({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};