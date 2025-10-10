# Database Seeding Scripts

This directory contains scripts to seed the MongoDB database with dummy data for testing and development purposes.

## Files

- `seed-project-data.js` - Seeds the database with comprehensive project data including team members, tasks, documents, milestones, and activity logs.
- `make-admin-power-user.js` - Sets the admin user as a power user

## Prerequisites

1. **MongoDB Running**: Make sure MongoDB is running on your system
2. **Database Connection**: Ensure your MongoDB connection string is properly configured
3. **Dependencies**: All required npm packages should be installed

## Usage

### Option 1: Using npm scripts (Recommended)

Navigate to the backend directory and run:

```bash
# For development (uses local MongoDB)
npm run seed:dev

# For production (uses environment variable)
npm run seed

# Make admin user a power user
node scripts/make-admin-power-user.js
```

### Option 2: Direct execution

```bash
# Navigate to backend directory
cd backend

# Run the seeding script directly
node scripts/seed-project-data.js

# Or with custom MongoDB URI
MONGODB_URI=mongodb://localhost:27017/labtasker node scripts/seed-project-data.js

# Make admin user a power user
node scripts/make-admin-power-user.js
```

## Environment Variables

Set the following environment variable to specify your MongoDB connection:

```bash
MONGODB_URI=mongodb://localhost:27017/labtasker
```

## What Gets Seeded

The script will create a comprehensive project with:

### Project Details
- **Name**: Laboratory Management System (LMS)
- **Status**: In Progress (68% complete)
- **Budget**: $250,000
- **Timeline**: January 2024 - December 2024

### Team Members (6 total)
- Dr. Sarah Chen (Project Lead)
- Michael Rodriguez (Senior Software Engineer)
- Dr. Emily Watson (Research Scientist)
- Alex Thompson (UI/UX Designer)
- Dr. James Wilson (Lab Technician)
- Lisa Park (Data Analyst)

### Tasks (7 total)
- System Architecture Design (Completed)
- Equipment Tracking Module (In Progress - 75%)
- User Interface Design (In Progress - 60%)
- Security Implementation (In Progress - 45%)
- Data Analysis Integration (Not Started)
- Testing Protocol Development (Not Started)
- Documentation and Training (Not Started)

### Documents (8 total)
- System Requirements Specification (PDF)
- Equipment Integration Protocol (DOCX)
- UI Design Mockups (PPTX)
- Database Schema Diagram (XLSX)
- Security Audit Report (PDF - Under Review)
- Lab Equipment Inventory (XLSX)
- Data Analysis Requirements (DOCX)
- Old System Documentation (PDF - Archived)

### Milestones (8 total)
- Project Kickoff (Completed)
- Requirements Finalization (Completed)
- System Architecture Complete (Completed)
- UI/UX Design Complete (In Progress)
- Core Development Phase (In Progress)
- Equipment Integration (Not Started)
- Testing Phase (Not Started)
- System Deployment (Not Started)

### Dependencies (4 total)
- System Architecture → Equipment Tracking
- UI Design → Equipment Tracking
- Equipment Tracking → Testing Protocol
- Security Implementation → Documentation

### Activity Logs (8 total)
- Project creation events
- Task completion updates
- Document uploads and modifications
- Milestone status changes

## make-admin-power-user.js

This script sets the `isPowerUser` field to `true` for the admin user (admin@labtasker.com).

### Purpose:
- Grants power user privileges to the admin user
- Allows access to user management features
- Enables viewing of all users in the system

### Usage:
```bash
node scripts/make-admin-power-user.js
```

### Output:
```
✅ Connected to MongoDB
✅ Found admin user: John Admin (admin@labtasker.com)
Current isPowerUser status: false
✅ Successfully updated admin user to power user
New isPowerUser status: true
```

## Output

The script will display detailed information about what was seeded:

```bash
🚀 Starting project data seeding...

🔌 Connecting to MongoDB...
✅ Connected to MongoDB successfully!
🧹 Clearing existing project data...
✅ Existing project data cleared.
📝 Inserting dummy project data...
✅ Dummy project data inserted successfully!

📊 Project Details:
   Project ID: 64f8a1b2c3d4e5f6a7b8c9d0
   Project Code: LMS-2024-001
   Project Name: Laboratory Management System (LMS)
   Status: In Progress
   Progress: 68%
   Budget: $250,000
   Start Date: 2024-01-15
   End Date: 2024-12-31

👥 Team Information:
   Total Team Members: 6
   Online Members: 4
   Away Members: 1
   Busy Members: 1

📋 Task Information:
   Total Tasks: 7
   Completed Tasks: 1
   In Progress Tasks: 3
   Not Started Tasks: 3

📄 Document Information:
   Total Documents: 8
   Active Documents: 6
   Under Review: 1
   Archived: 1

🎯 Milestone Information:
   Total Milestones: 8
   Completed Milestones: 3
   In Progress Milestones: 2
   Not Started Milestones: 3

🔗 Dependencies:
   Total Dependencies: 4

📝 Activity Logs:
   Total Activity Logs: 8

🔌 Disconnected from MongoDB.

🎉 Seeding completed successfully!
```

## Error Handling

The script includes comprehensive error handling for:

- **Connection Errors**: MongoDB connection issues
- **Validation Errors**: Schema validation failures
- **Duplicate Data**: Handles existing project updates
- **Process Termination**: Graceful shutdown on SIGINT/SIGTERM

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Ensure MongoDB is running
   - Check your connection string
   - Verify network connectivity

2. **Validation Errors**
   - Check the data structure in `dummy-project-data.js`
   - Ensure all required fields are present
   - Verify data types match the schema

3. **Permission Errors**
   - Ensure you have write permissions to the database
   - Check MongoDB user permissions

### Debug Mode

To run with additional debugging:

```bash
DEBUG=mongoose:* npm run seed
```

## Customization

To modify the seeded data:

1. Edit `src/data/dummy-project-data.js`
2. Add new projects or modify existing data
3. Run the seeding script again

## Cleanup

To remove all seeded data:

```bash
# Connect to MongoDB shell
mongosh

# Switch to your database
use labtasker

# Remove all projects
db.projects.deleteMany({})
``` 