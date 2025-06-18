# Dashboard Task Management

This directory contains components specifically designed for the dashboard's task management interface. These components provide the main task management functionality within the LabTasker dashboard.

## Components Overview

### Core Components
- `task-management.jsx` - Main task management component with tabs and views
- `task-list.jsx` - Displays tasks in a list view
- `task-board.jsx` - Kanban-style board view for tasks
- `task-table.jsx` - Tabular view of tasks with sorting and filtering
- `task-details.jsx` - Detailed view of a single task
- `task-form-dialog.jsx` - Form for creating and editing tasks
- `task-comments.jsx` - Task comments section
- `task-subtasks.jsx` - Subtasks management
- `task-templates.jsx` - Task template management
- `task-delete-dialog.jsx` - Confirmation dialog for task deletion
- `task-details-dialog.jsx` - Modal dialog for task details
- `task-heatmap.jsx` - Visual representation of task activity

## Directory Structure

```
dashboard/tasks/
├── task-management.jsx     # Main task management component
├── task-list.jsx          # List view of tasks
├── task-board.jsx         # Kanban board view
├── task-table.jsx         # Table view with sorting/filtering
├── task-details.jsx       # Detailed task view
├── task-form-dialog.jsx    # Task creation/editing form
├── task-comments.jsx      # Task comments section
├── task-subtasks.jsx      # Subtasks management
├── task-templates.jsx     # Task templates
├── task-delete-dialog.jsx # Delete confirmation
├── task-details-dialog.jsx # Task details modal
└── task-heatmap.jsx       # Task activity visualization
```

## Usage

### TaskManagement Component
```jsx
import { TaskManagement } from '@/components/dashboard/tasks/task-management';

// In your dashboard component
<TaskManagement 
  tasks={tasks}
  onTaskUpdate={handleTaskUpdate}
  onTaskDelete={handleTaskDelete}
  teamMembers={teamMembers}
  projects={projects}
/>
```

### TaskList Component
```jsx
import { TaskList } from '@/components/dashboard/tasks/task-list';

// In your component
<TaskList 
  tasks={tasks}
  onTaskClick={handleTaskClick}
  onStatusChange={handleStatusChange}
  onPriorityChange={handlePriorityChange}
  onAssigneeChange={handleAssigneeChange}
/>
```

## State Management

Components in this directory typically work with the following data structures:

### Task Object
```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'in-review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  assignee?: User;
  project?: Project;
  labels?: string[];
  subtasks?: Subtask[];
  comments?: Comment[];
  createdAt: string;
  updatedAt: string;
}
```

## Integration with API

These components expect data in a specific format and handle various task-related actions:

- Fetching tasks
- Creating new tasks
- Updating task details
- Deleting tasks
- Managing task assignments
- Tracking task progress

## Styling

Components use Tailwind CSS for styling with some custom CSS where needed. The design follows the application's design system and uses theme variables for consistency.

## Best Practices

1. **Performance**: Use virtualization for large lists of tasks
2. **State Management**: Use context or state management for shared state
3. **Error Handling**: Implement proper error boundaries and loading states
4. **Accessibility**: Ensure all interactive elements are accessible
5. **Responsive Design**: Components should work on all screen sizes

## Related Components

For reusable task-related UI components, see `@/components/tasks`.
