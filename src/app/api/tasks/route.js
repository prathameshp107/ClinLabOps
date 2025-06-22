import { NextResponse } from 'next/server';
import { tasks } from '@/app/tasks/data/tasks';

// GET /api/tasks
// Returns a list of tasks with optional filtering and sorting
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'dueDate';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    // Filter tasks based on query parameters
    let filteredTasks = [...tasks];

    if (status && status !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.status === status);
    }

    if (priority) {
      filteredTasks = filteredTasks.filter(task => task.priority === priority);
    }

    if (search) {
      const searchTerm = search.toLowerCase();
      filteredTasks = filteredTasks.filter(
        task =>
          task.title.toLowerCase().includes(searchTerm) ||
          task.description?.toLowerCase().includes(searchTerm) ||
          task.experiment?.toLowerCase().includes(searchTerm)
      );
    }

    // Sort tasks
    filteredTasks.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'dueDate') {
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);
        comparison = dateA - dateB;
      } else if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        comparison = (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0);
      } else if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return NextResponse.json({
      success: true,
      data: filteredTasks,
      total: filteredTasks.length,
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// POST /api/tasks
// Creates a new task
export async function POST(request) {
  try {
    const taskData = await request.json();
    
    // In a real app, you would validate the task data here
    // and save it to a database
    
    const newTask = {
      id: `task-${Math.random().toString(36).substr(2, 9)}`,
      ...taskData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // In a real app, you would save the task to a database here
    // For now, we'll just return the new task
    
    return NextResponse.json(
      { success: true, data: newTask },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
