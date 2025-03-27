
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

### Customer Enquiry Management System
- **Enquiries Dashboard**: View and manage all customer enquiries with status indicators
- **Advanced Filtering**: Filter enquiries by status, priority, and assignee
- **Search Functionality**: Search across all enquiry fields for quick access
- **Detailed Enquiry View**: Comprehensive enquiry details with tabbed interface:
  - Overview with customer information and enquiry details
  - Documents section for report management
  - Activity log tracking all enquiry-related actions
  - Comments section for team communication
- **Report Upload**: Dedicated page for uploading lab reports with:
  - Drag-and-drop file upload with preview
  - Report metadata entry (title, description, type)
  - Options to mark as final and notify customer
- **Status Tracking**: Visual indicators of enquiry progress and status
- **Priority Management**: High, Medium, and Low priority indicators
- **Quick Actions**: One-click access to common actions like editing or viewing details
- **Tooltips**: Contextual help for better user experience

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

### Authentication System
- **Modern Login Interface**: Clean, intuitive login with email/password authentication
- **Social Login Options**: Sign in with GitHub and Google accounts
- **Two-Factor Authentication**: Enhanced security with 2FA verification
- **Password Recovery**: User-friendly password reset flow with email verification
- **User Registration**: Streamlined account creation with:
  - Full name and work email collection
  - Password strength requirements
  - Laboratory role selection
  - Terms of service and privacy policy acceptance
- **Form Validation**: Real-time validation with helpful error messages
- **Responsive Design**: Works seamlessly across all device sizes
- **Animated Transitions**: Smooth animations for better user experience

### Laboratory Experiment Management
- **Experiment Dashboard**: Overview of all ongoing and completed experiments
- **Experiment Creation**: Step-by-step wizard for creating new experiments
- **Protocol Management**: Create, edit, and version control experimental protocols
- **Sample Tracking**: Track samples throughout the experimental workflow
- **Results Recording**: Structured data entry for experimental results
- **Data Visualization**: Interactive charts for experiment data analysis
- **Collaboration Tools**: Share experiments and results with team members
- **Export Functionality**: Export experiment data in various formats (CSV, PDF, Excel)

### Inventory Management
- **Reagent Tracking**: Monitor reagent usage, expiration dates, and stock levels
- **Equipment Management**: Track equipment availability, maintenance, and calibration
- **Order Management**: Create and track purchase orders for lab supplies
- **Barcode Integration**: Scan barcodes for quick inventory updates
- **Low Stock Alerts**: Automated notifications for items below threshold levels
- **Usage Analytics**: Track consumption patterns and optimize ordering

### Additional Features
- **Dark/Light Mode**: Toggle between themes for optimal viewing
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **Modern UI**: Clean and intuitive interface with smooth animations
- **Data Visualization**: Interactive charts and graphs using Recharts
- **Custom Error Pages**: User-friendly 404 and error pages with helpful navigation options
- **Notifications System**: Real-time alerts for important events and actions
- **Export Functionality**: Export data to CSV, Excel, or PDF formats
- **Bulk Actions**: Perform actions on multiple items simultaneously
- **Advanced Search**: Full-text search across all system data

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
- **Authentication**: NextAuth.js with JWT tokens
- **State Management**: React Context API and Zustand
- **API Requests**: Axios and React Query

## 📂 Project Structure

```
labtasker/
├── public/                  # Static assets
│   ├── images/              # Image assets
│   ├── icons/               # Icon assets
│   └── favicon.ico          # Site favicon
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── page.js          # Homepage/Dashboard
│   │   ├── layout.js        # Root layout
│   │   ├── globals.css      # Global styles
│   │   ├── not-found.js     # Custom 404 page
│   │   ├── error.js         # Custom error page
│   │   ├── login/           # Login page
│   │   ├── register/        # Registration page
│   │   ├── forgot-password/ # Password recovery page
│   │   ├── dashboard/       # Dashboard pages
│   │   ├── user-management/ # User management pages
│   │   ├── tasks/           # Task management pages
│   │   ├── experiments/     # Experiment management pages
│   │   ├── inventory/       # Inventory management pages
│   │   └── settings/        # User and system settings
│   ├── components/          # Reusable components
│   │   ├── auth/            # Authentication components
│   │   │   ├── login-form.jsx           # Login form component
│   │   │   ├── scientific-login-form.jsx # Scientific themed login
│   │   │   ├── register-form.jsx        # Registration form
│   │   │   ├── forgot-password-form.jsx # Password recovery form
│   │   │   └── two-factor-form.jsx      # 2FA verification form
│   │   ├── dashboard/       # Dashboard components
│   │   │   ├── dashboard-layout.jsx     # Dashboard layout wrapper
│   │   │   ├── user-activity.jsx        # User activity component
│   │   │   ├── task-summary.jsx         # Task summary component
│   │   │   ├── experiment-progress.jsx  # Experiment progress charts
│   │   │   ├── compliance-alerts.jsx    # Compliance alerts component
│   │   │   └── system-logs.jsx          # System logs component
│   │   ├── user-management/  # User management components
│   │   │   ├── user-management.jsx      # Main user management component
│   │   │   ├── user-table.jsx           # User listing table
│   │   │   ├── add-user-dialog.jsx      # Add user modal
│   │   │   ├── edit-user-dialog.jsx     # Edit user modal
│   │   │   ├── reset-password-dialog.jsx # Reset password modal
│   │   │   ├── delete-user-dialog.jsx   # Delete user modal
│   │   │   └── user-activity-logs.jsx   # User activity logs
│   │   ├── task-management/  # Task management components
│   │   │   ├── task-table.jsx           # Task listing table
│   │   │   ├── task-board.jsx           # Kanban board view
│   │   │   ├── task-form-dialog.jsx     # Add/edit task modal
│   │   │   ├── task-details-dialog.jsx  # Task details modal
│   │   │   └── task-delete-dialog.jsx   # Delete task modal
│   │   ├── experiment-management/ # Experiment management components
│   │   │   ├── experiment-list.jsx      # Experiment listing component
│   │   │   ├── experiment-details.jsx   # Experiment details view
│   │   │   ├── protocol-editor.jsx      # Protocol creation/editing
│   │   │   ├── sample-tracker.jsx       # Sample tracking component
│   │   │   └── results-recorder.jsx     # Results recording interface
│   │   ├── inventory-management/ # Inventory management components
│   │   │   ├── inventory-dashboard.jsx  # Inventory overview
│   │   │   ├── reagent-list.jsx         # Reagent listing component
│   │   │   ├── equipment-list.jsx       # Equipment listing component
│   │   │   ├── order-management.jsx     # Order management interface
│   │   │   └── barcode-scanner.jsx      # Barcode scanning component
│   │   ├── layout/           # Layout components
│   │   │   ├── sidebar.jsx             # Main navigation sidebar
│   │   │   ├── header.jsx              # Application header
│   │   │   ├── footer.jsx              # Application footer
│   │   │   └── breadcrumbs.jsx         # Breadcrumb navigation
│   │   └── ui/               # UI components built with ShadCN
│   │       ├── button.jsx
│   │       ├── dialog.jsx
│   │       ├── dropdown-menu.jsx
│   │       ├── input.jsx
│   │       ├── select.jsx
│   │       ├── tabs.jsx
│   │       └── ...                     # Other UI components
│   ├── lib/                 # Utility functions
│   │   ├── utils.js         # Common utility functions
│   │   ├── auth.js          # Authentication utilities
│   │   ├── api.js           # API request helpers
│   │   └── validation.js    # Form validation schemas
│   ├── hooks/               # Custom React hooks
│   │   ├── use-auth.js      # Authentication hook
│   │   ├── use-toast.js     # Toast notification hook
│   │   └── use-form.js      # Form handling hook
│   ├── store/               # State management
│   │   ├── auth-store.js    # Authentication state
│   │   ├── task-store.js    # Task management state
│   │   └── theme-store.js   # Theme preferences state
│   └── assets/              # Local assets
│       ├── animations/      # Lottie animations
│       └── styles/          # Additional styles
├── .next/                   # Next.js build directory
├── package.json             # Project dependencies
└── README.md                # Project documentation
```

## 🧩 Component Descriptions

### Authentication Components
- **Login Form**: Handles user authentication with email/password and social login options
- **Scientific Login Form**: Themed login interface with laboratory aesthetics
- **Register Form**: User registration with role selection and form validation
- **Forgot Password Form**: Password recovery workflow with email verification
- **Two-Factor Form**: Secondary authentication verification for enhanced security

### Dashboard Components
- **Dashboard Layout**: Main layout wrapper for the dashboard interface
- **User Activity**: Displays recent user actions and engagement metrics
- **Task Summary**: Overview of task statuses and completion rates
- **Experiment Progress**: Visual representation of ongoing experiments
- **Compliance Alerts**: Notifications for regulatory and compliance issues
- **System Logs**: Chronological list of system events and activities

### User Management Components
- **User Management**: Container component for user administration features
- **User Table**: Interactive table for viewing and managing users
- **Add/Edit User Dialogs**: Forms for creating and modifying user accounts
- **Reset Password Dialog**: Interface for password reset functionality
- **Delete User Dialog**: Confirmation interface for user deletion
- **User Activity Logs**: Audit trail of user-related actions

### Task Management Components
- **Task Table**: List view of all tasks with sorting and filtering
- **Task Board**: Kanban board interface for visual task management
- **Task Form Dialog**: Creation and editing interface for tasks
- **Task Details Dialog**: Comprehensive view of task information
- **Task Delete Dialog**: Confirmation interface for task deletion

### Experiment Management Components
- **Experiment List**: Overview of all laboratory experiments
- **Experiment Details**: Comprehensive view of experiment information
- **Protocol Editor**: Interface for creating and editing experimental protocols
- **Sample Tracker**: Tool for tracking samples throughout experiments
- **Results Recorder**: Interface for recording experimental results

### Inventory Management Components
- **Inventory Dashboard**: Overview of laboratory inventory status
- **Reagent List**: Management interface for chemical reagents
- **Equipment List**: Management interface for laboratory equipment
- **Order Management**: System for creating and tracking purchase orders
- **Barcode Scanner**: Interface for scanning and processing barcodes

## 📝 Registration Page

![LabTasker Registration Page](https://via.placeholder.com/1200x600/4F46E5/FFFFFF?text=LabTasker+Registration+Page)

The registration page provides a streamlined user onboarding experience with the following features:

- **Clean, Modern Interface**: A visually appealing design with a laboratory-themed illustration
- **Informative Sidebar**: Left panel explaining key platform features:
  - Experiment Tracking: Monitor all physical tests in real-time
  - Sample Management: Track specimens throughout testing lifecycle
  - Data Analysis: Integrated tools for research insights
- **User-Friendly Form**: Intuitive registration form collecting:
  - Full Name: User's complete name
  - Work Email: Professional email address for verification
  - Password: Secure password with strength requirements
  - Password Confirmation: Verification to prevent typos
  - Laboratory Role: Role selection for appropriate permissions
- **Terms of Service**: Clear presentation of legal agreements with links
- **Responsive Design**: Adapts seamlessly to different screen sizes
- **Form Validation**: Real-time validation with helpful error messages
- **Account Recovery**: Option for existing users to sign in

The registration page is designed to collect essential information while providing context about the platform's capabilities, creating a positive first impression for new users.

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

### Experiment Management

1. Navigate to the Experiments section via the sidebar
2. View all experiments in the list or grid view
3. Create new experiments using the guided wizard
4. Track experiment progress and view detailed results
5. Manage samples and protocols associated with experiments
6. Export experiment data for reporting and analysis

### Inventory Management

1. Access the Inventory section from the sidebar
2. View current stock levels and equipment status
3. Add new reagents or equipment to the inventory
4. Track usage and generate purchase orders for low stock items
5. Scan barcodes to quickly update inventory records
6. View usage analytics to optimize inventory management

## 🔒 Security Features

- **Role-Based Access Control**: Different permission levels based on user roles
- **Two-Factor Authentication**: Additional security layer for sensitive accounts
- **Activity Logging**: Comprehensive audit trail of all user management actions
- **Password Security**: Secure password reset workflows
- **Session Management**: Automatic timeout for inactive sessions
- **Data Encryption**: Encryption for sensitive data storage and transmission

## 🧪 Future Enhancements

- **Advanced Analytics Dashboard**: Comprehensive data visualization and reporting
- **Mobile Application**: Native mobile apps for iOS and Android
- **Equipment Integration**: Direct connections to laboratory equipment
- **AI-Powered Insights**: Machine learning for predictive analytics
- **Regulatory Compliance Module**: Tools for managing regulatory requirements
- **Multi-Language Support**: Internationalization for global laboratories
- **Calendar Integration**: Sync with Google Calendar and Outlook

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
- [NextAuth.js](https://next-auth.js.org/)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Query](https://tanstack.com/query/latest)
