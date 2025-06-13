# Task Detail Page

This directory contains the task detail page and its related components for the LabTasker application. The task detail page displays comprehensive information about a specific task, including its details, subtasks, comments, and activity log.

## File Structure

```
[tid]/
├── page.jsx           # Main task detail page component
├── loading.jsx        # Loading state for the task detail page
├── error.jsx          # Error boundary for the task detail page
└── components/        # Page-specific components
```

## Page Components

### `page.jsx`

The main task detail page component that handles:
- Fetching task data
- Managing task state
- Handling task updates
- Rendering task details and related components

### `loading.jsx`

Shows a loading skeleton while the task data is being fetched.

### `error.jsx`

Displays an error message if there's an issue loading the task data.

## Features

- **Task Overview**: Displays task title, description, status, and priority
- **Task Assignee**: Shows who the task is assigned to with avatar
- **Subtasks**: List of subtasks with completion status
- **Comments**: Section for adding and viewing comments
- **Activity Log**: Timeline of task activities and changes
- **File Attachments**: Manage files attached to the task
- **Task Actions**: Edit, delete, and other task actions

## Data Flow

1. The page component fetches task data using the task ID from the URL
2. Data is passed down to child components as props
3. User interactions trigger updates that are sent to the API
4. The UI updates in response to data changes

## State Management

The page uses React's `useState` and `useEffect` hooks to manage local state. For complex state management, consider using Context API or a state management library.

## Styling

- Uses Tailwind CSS for styling
- Follows the application's design system
- Responsive layout for all screen sizes

## Related Components

- `@/components/tasks/task-overview`
- `@/components/tasks/task-assignee`
- `@/components/tasks/subtasks-list`
- `@/components/tasks/task-comments`
- `@/components/tasks/task-files`
- `@/components/tasks/task-activity-log`

## API Integration

### Fetching Task Data
```javascript
const response = await fetch(`/api/tasks/${id}`);
const task = await response.json();
```

### Updating Task
```javascript
const response = await fetch(`/api/tasks/${id}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(updatedTask)
});
```

## Error Handling

- Displays user-friendly error messages
- Handles network errors gracefully
- Shows loading states during data fetching

## Testing

- Unit tests for utility functions
- Integration tests for component interactions
- End-to-end tests for critical user flows
