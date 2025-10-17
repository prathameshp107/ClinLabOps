import axios from 'axios';
import { getToken } from './authService';

const API_URL = '/api/notifications';

// Create axios instance with default config
const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export async function getUserNotifications(userId, params = {}) {
    try {
        const res = await api.get(`/notifications/user/${userId}`, { params });
        return res.data;
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
    }
}

export async function markNotificationAsRead(notificationId) {
    try {
        const res = await api.patch(`/notifications/${notificationId}/read`);
        return res.data;
    } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error;
    }
}

export async function markAllNotificationsAsRead(userId) {
    try {
        const res = await api.patch(`/notifications/user/${userId}/read-all`);
        return res.data;
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        throw error;
    }
}

export async function deleteNotification(notificationId) {
    try {
        const res = await api.delete(`/notifications/${notificationId}`);
        return res.data;
    } catch (error) {
        console.error('Error deleting notification:', error);
        throw error;
    }
}

export async function getUnreadCount(userId) {
    try {
        const res = await api.get(`/notifications/user/${userId}/unread-count`);
        return res.data.unreadCount;
    } catch (error) {
        console.error('Error fetching unread count:', error);
        throw error;
    }
}