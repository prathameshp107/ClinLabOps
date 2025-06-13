# Tasks

This directory contains all task-related pages and components for the LabTasker application. It follows the Next.js 13+ App Router conventions.

## Directory Structure

```
tasks/
├── [id]/                  # Dynamic route for individual task pages
│   ├── page.jsx          # Task detail page
│   ├── loading.jsx       # Loading state for task detail
│   ├── error.jsx         # Error boundary for task detail
│   └── components/       # Page-specific components
├── new/                  # New task creation page
├── page.jsx              # Tasks listing page
├── loading.jsx           # Loading state for tasks list
└── error.jsx             # Error boundary for tasks list
```

## Pages

### Task Listing (`/tasks`)
- Displays a list of all tasks
- Supports filtering, sorting, and searching
- Shows task status, priority, and due dates

### Task Detail (`/tasks/[id]`)
- Shows detailed information about a specific task
- Includes subtasks, comments, and activity log
- Allows task editing and management

### New Task (`/tasks/new`)
- Form for creating new tasks
- Includes all task fields and validation
- Handles task creation and redirection

## Features

- **Task Management**: Create, read, update, and delete tasks
- **Task Assignment**: Assign tasks to team members
- **Subtasks**: Break down tasks into smaller subtasks
- **Comments**: Add and manage task comments
- **Activity Log**: Track changes to tasks
- **File Attachments**: Upload and manage task-related files

## Data Flow

1. Pages fetch task data using server components
2. Data is passed to client components as props
3. User interactions trigger API calls to update task data
4. The UI updates in response to data changes

## API Integration

### Fetching Tasks
```javascript
// Server Component
export default async function TasksPage() {
  const tasks = await fetchTasks();
  return <TasksList tasks={tasks} />;
}
```

### Creating a Task
```javascript
// Client Component
const handleSubmit = async (taskData) => {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData)
  });
  // Handle response
};
```

## State Management

- Uses React hooks for local state management
- Server components for data fetching
- Context API for shared state when needed

## Styling

- Uses Tailwind CSS for styling
- Follows the application's design system
- Responsive design for all screen sizes

## Testing

- Unit tests for utility functions
- Component tests for UI components
- Integration tests for task workflows
- End-to-end tests for critical paths

## Related Components

- `@/components/tasks/` - Reusable task components
- `@/components/dashboard/tasks/` - Dashboard-specific task components

## Best Practices

- Use server components for data fetching when possible
- Implement proper loading and error states
- Follow accessibility guidelines
- Optimize performance with code splitting
- Use TypeScript for type safety
