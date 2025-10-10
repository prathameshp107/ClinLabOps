/**
 * Fetches tasks from the API with optional filtering and sorting
 * @param {Object} options - The options for fetching tasks
 * @param {string} [options.status] - Filter tasks by status
 * @param {string} [options.priority] - Filter tasks by priority
 * @param {string} [options.search] - Search term to filter tasks
 * @param {string} [options.sortBy] - Field to sort by (e.g., 'dueDate', 'priority', 'title')
 * @param {string} [options.sortOrder] - Sort order ('asc' or 'desc')
 * @returns {Promise<Array>} A promise that resolves to an array of tasks
 */
export async function fetchTasks({
  status,
  priority,
  search,
  sortBy = 'dueDate',
  sortOrder = 'asc',
} = {}) {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    
    if (status) params.append('status', status);
    if (priority) params.append('priority', priority);
    if (search) params.append('search', search);
    if (sortBy) params.append('sortBy', sortBy);
    if (sortOrder) params.append('sortOrder', sortOrder);

    const queryString = params.toString();
    const url = `/api/tasks${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to fetch tasks');
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error in fetchTasks:', error);
    throw error;
  }
}

/**
 * Fetches a single task by ID
 * @param {string} id - The ID of the task to fetch
 * @returns {Promise<Object>} A promise that resolves to the task object
 */
export async function fetchTaskById(id) {
  try {
    const response = await fetch(`/api/tasks/${id}`);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to fetch task');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error(`Error fetching task ${id}:`, error);
    throw error;
  }
}

/**
 * Creates a new task
 * @param {Object} taskData - The task data to create
 * @returns {Promise<Object>} A promise that resolves to the created task
 */
export async function createTask(taskData) {
  try {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to create task');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
}

/**
 * Updates an existing task
 * @param {string} id - The ID of the task to update
 * @param {Object} updates - The updates to apply to the task
 * @returns {Promise<Object>} A promise that resolves to the updated task
 */
export async function updateTask(id, updates) {
  try {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to update task');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error(`Error updating task ${id}:`, error);
    throw error;
  }
}

/**
 * Deletes a task
 * @param {string} id - The ID of the task to delete
 * @returns {Promise<boolean>} A promise that resolves to true if successful
 */
export async function deleteTask(id) {
  try {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to delete task');
    }

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error(`Error deleting task ${id}:`, error);
    throw error;
  }
}
