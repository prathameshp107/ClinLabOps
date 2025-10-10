import { NextResponse } from 'next/server';

// GET /api/tasks/[id]/activity
// Returns activity log for a specific task
export async function GET(request, { params }) {
    try {
        const { id } = params;

        // Try to fetch from backend API first
        const backendUrl = process.env.BACKEND_URL;

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

        // Return error if backend is not available
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