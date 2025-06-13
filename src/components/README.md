# Components Directory

This directory contains all the reusable UI components used throughout the LabTasker application. Components are organized by feature and functionality for better maintainability.

## Directory Structure

```
components/
├── approvals/           # Approval-related components
├── auth/                # Authentication components (login, register, etc.)
├── common/              # Shared/common components used across the app
├── dashboard/           # Dashboard-specific components
│   ├── equipment/       # Equipment management components
│   ├── inventory/       # Inventory management components
│   ├── layout/          # Dashboard layout components
│   ├── shared/          # Shared dashboard components
│   └── tasks/           # Dashboard task management components
├── enquiries/           # Customer enquiry components
├── equipment-management/ # Equipment management UI components
├── experiment-management/ # Experiment management components
├── experiments/         # Experiment-related components
├── inventory/           # Inventory management components
├── projects/            # Project management components
├── protocols/           # Protocol-related components
├── settings/            # Application settings components
├── tasks/               # Reusable task-related components
│   ├── components/      # Sub-components used by task components
│   ├── forms/           # Task-related forms
│   └── views/           # Different views for tasks
└── user-management/     # User management components
```

## Usage Guidelines

1. **Component Organization**:
   - Group related components in their respective feature folders
   - Keep component files close to where they are primarily used
   - Use PascalCase for component file names (e.g., `TaskCard.jsx`)

2. **Component Structure**:
   - Each component should be self-contained with its own styles and assets
   - Use TypeScript for type safety where applicable
   - Include PropTypes or TypeScript interfaces for component props

3. **Styling**:
   - Use Tailwind CSS for styling
   - For complex components, consider using CSS modules or styled-components
   - Follow the design system and use the theme variables

4. **Documentation**:
   - Each component should have a JSDoc comment at the top
   - Document props, examples, and usage guidelines
   - Include any state management requirements

## Best Practices

- Keep components small and focused on a single responsibility
- Use composition to build complex UIs from simple components
- Follow the principle of "lifting state up" when needed
- Use React hooks for state management and side effects
- Implement proper error boundaries for components that might fail
- Write unit tests for complex components
