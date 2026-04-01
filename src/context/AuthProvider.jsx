import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { AuthAPI, UserAPI } from '../utils/api';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshTokenState] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    const storedRefreshToken = localStorage.getItem('refresh_token');

    if (storedToken) {
      setToken(storedToken);
      if (storedRefreshToken) setRefreshTokenState(storedRefreshToken);
      refreshUser();
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await AuthAPI.login({ email, password });

      localStorage.setItem('access_token', data.data.accessToken);
      if (data.data.refreshToken) {
        localStorage.setItem('refresh_token', data.data.refreshToken);
        setRefreshTokenState(data.data.refreshToken);
      }

      setToken(data.data.accessToken);
      setUser(data.data.user);

      return { success: true, user: data.data.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (fullName, username, email, password) => {
    try {
      const data = await AuthAPI.signup({ fullName, username, email, password });

      localStorage.setItem('access_token', data.data.accessToken);
      if (data.data.refreshToken) {
        localStorage.setItem('refresh_token', data.data.refreshToken);
        setRefreshTokenState(data.data.refreshToken);
      }
      setToken(data.data.accessToken);
      setUser(data.data.user);

      return { success: true, user: data.data.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const socialLogin = async (provider, code, redirectUri) => {
    try {
      const data = await AuthAPI.socialSignIn(provider, code, redirectUri);

      localStorage.setItem('access_token', data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem('refresh_token', data.refreshToken);
        setRefreshTokenState(data.refreshToken);
      }
      setToken(data.accessToken);
      setUser(data.user);

      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await AuthAPI.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setToken(null);
      setRefreshTokenState(null);
      setUser(null);
      navigate('/login');
    }
  };

  const updateProfileDetails = async (formData) => {
    try {
      const data = await UserAPI.updateProfile(formData);
      setUser(data.data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const refreshUser = async () => {
    try {
      const data = await UserAPI.getProfile();
      setUser(data.data);
      return { success: true, user: data.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    token,
    refreshToken,
    isAuthenticated: !!token,
    loading,

    login,
    signup,
    socialLogin,
    logout,
    refreshUser,
    setToken,
    setRefreshTokenState,
    updateProfileDetails
  };

  if (loading) {
    return (
      <Loading />
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};