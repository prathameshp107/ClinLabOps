import { NextResponse } from 'next/server';

// Mock activities data
const mockActivities = [
    {
        id: 1,
        type: 'task_completed',
        title: 'Task Completed',
        description: 'Completed sample analysis for Project Alpha',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        user: {
            name: 'John Doe',
            avatar: null
        },
        metadata: {
            taskId: 'task-123',
            projectName: 'Project Alpha'
        }
    },
    {
        id: 2,
        type: 'project_created',
        title: 'Project Created',
        description: 'Created new project: Beta Testing Initiative',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        user: {
            name: 'Jane Smith',
            avatar: null
        },
        metadata: {
            projectId: 'proj-456',
            projectName: 'Beta Testing Initiative'
        }
    },
    {
        id: 3,
        type: 'equipment_reserved',
        title: 'Equipment Reserved',
        description: 'Reserved HPLC System for tomorrow morning',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        user: {
            name: 'Mike Johnson',
            avatar: null
        },
        metadata: {
            equipmentId: 'eq-789',
            equipmentName: 'HPLC System'
        }
    },
    {
        id: 4,
        type: 'task_assigned',
        title: 'Task Assigned',
        description: 'New task assigned: Quality control review',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
        user: {
            name: 'Sarah Wilson',
            avatar: null
        },
        metadata: {
            taskId: 'task-101',
            assignedTo: 'John Doe'
        }
    },
    {
        id: 5,
        type: 'sample_received',
        title: 'Sample Received',
        description: 'New batch of samples received for analysis',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
        user: {
            name: 'Lab Technician',
            avatar: null
        },
        metadata: {
            batchId: 'batch-202',
            sampleCount: 24
        }
    }
];

export async function GET(request) {
    try {
        // In a real application, you would fetch activities from a database
        // For now, return mock data
        return NextResponse.json({
            success: true,
            data: mockActivities
        });
    } catch (error) {
        console.error('Error fetching activities:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch activities' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const body = await request.json();

        // In a real application, you would save the activity to a database
        const newActivity = {
            id: mockActivities.length + 1,
            type: body.type || 'general',
            title: body.title || 'New Activity',
            description: body.description || '',
            timestamp: new Date().toISOString(),
            user: body.user || { name: 'Unknown User', avatar: null },
            metadata: body.metadata || {}
        };

        // Add to mock data (in memory only)
        mockActivities.unshift(newActivity);

        return NextResponse.json({
            success: true,
            data: newActivity
        });
    } catch (error) {
        console.error('Error creating activity:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create activity' },
            { status: 500 }
        );
    }
}