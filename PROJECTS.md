# Project Feature Documentation

## Overview

This document provides a comprehensive guide to all functionalities, logic, and UI/UX related to the "Project" feature in the LabTasker app. The project feature is a core component that enables users to create, manage, and track research projects with team collaboration, document management, and progress tracking.

---

## Table of Contents

1. [Backend Architecture](#backend-architecture)
2. [Frontend Architecture](#frontend-architecture)
3. [Project ID Page & Sections](#project-id-page--sections)
4. [Project CRUD Operations](#project-crud-operations)
5. [Team & Document Management](#team--document-management)
6. [Timeline & Analytics](#timeline--analytics)
7. [Data Models & Schemas](#data-models--schemas)
8. [API Endpoints](#api-endpoints)
9. [Component Structure](#component-structure)
10. [State Management](#state-management)
11. [Real-time Features](#real-time-features)
12. [Extending the Project Feature](#extending-the-project-feature)
13. [Project Data Export](#project-data-export)

---

## Backend Architecture

### Project Model (`backend/models/Project.js`)
The Project model defines the data structure for projects in MongoDB:

```javascript
{
  projectCode: String,        // Auto-generated unique code (PRJ-00001)
  name: String,               // Project name
  description: String,        // Project description
  startDate: Date,           // Project start date
  endDate: Date,             // Project end date
  status: String,            // Not Started, In Progress, On Hold, Completed
  priority: String,          // Low, Medium, High
  progress: Number,          // 0-100 percentage
  team: Array,              // Team members with roles
  tags: Array,              // Project tags for categorization
  department: String,        // Department assignment
  budget: String,           // Project budget
  confidential: Boolean,     // Confidentiality flag
  complexity: Number,        // 1-100 complexity score
  // Additional fields for equipment, documents, tasks, etc.
}
```

### Controller (`backend/controllers/projectController.js`)
Handles all CRUD operations and business logic:

- **getAllProjects()** - Fetch all projects with optional filtering
- **getProjectById()** - Fetch single project by ID
- **createProject()** - Create new project with auto-generated code
- **updateProject()** - Update existing project
- **deleteProject()** - Delete project and related data

### Routes (`backend/routes/projects.js`)
Exposes RESTful API endpoints:

- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

---

## Frontend Architecture

### Project Service (`src/services/projectService.js`)
Central service for all project-related API calls and operations:

```javascript
// Core CRUD operations
export async function getProjects()
export async function getProjectById(id)
export async function createProject(projectData)
export async function updateProject(id, projectData)
export async function deleteProject(id)

// Team management
export function addProjectMember(projectId, memberData)
export function removeProjectMember(projectId, memberId)
export function changeProjectMemberRole(projectId, memberId, newRole)

// Document management
export function getProjectDocuments(projectId)
export function addProjectDocument(projectId, document)
export function removeProjectDocument(projectId, documentId)
export function uploadProjectDocument(projectId, file)

// Task management
export function getProjectTasks(projectId)
export function addProjectTask(projectId, taskData)
export function updateProjectTask(projectId, taskId, taskData)
export function removeProjectTask(projectId, taskId)

// Analytics and reporting
export function getProjectPerformance(projectId)
export function getProjectReports(projectId)
export function getProjectTimeline(projectId)
```

### Dialog Components
- **AddProjectDialog** - Comprehensive form for creating new projects
- **EditProjectDialog** - Form for editing existing projects
- **DeleteProjectDialog** - Confirmation dialog with safety checks

---

## Project ID Page & Sections

### Main Container (`src/app/projects/[id]/page.jsx`)
The project detail page is the central hub for all project management activities:

#### Features:
- **Dynamic Data Fetching** - Loads project data by ID from API
- **Loading States** - Skeleton loaders during data fetching
- **Error Handling** - Graceful error states and user feedback
- **Tab Navigation** - Switch between different project sections
- **Responsive Design** - Adapts to different screen sizes

#### Tab Structure:
1. **Overview** - Project summary and key metrics
2. **Tasks** - Task management and tracking
3. **Team** - Team member management
4. **Documents** - File management and sharing
5. **Timeline** - Project timeline and milestones

### Overview Section (`src/components/projects/project-overview.jsx`)

#### Components:
- **Project Description** - Rich text description with empty state
- **Project Tags** - Categorized tags with add/remove functionality
- **Project Details** - Key information (dates, department, priority)
- **Quick Stats Cards** - Visual metrics and progress indicators
- **Team Workload** - Team member workload visualization
- **Priority Breakdown** - Task priority distribution
- **Task Status Overview** - Task completion statistics
- **Upcoming Milestones** - Timeline of important events

#### Features:
- **Real-time Updates** - Live data updates and status changes
- **Interactive Elements** - Clickable cards and expandable sections
- **Empty States** - Helpful messages when no data is available
- **Responsive Grid** - Adapts layout based on screen size

### Tasks Section (`src/components/projects/project-tasks.jsx`)

#### Features:
- **Advanced Filtering** - Filter by status, priority, assignee
- **Search Functionality** - Search tasks by name or description
- **Sorting Options** - Sort by due date, priority, status, name
- **Pagination** - Handle large numbers of tasks efficiently
- **Bulk Actions** - Select multiple tasks for batch operations
- **View Modes** - List and grid view options
- **Task Management** - Add, edit, delete individual tasks

#### Task Properties:
- **Name & Description** - Task details
- **Status** - Not Started, In Progress, On Hold, Completed
- **Priority** - Low, Medium, High
- **Assignee** - Team member responsible
- **Due Date** - Task deadline
- **Progress** - Completion percentage
- **Tags** - Categorization labels

### Team Section (`src/components/projects/project-team.jsx`)

#### Features:
- **Real-time Status** - Online/offline/away/busy indicators
- **Workload Tracking** - Visual workload percentages
- **Performance Ratings** - Star-based performance system
- **Role Management** - Assign and change team roles
- **Quick Actions** - Message, email, view profile
- **Member Cards** - Detailed member information display

#### Team Member Properties:
- **Name & Avatar** - Personal identification
- **Role** - Project Lead, Lab Technician, Researcher, etc.
- **Department** - Organizational unit
- **Status** - Real-time availability status
- **Workload** - Current workload percentage
- **Performance** - Rating and metrics
- **Join Date** - When they joined the project

### Documents Section (`src/components/projects/project-documents.jsx`)

#### Features:
- **File Upload** - Drag-and-drop or click to upload
- **File Management** - Download, share, delete, rename
- **Advanced Filtering** - Filter by type, status, uploader
- **Search** - Search by filename, tags, or uploader
- **Sorting** - Sort by date, size, name, type
- **View Modes** - List and grid view options
- **File Statistics** - Storage usage and file counts
- **Recent Activity** - Real-time upload and access logs

#### Document Properties:
- **Name & Type** - File identification
- **Size** - File size in MB
- **Upload Date** - When file was uploaded
- **Uploader** - Who uploaded the file
- **Status** - Active, Archived, Pending Review
- **Tags** - Categorization labels
- **Access Level** - Public, Private, Team Only

### Timeline Section (`src/components/projects/project-timeline.jsx`)

#### Features:
- **Chronological Display** - Events ordered by date
- **Completion Status** - Visual indicators for completed events
- **Event Details** - Title, description, and metadata
- **Progress Tracking** - Visual progress through timeline
- **Milestone Markers** - Important project milestones

---

## Project CRUD Operations

### Add Project (`src/components/projects/add-project-dialog.jsx`)

#### Form Fields:
- **Basic Information** - Name, description, dates
- **Project Settings** - Status, priority, department
- **Team Assignment** - Add team members with roles
- **Tags & Categories** - Add project tags
- **Advanced Settings** - Budget, confidentiality, complexity
- **Rich Text Editor** - Enhanced description editing

#### Features:
- **Form Validation** - Client-side validation with error messages
- **Auto-save** - Periodic saving of form data
- **File Upload** - Attach documents during creation
- **Team Selection** - Search and select team members
- **Tag Suggestions** - Predefined tag options

### Edit Project (`src/components/projects/edit-project-dialog.jsx`)

#### Features:
- **Pre-filled Data** - Loads existing project data
- **Field Validation** - Ensures data integrity
- **Change Tracking** - Highlights modified fields
- **Version History** - Track changes over time
- **Collaborative Editing** - Real-time collaboration indicators

### Delete Project (`src/components/projects/delete-project-dialog.jsx`)

#### Safety Features:
- **Confirmation Required** - Type project name to confirm
- **Impact Warning** - Shows what will be deleted
- **Project Summary** - Displays key project information
- **Irreversible Action** - Clear warning about permanence
- **Cascade Deletion** - Removes related data (tasks, documents, etc.)

---

## Team & Document Management

### Team Management Features

#### Member Operations:
- **Add Member** - Search and add team members
- **Remove Member** - Remove from project with confirmation
- **Role Assignment** - Assign and change roles
- **Permission Management** - Set access levels
- **Workload Monitoring** - Track individual workloads

#### Real-time Features:
- **Status Updates** - Live status changes
- **Activity Tracking** - Monitor member activity
- **Performance Metrics** - Track individual performance
- **Communication Tools** - Built-in messaging system

### Document Management Features

#### File Operations:
- **Upload** - Multiple file upload with progress
- **Download** - Individual and bulk download
- **Share** - Generate shareable links
- **Delete** - Remove files with confirmation
- **Rename** - Change file names
- **Move** - Organize files in folders

#### Organization:
- **Tagging System** - Add tags for categorization
- **Folder Structure** - Organize files hierarchically
- **Search & Filter** - Find files quickly
- **Version Control** - Track file versions
- **Access Control** - Set file permissions

---

## Timeline & Analytics

### Project Analytics

#### Metrics Tracked:
- **Progress Percentage** - Overall project completion
- **Task Completion** - Completed vs total tasks
- **Team Performance** - Individual and team metrics
- **Time Tracking** - Actual vs estimated time
- **Budget Tracking** - Actual vs planned budget
- **Quality Metrics** - Error rates, review scores

#### Visualizations:
- **Progress Charts** - Visual progress indicators
- **Team Workload** - Workload distribution charts
- **Priority Breakdown** - Task priority distribution
- **Timeline Views** - Gantt chart style timelines
- **Performance Trends** - Historical performance data

### Reporting Features

#### Report Types:
- **Progress Reports** - Weekly/monthly progress summaries
- **Team Reports** - Individual and team performance
- **Budget Reports** - Financial tracking and analysis
- **Timeline Reports** - Milestone and deadline tracking
- **Quality Reports** - Error rates and quality metrics

---

## Data Models & Schemas

### Project Schema
```javascript
{
  _id: ObjectId,
  projectCode: String,        // Auto-generated (PRJ-00001)
  name: String,               // Required
  description: String,        // Rich text
  startDate: Date,           // Required
  endDate: Date,             // Required
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'On Hold', 'Completed']
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High']
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  team: [{
    id: String,
    name: String,
    role: String,
    department: String,
    avatar: String,
    joinedAt: Date,
    workload: Number,
    status: String,
    rating: Number
  }],
  tags: [String],
  department: String,
  budget: String,
  confidential: Boolean,
  complexity: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Task Schema
```javascript
{
  id: String,
  name: String,
  description: String,
  status: String,
  priority: String,
  assignee: String,
  dueDate: Date,
  progress: Number,
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Document Schema
```javascript
{
  id: String,
  name: String,
  type: String,
  size: Number,
  uploadedBy: String,
  uploadedAt: Date,
  status: String,
  tags: [String],
  accessLevel: String,
  downloadCount: Number
}
```

---

## API Endpoints

### Project Endpoints
```
GET    /api/projects          # Get all projects
GET    /api/projects/:id      # Get project by ID
POST   /api/projects          # Create new project
PUT    /api/projects/:id      # Update project
DELETE /api/projects/:id      # Delete project
```

### Response Formats
```javascript
// Success Response
{
  "success": true,
  "data": { /* project data */ },
  "message": "Operation successful"
}

// Error Response
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

---

## Component Structure

### Directory Organization
```
src/
├── app/projects/
│   ├── [id]/
│   │   └── page.jsx          # Main project page
│   └── page.jsx              # Projects list page
├── components/projects/
│   ├── add-project-dialog.jsx
│   ├── edit-project-dialog.jsx
│   ├── delete-project-dialog.jsx
│   ├── project-overview.jsx
│   ├── project-tasks.jsx
│   ├── project-team.jsx
│   ├── project-documents.jsx
│   ├── project-timeline.jsx
│   └── project-header.jsx
├── services/
│   └── projectService.js     # API service layer
└── data/
    └── projects-data.js      # Mock data and configurations
```

### Component Hierarchy
```
ProjectPage
├── ProjectHeader
├── TabNavigation
├── ProjectOverview
│   ├── ProjectDescription
│   ├── QuickStatsCards
│   ├── TeamWorkload
│   ├── PriorityBreakdown
│   ├── TaskStatusOverview
│   └── UpcomingMilestones
├── ProjectTasks
│   ├── TaskList
│   ├── TaskFilters
│   └── AddTaskModal
├── ProjectTeam
│   ├── TeamMemberCards
│   ├── TeamStats
│   └── AddMemberModal
├── ProjectDocuments
│   ├── DocumentList
│   ├── DocumentFilters
│   ├── UploadModal
│   └── DocumentStats
└── ProjectTimeline
    └── TimelineEvents
```

---

## State Management

### Local State
- **Project Data** - Current project information
- **Loading States** - API call status indicators
- **Error States** - Error handling and user feedback
- **UI State** - Tab selection, view modes, filters
- **Form State** - Form data and validation

### State Updates
- **Real-time Updates** - Live data synchronization
- **Optimistic Updates** - Immediate UI feedback
- **Error Recovery** - Graceful error handling
- **Data Persistence** - Save state across sessions

---

## Real-time Features

### Live Updates
- **Team Status** - Real-time member status changes
- **Task Progress** - Live task completion updates
- **Document Activity** - File upload/download notifications
- **Project Metrics** - Live progress and performance updates

### Collaboration Features
- **Live Editing** - Collaborative document editing
- **Activity Feed** - Real-time activity notifications
- **Status Indicators** - Show who's currently active
- **Chat Integration** - Team communication tools

---

## Extending the Project Feature

### Adding New Fields
1. **Update Backend Model** - Add fields to Project schema
2. **Update API Endpoints** - Handle new fields in controllers
3. **Update Frontend Forms** - Add form fields and validation
4. **Update Display Components** - Show new fields in UI
5. **Update Mock Data** - Include new fields in test data

### Integration with Other Modules
- **Tasks Module** - Link tasks to projects
- **Equipment Module** - Assign equipment to projects
- **Protocols Module** - Link protocols to projects
- **Inventory Module** - Track project resource usage
- **User Management** - Enhanced team member management

### Analytics Enhancements
- **Advanced Charts** - More sophisticated visualizations
- **Custom Reports** - User-defined report templates
- **Export Features** - PDF, Excel, CSV exports
- **Dashboard Widgets** - Customizable dashboard components

### Performance Optimizations
- **Pagination** - Handle large datasets efficiently
- **Caching** - Cache frequently accessed data
- **Lazy Loading** - Load components on demand
- **Image Optimization** - Optimize file uploads and displays

---

## Best Practices

### Code Organization
- **Component Separation** - Single responsibility principle
- **Reusable Components** - Shared UI components
- **Service Layer** - Centralized API calls
- **Error Boundaries** - Graceful error handling

### Performance
- **Memoization** - Cache expensive calculations
- **Debouncing** - Limit API calls during user input
- **Virtual Scrolling** - Handle large lists efficiently
- **Code Splitting** - Load only needed code

### Security
- **Input Validation** - Validate all user inputs
- **Access Control** - Check user permissions
- **Data Sanitization** - Clean user data
- **CSRF Protection** - Prevent cross-site attacks

### User Experience
- **Loading States** - Show progress indicators
- **Error Messages** - Clear, helpful error text
- **Empty States** - Guide users when no data exists
- **Responsive Design** - Work on all screen sizes

---

## Troubleshooting

### Common Issues
1. **Data Not Loading** - Check API endpoints and network
2. **Form Validation Errors** - Verify field requirements
3. **Real-time Updates Not Working** - Check WebSocket connections
4. **File Upload Failures** - Verify file size and type limits
5. **Performance Issues** - Monitor component re-renders

### Debug Tools
- **React DevTools** - Component state inspection
- **Network Tab** - API call monitoring
- **Console Logs** - Error tracking and debugging
- **Performance Profiler** - Identify bottlenecks

---

## Project Data Export

### Usage
- Go to a project page and click the actions (three dots) menu in the header.
- Select "Export Data" and choose a format: CSV, Excel, PDF, or JSON.
- The exported file will download to your device.
- Excel exports include multiple sheets (Project Info, Team, Tasks, etc.).
- PDF exports are formatted for readability, with each section clearly separated.

### Supported Formats
- **CSV**: Simple, flat data (best for single-project summary)
- **Excel (XLSX)**: Multi-sheet, structured data (Project Info, Team, Tasks, Documents, etc.)
- **PDF**: Human-readable, printable report with all project details
- **JSON**: Raw project data for programmatic use

### Security & Permissions
- By default, all authenticated users can export project data.
- (For future use) To restrict export to admins only, uncomment the `auth.authorize('admin')` middleware in `backend/routes/projects.js`.
- Sensitive fields can be excluded or masked in the export logic as needed.

---

This documentation provides a comprehensive overview of the Project feature in the LabTasker app. For specific implementation details, refer to the individual component files and API documentation. 