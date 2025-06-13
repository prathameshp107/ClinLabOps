# Task Components

This directory contains reusable UI components related to task management in the LabTasker application. These components are designed to be used across different parts of the application where task-related functionality is needed.

## Components Overview

### Core Components
- `task-overview.jsx` - Displays the main task information and details
- `task-assignee.jsx` - Handles task assignment and assignee information
- `subtasks-list.jsx` - Manages and displays subtasks for a task
- `task-comments.jsx` - Handles task comments and discussions
- `task-files.jsx` - Manages file attachments for tasks
- `task-activity-log.jsx` - Displays the activity history for a task
- `task-progress.jsx` - Shows progress tracking for tasks

### Utility Components
- `back-button.jsx` - Reusable back navigation button
- `Task-Notfound.jsx` - Custom 404-style component for missing tasks

### Subdirectories
- `components/` - Sub-components used by the main task components
- `forms/` - Form components for task creation and editing
- `views/` - Different view components for tasks (list, grid, etc.)

## Usage

### TaskOverview
```jsx
import { TaskOverview } from '@/components/tasks/task-overview';

// In your component
<TaskOverview 
  task={taskData} 
  onUpdate={handleUpdate} 
  onDelete={handleDelete}
/>
```

### TaskAssignee
```jsx
import { TaskAssignee } from '@/components/tasks/task-assignee';

// In your component
<TaskAssignee 
  assignee={assignee} 
  onAssign={handleAssign}
  teamMembers={teamMembers}
/>
```

## Styling

Components in this directory use Tailwind CSS for styling. Custom styles are defined in component-specific CSS files when needed (e.g., `task-assignee.css`).

## Props and Types

### Common Props
- `task` (Object) - The task data object
- `onUpdate` (Function) - Callback when task is updated
- `onDelete` (Function) - Callback when task is deleted
- `isLoading` (Boolean) - Loading state indicator

## Best Practices

1. **Component Composition**: Compose smaller components to build complex UIs
2. **State Management**: Use React hooks for local state, lift state up when needed
3. **Performance**: Use React.memo for performance optimization
4. **Accessibility**: Ensure all interactive elements are keyboard accessible
5. **Responsive Design**: Make components responsive for all screen sizes

## Related Components

For dashboard-specific task management components, see `@/components/dashboard/tasks`.

## Development

When adding new components:
1. Follow the existing file and component naming conventions
2. Add PropTypes or TypeScript types
3. Include JSDoc comments for documentation
4. Add unit tests for complex logic
