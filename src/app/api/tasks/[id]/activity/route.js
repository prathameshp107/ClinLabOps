import { NextResponse } from 'next/server';

// GET /api/tasks/[id]/activity
// Returns activity log for a specific task
export async function GET(request, { params }) {
    try {
        const { id } = params;

        // Try to fetch from backend API first
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';

        try {
            const response = await fetch(`${backendUrl}/api/tasks/${id}/activity`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                // Add timeout to prevent hanging
                signal: AbortSignal.timeout(5000),
            });

            if (response.ok) {
                const activityData = await response.json();
                return NextResponse.json({
                    success: true,
                    data: activityData,
                });
            }

            if (response.status === 404) {
                return NextResponse.json(
                    { success: false, error: 'Task not found' },
                    { status: 404 }
                );
            }
        } catch (backendError) {
            console.warn('Backend API not available for activity log, using fallback:', backendError.message);
        }

        // Fallback: Return mock activity data for development
        if (process.env.NODE_ENV === 'development') {
            const mockActivities = [
                {
                    id: "a1",
                    action: "task_created",
                    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                    user: "System",
                    details: null
                },
                {
                    id: "a2",
                    action: "task_assigned",
                    timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
                    user: "Admin",
                    details: "John Doe"
                },
                {
                    id: "a3",
                    action: "comment_added",
                    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
                    user: "John Doe",
                    details: null
                },
                {
                    id: "a4",
                    action: "subtask_added",
                    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
                    user: "John Doe",
                    details: "Review documentation"
                },
                {
                    id: "a5",
                    action: "file_uploaded",
                    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                    user: "John Doe",
                    details: "requirements.pdf"
                },
                {
                    id: "a6",
                    action: "status_changed",
                    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    user: "John Doe",
                    details: "in_progress"
                }
            ];

            console.log('Returning mock activity log for task:', id);
            return NextResponse.json({
                success: true,
                data: mockActivities,
            });
        }

        // Production: Return error if backend is not available
        return NextResponse.json(
            { success: false, error: 'Activity service unavailable' },
            { status: 503 }
        );
    } catch (error) {
        console.error(`Error fetching activity log for task ${params.id}:`, error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch activity log' },
            { status: 500 }
        );
    }
}