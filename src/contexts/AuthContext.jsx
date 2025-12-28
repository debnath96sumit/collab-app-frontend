import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await axiosInstance.get('/api/users/profile-details');

            if (response.data.statusCode === 200) {
                setUser(response.data.data);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email, password, rememberMe = false) => {
        try {
            const response = await axiosInstance.post('/api/auth/login', {
                email,
                password,
                rememberMe,
            });

            if (response.data.statusCode === 200) {
                const { accessToken, refreshToken, user } = response.data.data;

                localStorage.setItem('accessToken', accessToken);

                if (refreshToken) {
                    localStorage.setItem('refreshToken', refreshToken);
                }

                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                setUser(user);
            } else {
                throw new Error(response.data.message || 'Login failed');
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            throw new Error(message);
        }
    };

    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
                await axiosInstance.post('/api/auth/logout', { refreshToken });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            delete axiosInstance.defaults.headers.common['Authorization'];
            setUser(null);
        }
    };

    /**
     * Logout from all devices
     */
    const logoutAllDevices = async () => {
        try {
            await axiosInstance.post('/api/auth/logout-all');
        } catch (error) {
            console.error('Logout all error:', error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            delete axiosInstance.defaults.headers.common['Authorization'];
            setUser(null);
        }
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                logoutAllDevices,
                isLoading,
                isAuthenticated
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