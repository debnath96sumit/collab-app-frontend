import { useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import { NotificationContext } from './NotificationContext';
import { NotificationAPI } from '../utils/api';
import { pushToast } from '../utils/toaster';
import { getNotificationText } from '../helpers';

export const NotificationProvider = ({ children }) => {
    const { isAuthenticated, token } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [nextCursor, setNextCursor] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const socketRef = useRef(null);
    const cursorRef = useRef(null);

    const fetchUnreadCount = useCallback(async () => {
        try {
            const res = await NotificationAPI.getUnreadCount();
            setUnreadCount(res.data.count);
        } catch (error) {
            console.error('Failed to fetch unread count:', error);
        }
    }, []);

    const fetchNotifications = useCallback(async (reset = false) => {
        setLoading(true);
        try {
            const cursor = reset ? undefined : cursorRef.current;
            const res = await NotificationAPI.getNotifications(cursor);
            setNotifications((prev) =>
                reset ? res.data.notifications : [...prev, ...res.data.notifications]
            );
            cursorRef.current = res.data.nextCursor;
            setNextCursor(res.data.nextCursor);
            setHasMore(!!res.data.nextCursor);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const markAsRead = useCallback(async (id) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
        try {
            await NotificationAPI.markRead(id);
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
        try {
            await NotificationAPI.markAllRead();
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    }, []);

    useEffect(() => {
        if (!isAuthenticated || !token) {
            socketRef.current?.disconnect();
            socketRef.current = null;
            setNotifications([]);
            setUnreadCount(0);
            cursorRef.current = null;
            setNextCursor(null);
            setHasMore(true);
            return;
        }

        fetchUnreadCount();
        fetchNotifications(true);

        const socketInstance = io(`${import.meta.env.VITE_API_URL}/notifications`, {
            auth: { token },
            transports: ['websocket'],
        });
        socketRef.current = socketInstance;

        socketInstance.on('notification:new', (notification) => {
            setNotifications((prev) => [notification, ...prev]);
            setUnreadCount((prev) => prev + 1);

            const actorName = notification.actor?.fullName || notification.actor?.username || 'Someone';
            pushToast({
                message: `${actorName} ${getNotificationText(notification)}`,
                type: 'info',
            });
        });

        return () => {
            socketInstance.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, token]);

    const value = {
        notifications,
        unreadCount,
        loading,
        hasMore,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};