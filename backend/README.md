# LabTasker Backend API

A comprehensive backend API for the LabTasker laboratory management system built with Node.js, Express, and MongoDB.

## Features

### Core Modules
- **Authentication & Authorization** - JWT-based auth with role-based access control
- **User Management** - Complete CRUD operations for user accounts
- **Project Management** - Project lifecycle management with team collaboration
- **Task Management** - Task tracking with subtasks, comments, and file attachments
- **Experiment Management** - Laboratory experiment tracking and documentation
- **Equipment Management** - Laboratory equipment inventory and maintenance
- **Protocol Management** - Standard operating procedures and protocols
- **Inventory Management** - Chemical and supply inventory with stock tracking
- **Compliance Management** - Regulatory compliance tracking and auditing
- **Notification System** - Real-time notifications and alerts
- **Dashboard Analytics** - Comprehensive reporting and analytics
- **File Management** - Document upload and management system
- **Report Generation** - Export data in CSV, Excel, PDF, and JSON formats

### API Endpoints

#### Authentication (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /profile` - Get user profile
- `POST /change-password` - Change password

#### Users (`/api/users`)
- `GET /` - Get all users (with filtering and pagination)
- `GET /stats` - Get user statistics
- `GET /:id` - Get user by ID
- `GET /:id/activity` - Get user activity logs
- `POST /` - Create new user
- `PUT /:id` - Update user
- `DELETE /:id` - Delete user
- `PATCH /:id/activate` - Activate user
- `PATCH /:id/deactivate` - Deactivate user
- `PATCH /:id/lock` - Lock user account
- `PATCH /:id/unlock` - Unlock user account
- `PATCH /:id/reset-password` - Reset user password
- `POST /invite` - Invite new user

#### Projects (`/api/projects`)
- `GET /` - Get all projects
- `GET /:id` - Get project by ID
- `POST /` - Create new project
- `PUT /:id` - Update project
- `DELETE /:id` - Delete project
- `GET /:id/export` - Export project data
- `POST /:id/tasks` - Add task to project
- `POST /:id/members` - Add member to project
- `POST /:id/documents` - Upload document to project
- `DELETE /:id/tasks/:taskId` - Delete task from project

#### Tasks (`/api/tasks`)
- `GET /` - Get all tasks (with filtering)
- `GET /:id` - Get task by ID
- `POST /` - Create new task
- `PUT /:id` - Update task
- `DELETE /:id` - Delete task
- `POST /:id/subtasks` - Add subtask
- `PUT /:id/subtasks/:subtaskId` - Update subtask
- `DELETE /:id/subtasks/:subtaskId` - Delete subtask
- `POST /:id/comments` - Add comment
- `GET /:id/comments` - Get comments
- `PUT /:id/comments/:commentId` - Update comment
- `DELETE /:id/comments/:commentId` - Delete comment
- `POST /:id/files` - Upload file
- `GET /:id/files` - Get files
- `DELETE /:id/files/:fileId` - Delete file
- `PATCH /:id/assignee` - Update assignee
- `GET /:id/activity` - Get activity log
- `GET /:id/related` - Get related tasks

#### Experiments (`/api/experiments`)
- `GET /` - Get all experiments (with filtering and sorting)
- `GET /stats` - Get experiment statistics
- `GET /:id` - Get experiment by ID
- `POST /` - Create new experiment
- `PUT /:id` - Update experiment
- `DELETE /:id` - Delete experiment

#### Equipment (`/api/equipments`)
- `GET /` - Get all equipment
- `GET /:id` - Get equipment by ID
- `POST /` - Create new equipment
- `PUT /:id` - Update equipment
- `DELETE /:id` - Delete equipment
- `POST /:id/files` - Upload equipment file

#### Protocols (`/api/protocols`)
- `GET /` - Get all protocols (with filtering and pagination)
- `GET /:id` - Get protocol by ID
- `POST /` - Create new protocol
- `PUT /:id` - Update protocol
- `DELETE /:id` - Delete protocol
- `PUT /:id/archive` - Archive protocol
- `PUT /:id/restore` - Restore protocol
- `POST /:id/duplicate` - Duplicate protocol

#### Inventory (`/api/inventory`)
- **Items**
  - `GET /items` - Get all inventory items
  - `GET /items/low-stock` - Get low stock items
  - `GET /items/expiring` - Get expiring items
  - `GET /items/:id` - Get item by ID
  - `POST /items` - Create new item
  - `PUT /items/:id` - Update item
  - `DELETE /items/:id` - Delete item
  - `PATCH /items/:id/stock` - Update stock levels

- **Suppliers**
  - `GET /suppliers` - Get all suppliers
  - `GET /suppliers/:id` - Get supplier by ID
  - `POST /suppliers` - Create new supplier
  - `PUT /suppliers/:id` - Update supplier
  - `DELETE /suppliers/:id` - Delete supplier

- **Warehouses**
  - `GET /warehouses` - Get all warehouses
  - `GET /warehouses/:id` - Get warehouse by ID
  - `POST /warehouses` - Create new warehouse
  - `PUT /warehouses/:id` - Update warehouse
  - `DELETE /warehouses/:id` - Delete warehouse

- **Orders**
  - `GET /orders` - Get all orders
  - `GET /orders/:id` - Get order by ID
  - `POST /orders` - Create new order
  - `PUT /orders/:id` - Update order
  - `DELETE /orders/:id` - Delete order
  - `PATCH /orders/:id/approve` - Approve order
  - `PATCH /orders/:id/receive` - Receive order

- **Statistics**
  - `GET /stats` - Get inventory statistics

#### Compliance (`/api/compliance`)
- **Items**
  - `GET /items` - Get all compliance items
  - `GET /items/:id` - Get compliance item by ID
  - `POST /items` - Create new compliance item
  - `PUT /items/:id` - Update compliance item
  - `DELETE /items/:id` - Delete compliance item
  - `POST /items/:id/actions` - Add compliance action
  - `PUT /items/:id/actions/:actionId` - Update compliance action

- **Audits**
  - `GET /audits` - Get all audits
  - `GET /audits/:id` - Get audit by ID
  - `POST /audits` - Create new audit
  - `PUT /audits/:id` - Update audit
  - `DELETE /audits/:id` - Delete audit

- **Training**
  - `GET /training` - Get all training records
  - `GET /training/:id` - Get training record by ID
  - `POST /training` - Create new training record
  - `PUT /training/:id` - Update training record
  - `DELETE /training/:id` - Delete training record
  - `PATCH /training/:id/attendees/:attendeeId` - Update attendee status

- **Statistics**
  - `GET /stats` - Get compliance statistics

#### Notifications (`/api/notifications`)
- `GET /user/:userId` - Get user notifications
- `GET /user/:userId/stats` - Get notification statistics
- `GET /user/:userId/unread-count` - Get unread count
- `GET /:id` - Get notification by ID
- `POST /` - Create new notification
- `POST /bulk` - Send bulk notifications
- `PATCH /:id/read` - Mark notification as read
- `PATCH /user/:userId/read-all` - Mark all as read
- `DELETE /:id` - Delete notification
- `DELETE /user/:userId/all` - Delete all notifications

#### Dashboard (`/api/dashboard`)
- `GET /stats` - Get dashboard overview stats
- `GET /task-distribution` - Get task distribution data
- `GET /recent-activities` - Get recent activities
- `GET /team-performance` - Get team performance data
- `GET /project-health` - Get project health data
- `GET /experiment-progress` - Get experiment progress data
- `GET /user-activity` - Get user activity data
- `GET /compliance-alerts` - Get compliance alerts
- `GET /system-logs` - Get system logs
- `GET /task-heatmap` - Get task heatmap data

#### Files (`/api/files`)
- `POST /upload` - Upload single file
- `POST /upload-multiple` - Upload multiple files
- `GET /:filename` - Serve file
- `GET /:filename/info` - Get file info
- `DELETE /:filename` - Delete file
- `GET /` - List all files

#### Reports (`/api/reports`)
- `GET /projects` - Generate project report
- `GET /tasks` - Generate task report
- `GET /inventory` - Generate inventory report
- `GET /users` - Generate user report
- `GET /compliance` - Generate compliance report
- `GET /experiments` - Generate experiment report
- `GET /dashboard` - Generate dashboard summary report

All report endpoints support format query parameter: `?format=json|csv|xlsx|pdf`

#### Enquiries (`/api/enquiries`)
- `GET /` - Get all enquiries
- `GET /:id` - Get enquiry by ID
- `POST /` - Create new enquiry
- `PUT /:id` - Update enquiry
- `DELETE /:id` - Delete enquiry

#### Activities (`/api/activities`)
- Activity logging endpoints (implementation varies)

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd labtasker/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/labtasker
   
   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key-here
   
   # Server Port
   PORT=5000
   
   # Node Environment
   NODE_ENV=development
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Seed the database (optional)**
   ```bash
   # Seed with comprehensive sample data
   npm run seed:all
   
   # Or for development with local MongoDB
   npm run seed:all:dev
   ```

6. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000` (or the port specified in your .env file).

## Database Models

### User
- Authentication and profile information
- Role-based access control
- Department and contact details
- Preferences and settings

### Project
- Project metadata and timeline
- Team member assignments
- Task and document management
- Progress tracking and dependencies

### Task
- Task details and status
- Subtasks and comments
- File attachments
- Activity logging

### Experiment
- Experiment protocols and procedures
- Team member assignments
- Version history and tracking
- Results and documentation

### Equipment
- Equipment inventory and specifications
- Maintenance schedules and records
- File attachments and documentation

### Protocol
- Standard operating procedures
- Step-by-step instructions
- Materials and safety notes
- Version control and sharing

### Inventory
- **InventoryItem**: Chemical and supply inventory
- **Supplier**: Vendor information and contacts
- **Warehouse**: Storage location management
- **Order**: Purchase order tracking

### Compliance
- **ComplianceItem**: Regulatory compliance tracking
- **Audit**: Audit records and findings
- **TrainingRecord**: Training and certification tracking

### Notification
- System and user notifications
- Priority and category management
- Read status and expiration

### Enquiry
- Customer enquiry management
- Document and activity tracking
- Status and priority management

## Authentication & Authorization

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles
- **Admin**: Full system access
- **Scientist**: Research and experiment management
- **Technician**: Laboratory operations
- **Reviewer**: Quality assurance and compliance
- **User**: Basic system access

## File Upload

The system supports file uploads for:
- Project documents
- Task attachments
- Equipment documentation
- Compliance evidence
- Protocol materials

**Supported file types:**
- Images: JPEG, PNG, GIF
- Documents: PDF, DOC, DOCX, XLS, XLSX
- Text: TXT, CSV

**File size limit:** 10MB per file

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message description",
  "code": "ERROR_CODE",
  "details": "Additional error details (optional)"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Development

### Running Tests
```bash
npm test
```

### Code Structure
```
backend/
├── controllers/     # Request handlers and business logic
├── models/         # MongoDB schemas and models
├── routes/         # API route definitions
├── middleware/     # Custom middleware functions
├── scripts/        # Database seeding and utility scripts
├── uploads/        # File upload storage
├── test/          # Test files
├── app.js         # Main application file
└── package.json   # Dependencies and scripts
```

### Adding New Features

1. **Create Model** (if needed)
   - Define schema in `models/`
   - Add validation and middleware

2. **Create Controller**
   - Implement business logic in `controllers/`
   - Handle CRUD operations

3. **Define Routes**
   - Create route file in `routes/`
   - Define API endpoints

4. **Register Routes**
   - Add routes to `app.js`

5. **Test**
   - Write tests in `test/`
   - Test API endpoints

## Production Deployment

### Environment Variables
Set the following environment variables for production:

```env
NODE_ENV=production
MONGODB_URI=mongodb://your-production-db-url
JWT_SECRET=your-production-jwt-secret
PORT=5000
```

### Security Considerations
- Use strong JWT secrets
- Enable HTTPS in production
- Implement rate limiting
- Validate all inputs
- Use environment variables for sensitive data
- Enable CORS only for trusted domains

### Performance Optimization
- Use MongoDB indexes for frequently queried fields
- Implement caching for static data
- Use compression middleware
- Optimize file upload handling
- Monitor database performance

## API Documentation

For detailed API documentation with request/response examples, consider using tools like:
- Swagger/OpenAPI
- Postman Collections
- API Blueprint

## Support

For issues and questions:
1. Check the error logs
2. Verify database connection
3. Ensure all environment variables are set
4. Check MongoDB service status
5. Review API endpoint documentation

## License

This project is licensed under the MIT License.