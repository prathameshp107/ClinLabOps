import { NextResponse } from 'next/server';
import { getToken } from '@/services/authService';

// Mock notifications data
const mockNotifications = [
    {
        _id: '1',
        title: 'New Task Assigned',
        message: 'You have been assigned to "Sample Analysis" by Lab Manager',
        type: 'info',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
        category: 'task'
    },
    {
        _id: '2',
        title: 'Experiment Completed',
        message: 'The experiment PCR-2023-42 has been marked as complete by Dr. Smith',
        type: 'success',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1), // 1 hour ago
        category: 'experiment'
    },
    {
        _id: '3',
        title: 'Reagent Stock Low',
        message: 'Ethanol (95%) is running low. Current stock: 2 bottles',
        type: 'warning',
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
        category: 'inventory'
    }
];

export async function GET(request) {
    const token = getToken();

    // In a real implementation, we would verify the token and fetch user-specific notifications
    // For now, we'll return mock data

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const unreadCount = mockNotifications.filter(n => !n.isRead).length;

    return NextResponse.json({
        notifications: mockNotifications,
        unreadCount,
        totalPages: 1,
        currentPage: 1,
        total: mockNotifications.length
    });
}

export async function PATCH(request, { params }) {
    const token = getToken();

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const pathname = url.pathname;

    // Handle mark as read
    if (pathname.includes('/read')) {
        const notificationId = pathname.split('/')[3]; // Extract ID from /api/notifications/{id}/read
        return NextResponse.json({ message: `Notification ${notificationId} marked as read` });
    }

    // Handle mark all as read
    if (pathname.includes('/read-all')) {
        const userId = pathname.split('/')[2]; // Extract user ID
        return NextResponse.json({ message: `All notifications marked as read for user ${userId}` });
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function DELETE(request, { params }) {
    const token = getToken();

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const pathname = url.pathname;
    const notificationId = pathname.split('/')[3]; // Extract ID from /api/notifications/{id}

    return NextResponse.json({ message: `Notification ${notificationId} deleted` });
}