import { NextResponse } from 'next/server';

// GET /api/tasks/[id]
// Returns a single task by ID
export async function GET(request, { params }) {
    try {
        const { id } = params;

        // Try to fetch from backend API first
        const backendUrl = process.env.BACKEND_URL;

        try {
            const response = await fetch(`${backendUrl}/api/tasks/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                // Add timeout to prevent hanging
                signal: AbortSignal.timeout(5000),
            });

            if (response.ok) {
                const taskData = await response.json();
                return NextResponse.json({
                    success: true,
                    data: taskData,
                });
            }

            if (response.status === 404) {
                return NextResponse.json(
                    { success: false, error: 'Task not found' },
                    { status: 404 }
                );
            }
        } catch (backendError) {
            console.warn('Backend API not available, using fallback:', backendError.message);
        }

        // Fallback: Return mock data for development
        if (process.env.NODE_ENV === 'development') {
            const mockTask = {
                id: id,
                title: "Sample Task",
                description: "This is a sample task loaded from the API fallback.",
                status: "in_progress",
                priority: "medium",
                progress: 50,
                createdAt: new Date().toISOString(),
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                assignee: {
                    id: "u1",
                    name: "John Doe",
                    avatar: "JD"
                },
                project: {
                    id: "p1",
                    name: "Sample Project"
                },
                tags: ["sample", "api", "fallback"],
                subtasks: [],
                files: [],
                comments: [],
                activityLog: [],
                teamMembers: [],
                relatedTasks: []
            };

            console.log('Returning mock task:', mockTask);
            return NextResponse.json({
                success: true,
                data: mockTask,
            });
        }

        // Production: Return error if backend is not available
        return NextResponse.json(
            { success: false, error: 'Task service unavailable' },
            { status: 503 }
        );
    } catch (error) {
        console.error(`Error fetching task ${params.id}:`, error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch task' },
            { status: 500 }
        );
    }
}

// PUT /api/tasks/[id]
// Updates a task
export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const updates = await request.json();

        // In a real app, you would update in your database
        // For now, we'll make a request to your backend API
        const backendUrl = process.env.BACKEND_URL;

        const response = await fetch(`${backendUrl}/api/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates),
        });

        if (!response.ok) {
            if (response.status === 404) {
                return NextResponse.json(
                    { success: false, error: 'Task not found' },
                    { status: 404 }
                );
            }
            throw new Error('Failed to update task in backend');
        }

        const updatedTask = await response.json();

        return NextResponse.json({
            success: true,
            data: updatedTask,
        });
    } catch (error) {
        console.error(`Error updating task ${params.id}:`, error);
        return NextResponse.json(
            { success: false, error: 'Failed to update task' },
            { status: 500 }
        );
    }
}

// DELETE /api/tasks/[id]
// Deletes a task
export async function DELETE(request, { params }) {
    try {
        const { id } = params;

        // In a real app, you would delete from your database
        // For now, we'll make a request to your backend API
        const backendUrl = process.env.BACKEND_URL;

        const response = await fetch(`${backendUrl}/api/tasks/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                return NextResponse.json(
                    { success: false, error: 'Task not found' },
                    { status: 404 }
                );
            }
            throw new Error('Failed to delete task from backend');
        }

        return NextResponse.json({
            success: true,
            message: 'Task deleted successfully',
        });
    } catch (error) {
        console.error(`Error deleting task ${params.id}:`, error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete task' },
            { status: 500 }
        );
    }
}