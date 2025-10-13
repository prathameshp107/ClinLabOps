# LabTasker Notification System

## Overview
The notification system automatically generates in-app notifications for user activities tracked in the Activities collection. Notifications are displayed in a dropdown when users click the bell icon in the header.

## Components

### Backend
1. **Notification Model** (`backend/models/Notification.js`)
   - Defines the notification schema with fields for title, message, type, recipient, etc.
   - Includes methods for marking notifications as read and getting unread counts

2. **Notification Controller** (`backend/controllers/notificationController.js`)
   - Handles CRUD operations for notifications
   - Includes automatic notification generation from activities
   - Provides endpoints for fetching user notifications, marking as read, etc.

3. **Notification Middleware** (`backend/middleware/notificationMiddleware.js`)
   - Automatically creates notifications when activities are logged
   - Maps activity types to appropriate notification titles and types

4. **Activity Service Integration** (`backend/services/activityService.js`)
   - Integrated with notification middleware to automatically generate notifications

### Frontend
1. **Notification Service** (`src/services/notificationService.js`)
   - Provides API functions for interacting with the notification endpoints
   - Handles authentication tokens for API requests

2. **Notification Dropdown** (`src/components/common/notification-dropdown.jsx`)
   - Displays notifications in a dropdown when the bell icon is clicked
   - Allows users to mark notifications as read or delete them
   - Shows unread notification count on the bell icon
   - Includes advanced filtering and search capabilities
   - Features expandable notifications with detailed metadata
   - Provides category-based organization with visual indicators

3. **Dashboard Layout Integration** (`src/components/dashboard/layout/dashboard-layout.jsx`)
   - Integrates the NotificationDropdown component into the header

## How It Works

### Automatic Notification Generation
1. When an activity is logged via `ActivityService.logActivity()`, the notification middleware automatically creates a corresponding notification
2. The middleware maps activity types to appropriate notification titles and types
3. Notifications are stored in the Notification collection with a reference to the original activity

### Displaying Notifications
1. When a user clicks the bell icon, the NotificationDropdown component fetches their notifications
2. Notifications are displayed in a dropdown with appropriate icons based on type
3. Unread notifications are highlighted and counted on the bell icon
4. Users can mark individual notifications as read or delete them
5. Users can mark all notifications as read with a single action

### Enhanced UI Features
1. **Search Functionality**: Users can search notifications by title or message content
2. **Category Filtering**: Notifications can be filtered by category (task, project, experiment, etc.)
3. **Read Status Filtering**: Notifications can be filtered by read/unread status
4. **Expandable Notifications**: Clicking on a notification expands it to show full details and metadata
5. **Priority Indicators**: Visual indicators show the priority level of each notification
6. **Sender Information**: Shows who sent the notification when applicable
7. **Detailed Timestamps**: Hover over timestamps to see full date and time
8. **Action Buttons**: Navigate to related content directly from notifications

### Notification Types
- **Success**: Green checkmark icon (e.g., task created, project completed)
- **Info**: Blue info icon (e.g., task assigned, user profile updated)
- **Warning**: Yellow warning icon (e.g., low inventory, compliance issues)
- **Error**: Red X icon (e.g., failed login attempts)

## API Endpoints

### Get User Notifications
```
GET /api/notifications/user/:userId
```
Parameters:
- `page` (optional): Page number for pagination
- `limit` (optional): Number of notifications per page
- `isRead` (optional): Filter by read status
- `type` (optional): Filter by notification type
- `category` (optional): Filter by notification category

### Mark Notification as Read
```
PATCH /api/notifications/:id/read
```

### Mark All Notifications as Read
```
PATCH /api/notifications/user/:userId/read-all
```

### Delete Notification
```
DELETE /api/notifications/:id
```

### Get Unread Count
```
GET /api/notifications/user/:userId/unread-count
```

## Activity Type Mapping

| Activity Type | Notification Title | Notification Type |
|---------------|-------------------|-------------------|
| task_created | New Task Assigned | success |
| task_updated | Task Updated | info |
| task_deleted | Task Deleted | warning |
| project_created | New Project Created | success |
| project_updated | Project Updated | info |
| project_deleted | Project Deleted | warning |
| user_created | New User Registered | success |
| user_updated | User Profile Updated | info |
| user_deleted | User Account Deleted | warning |
| user_login | Login Activity | info |
| failed_login_attempt | Failed Login Attempt | error |
| experiment_created | New Experiment Created | success |
| experiment_updated | Experiment Updated | info |
| experiment_deleted | Experiment Deleted | warning |
| inventory_added | New Inventory Added | success |
| inventory_updated | Inventory Updated | info |
| inventory_low | Low Inventory Alert | warning |
| compliance_updated | Compliance Status Changed | warning |

## Future Enhancements
1. Real-time notifications using WebSockets
2. Notification preferences/settings
3. Email/SMS notification options
4. Notification grouping and filtering
5. Rich notification content with actions
6. Push notifications for mobile devices
7. Notification scheduling and reminders

## Maintenance Scripts
- `generate-test-notifications.js`: Creates test notifications for development
- `generate-notifications-from-activities.js`: Generates notifications for all existing activities

## Category Mapping
The system automatically maps activity categories to valid notification categories:
- `authentication` → `system`
- `user_management` → `user`
- `notification` → `system`
- All other invalid categories → `general`