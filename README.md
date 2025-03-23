# LabTasker Admin Dashboard

A modern, responsive admin dashboard for laboratory task management and workflow automation built with Next.js and ShadCN UI.

![LabTasker Dashboard](https://via.placeholder.com/1200x600/4F46E5/FFFFFF?text=LabTasker+Admin+Dashboard)

## 🚀 Features

### Dashboard Overview
- **Task Management**: Track active tasks, pending approvals, and task completion rates
- **User Activity**: Monitor user engagement and recent actions
- **Experiment Progress**: Visualize current experiment status and completion metrics
- **Compliance Alerts**: Stay informed about compliance issues and regulatory deadlines
- **System Logs**: Review system events and important activity logs

### Task Management System
- **Dual View Mode**: View tasks in traditional list format or Kanban board
- **Task Creation**: Create new tasks with rich metadata and form validation
- **Task Filtering**: Filter tasks by status, priority, assignee, and experiment
- **Task Details**: Comprehensive task information including descriptions, assignments, and deadlines
- **Dependencies**: Set task dependencies to establish workflow prerequisites
- **Attachments**: Add relevant documents and files to tasks for reference
- **Drag and Drop**: Update task statuses via intuitive drag-and-drop in Kanban view
- **Activity Logs**: Track all changes to tasks with detailed activity history
- **Task Actions**: Edit, delete, and change status of tasks with proper permissions

### User & Role Management
- **User Listing**: Comprehensive table with filtering and search capabilities
- **Role-Based Access Control**: Admin, Scientist, Technician, and Reviewer roles
- **User Actions**:
  - Add new users with role assignment and department selection
  - Edit existing user profiles and permissions
  - Reset user passwords (via email or temporary password)
  - Enable/disable two-factor authentication
  - Activate/deactivate user accounts
  - Delete users with proper safeguards
- **Activity Logging**: Track all user management actions for audit purposes

### Additional Features
- **Dark/Light Mode**: Toggle between themes for optimal viewing
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **Modern UI**: Clean and intuitive interface with smooth animations
- **Data Visualization**: Interactive charts and graphs using Recharts
- **Custom Error Pages**: User-friendly 404 and error pages with helpful navigation options

## 🛠️ Technology Stack

- **Framework**: Next.js 15.2.3
- **UI Library**: React 19
- **Component Library**: ShadCN UI (Headless components with Tailwind styling)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Based on Radix UI primitives

## 📂 Project Structure

```
labtasker/
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js app directory
│   │   ├── page.js      # Homepage/Dashboard
│   │   ├── layout.js    # Root layout
│   │   ├── globals.css  # Global styles
│   │   ├── not-found.js # Custom 404 page
│   │   ├── error.js     # Custom error page
│   │   ├── user-management/  # User management page
│   │   └── tasks/       # Task management page
│   ├── components/      # Reusable components
│   │   ├── dashboard/   # Dashboard components
│   │   │   ├── dashboard-layout.jsx     # Dashboard layout wrapper
│   │   │   ├── user-activity.jsx        # User activity component
│   │   │   ├── task-management.jsx      # Main task management component
│   │   │   ├── user-management/         # User management components
│   │   │   │   ├── user-management.jsx  # Main user management component
│   │   │   │   ├── user-table.jsx       # User listing table
│   │   │   │   ├── add-user-dialog.jsx  # Add user modal
│   │   │   │   ├── edit-user-dialog.jsx # Edit user modal
│   │   │   │   ├── reset-password-dialog.jsx # Reset password modal
│   │   │   │   ├── delete-user-dialog.jsx    # Delete user modal
│   │   │   │   └── user-activity-logs.jsx    # User activity logs
│   │   │   └── task-management/         # Task management components
│   │   │       ├── task-table.jsx       # Task listing table
│   │   │       ├── task-board.jsx       # Kanban board view
│   │   │       ├── task-form-dialog.jsx # Add/edit task modal
│   │   │       ├── task-details-dialog.jsx # Task details modal
│   │   │       └── task-delete-dialog.jsx  # Delete task modal
│   │   └── ui/        # UI components built with ShadCN
│   │       ├── button.jsx
│   │       ├── dialog.jsx
│   │       ├── dropdown-menu.jsx
│   │       ├── input.jsx
│   │       ├── select.jsx
│   │       ├── tabs.jsx
│   │       └── ...     # Other UI components
│   └── lib/            # Utility functions
│       └── utils.js    # Common utility functions
├── .next/              # Next.js build directory
├── package.json        # Project dependencies
└── README.md           # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/labtasker.git
cd labtasker
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:3000`

## 🖥️ Usage

### Authentication

Default login credentials for testing:
- Admin: admin@labtasker.com / password
- Scientist: scientist@labtasker.com / password
- Technician: technician@labtasker.com / password
- Reviewer: reviewer@labtasker.com / password

### Dashboard Navigation

The main dashboard provides an overview of:
- Current tasks and their statuses
- Pending approvals requiring attention
- Recent user activity
- System status and alerts

### Task Management

1. Access the Task Management page via the sidebar
2. Choose between List view or Board view using the toggle
3. Create new tasks with the "New Task" button
4. Filter tasks using the search bar and filter dropdowns
5. In List view:
   - Sort by clicking column headers
   - Access task actions via the dropdown menu
6. In Board view:
   - Drag and drop tasks between status columns
   - Click on a task card to view details
7. View task dependencies and attachments in the task details dialog
8. Track all task changes in the activity log

### User Management

1. Access the User Management page via the sidebar
2. Use the search bar to find specific users
3. Filter users by role, status, or last login time
4. Perform user actions via the dropdown menu:
   - Edit user details
   - Reset passwords
   - Enable/disable 2FA
   - Activate/deactivate accounts
   - Delete users (with confirmation)
5. View user activity logs to audit system changes

## 🔒 Security Features

- **Role-Based Access Control**: Different permission levels based on user roles
- **Two-Factor Authentication**: Additional security layer for sensitive accounts
- **Activity Logging**: Comprehensive audit trail of all user management actions
- **Password Security**: Secure password reset workflows

## 🧪 Future Enhancements

- **Experiment Tracking**: Detailed experiment management and progress tracking
- **Inventory Management**: Lab inventory tracking and ordering system
- **Document Management**: Storage and version control for lab documentation
- **API Integration**: Connections to laboratory equipment and external services
- **Advanced Analytics**: Enhanced data visualization and reporting

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [ShadCN UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Framer Motion](https://www.framer.com/motion/)
- [Recharts](https://recharts.org/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://github.com/colinhacks/zod)
