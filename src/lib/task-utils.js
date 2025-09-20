/**
 * Utility functions for safely handling task data
 */

/**
 * Creates a safe task object with all required properties and defaults
 * @param {Object} task - The raw task object
 * @returns {Object} - Safe task object with guaranteed properties
 */
export function createSafeTask(task) {
    if (!task) {
        return null;
    }

    return {
        id: task.id || 'unknown',
        title: task.title || 'Untitled Task',
        description: task.description || '',
        status: task.status || 'not_started',
        priority: task.priority || 'medium',
        progress: task.progress || 0,
        createdAt: task.createdAt || new Date().toISOString(),
        updatedAt: task.updatedAt || new Date().toISOString(),
        dueDate: task.dueDate || null,
        assignee: task.assignee ? {
            id: task.assignee.id || 'unknown',
            name: task.assignee.name || 'Unknown User',
            avatar: task.assignee.avatar || null,
            role: task.assignee.role || 'Unknown Role'
        } : null,
        createdBy: task.createdBy ? {
            id: task.createdBy.id || 'unknown',
            name: task.createdBy.name || 'Unknown User',
            avatar: task.createdBy.avatar || null,
            role: task.createdBy.role || 'Unknown Role'
        } : null,
        project: task.project ? {
            id: task.project.id || 'unknown',
            name: task.project.name || 'No Project'
        } : { id: 'unknown', name: 'No Project' },
        tags: Array.isArray(task.tags) ? task.tags : [],
        subtasks: Array.isArray(task.subtasks) ? task.subtasks.map(createSafeSubtask) : [],
        files: Array.isArray(task.files) ? task.files : [],
        comments: Array.isArray(task.comments) ? task.comments : [],
        activityLog: Array.isArray(task.activityLog) ? task.activityLog : [],
        teamMembers: Array.isArray(task.teamMembers) ? task.teamMembers.map(createSafeUser) : [],
        relatedTasks: Array.isArray(task.relatedTasks) ? task.relatedTasks.map(createSafeTask) : [],
        // Include any additional properties from the original task
        ...task
    };
}

/**
 * Creates a safe subtask object with all required properties and defaults
 * @param {Object} subtask - The raw subtask object
 * @returns {Object} - Safe subtask object with guaranteed properties
 */
export function createSafeSubtask(subtask) {
    if (!subtask) {
        return null;
    }

    return {
        id: subtask.id || 'unknown',
        title: subtask.title || 'Untitled Subtask',
        status: subtask.status || 'not_started',
        priority: subtask.priority || 'medium',
        progress: subtask.progress || 0,
        assignee: subtask.assignee || null,
        dueDate: subtask.dueDate || null,
        createdAt: subtask.createdAt || new Date().toISOString(),
        updatedAt: subtask.updatedAt || new Date().toISOString(),
        notes: subtask.notes || '',
        ...subtask
    };
}

/**
 * Creates a safe user object with all required properties and defaults
 * @param {Object} user - The raw user object
 * @returns {Object} - Safe user object with guaranteed properties
 */
export function createSafeUser(user) {
    if (!user) {
        return null;
    }

    return {
        id: user.id || user._id || 'unknown',
        name: user.name || 'Unknown User',
        avatar: user.avatar || null,
        role: user.role || 'Unknown Role',
        email: user.email || null,
        ...user
    };
}

/**
 * Safely gets a user's initials for avatar fallback
 * @param {Object} user - The user object
 * @returns {string} - User initials or '?'
 */
export function getUserInitials(user) {
    if (!user || !user.name) {
        return '?';
    }

    return user.name
        .split(' ')
        .map(n => n.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

/**
 * Safely formats a date string
 * @param {string|Date} date - The date to format
 * @param {string} fallback - Fallback text if date is invalid
 * @returns {string} - Formatted date or fallback
 */
export function safeFormatDate(date, fallback = 'No date') {
    if (!date) return fallback;

    try {
        const dateObj = date instanceof Date ? date : new Date(date);
        if (isNaN(dateObj.getTime())) return fallback;

        return dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch {
        return fallback;
    }
}

/**
 * Gets priority configuration for styling
 * @param {string} priority - The priority level
 * @returns {Object} - Priority configuration object
 */
export function getPriorityConfig(priority) {
    switch (priority) {
        case 'high':
        case 'urgent':
            return {
                textColor: 'text-red-600',
                bgColor: 'bg-red-50 dark:bg-red-950',
                borderColor: 'border-red-200',
                icon: '🔥'
            };
        case 'medium':
            return {
                textColor: 'text-amber-600',
                bgColor: 'bg-amber-50 dark:bg-amber-950',
                borderColor: 'border-amber-200',
                icon: '⚡'
            };
        case 'low':
            return {
                textColor: 'text-green-600',
                bgColor: 'bg-green-50 dark:bg-green-950',
                borderColor: 'border-green-200',
                icon: '📋'
            };
        default:
            return {
                textColor: 'text-blue-600',
                bgColor: 'bg-blue-50 dark:bg-blue-950',
                borderColor: 'border-blue-200',
                icon: '📋'
            };
    }
}

/**
 * Gets status configuration for styling
 * @param {string} status - The status
 * @returns {Object} - Status configuration object
 */
export function getStatusConfig(status) {
    switch (status) {
        case 'completed':
            return {
                textColor: 'text-green-600',
                bgColor: 'bg-green-50 dark:bg-green-950',
                borderColor: 'border-green-200',
                variant: 'success'
            };
        case 'in_progress':
            return {
                textColor: 'text-blue-600',
                bgColor: 'bg-blue-50 dark:bg-blue-950',
                borderColor: 'border-blue-200',
                variant: 'warning'
            };
        case 'blocked':
            return {
                textColor: 'text-red-600',
                bgColor: 'bg-red-50 dark:bg-red-950',
                borderColor: 'border-red-200',
                variant: 'destructive'
            };
        case 'not_started':
        default:
            return {
                textColor: 'text-gray-600',
                bgColor: 'bg-gray-50 dark:bg-gray-950',
                borderColor: 'border-gray-200',
                variant: 'outline'
            };
    }
}