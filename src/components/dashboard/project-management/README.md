# Project Management Components

This directory contains React components for managing projects in the LabTasker application. Each component serves a specific purpose in the project management workflow.

## Components Overview

### Core Project Views
- `project-card-view.jsx` (11KB) - Displays projects in a card-based layout with status indicators, progress bars, and quick actions. Features include project status, priority, dates, and interactive elements like favorite toggling and dropdown menus.

- `project-table.jsx` (14KB) - Provides a tabular view of projects with sorting, filtering, and bulk action capabilities. Ideal for managing multiple projects in a structured format.

### Project Details and Management
- `project-details.jsx` (54KB) - The main project information display component showing comprehensive project information, including description, timeline, team members, and related tasks.

- `project-details-dialog.jsx` (19KB) - A modal dialog for viewing project details in a compact format, useful for quick project overviews.

- `project-status-tracking.jsx` (16KB) - Component for monitoring and updating project status, including progress tracking and milestone management.

### Project Creation and Editing
- `add-project-dialog.jsx` (73KB) - A comprehensive dialog for creating new projects with all necessary fields and validation.

- `edit-project-dialog.jsx` (28KB) - Dialog component for modifying existing project details and settings.

### Project Visualization
- `project-gantt-chart.jsx` (38KB) - Implements a Gantt chart visualization for project timelines and dependencies.

- `project-dependencies.jsx` (15KB) - Manages and displays project dependencies and relationships between different projects.

### Project Actions
- `delete-project-dialog.jsx` (7.7KB) - Confirmation dialog for project deletion with safety checks.

- `project-share-dialog.jsx` (8.4KB) - Interface for sharing project access with team members and managing permissions.

### Activity and Logging
- `activity-log-dialog.jsx` (8.4KB) - Displays project activity history and changes made to the project over time.

## Usage

These components are designed to work together to provide a complete project management solution. They can be imported and used in various parts of the application where project management functionality is needed.

## Dependencies

The components use various UI components from the application's component library and external libraries such as:
- Lucide React for icons
- Framer Motion for animations
- date-fns for date manipulation
- Next.js for routing

## Best Practices

1. Always handle loading and error states when using these components
2. Implement proper data validation before submitting forms
3. Use the appropriate dialog component for the specific action needed
4. Maintain consistent styling by using the provided UI components
5. Follow the established patterns for state management and data flow 