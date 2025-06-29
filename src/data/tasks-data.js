// Centralized data file for Tasks section
// This file contains all the hardcoded data that was previously scattered across components

// Mock users for tasks
export const mockTaskUsers = {
    'u1': { id: 'u1', name: 'Dr. Sarah Johnson', avatar: 'SJ', role: 'scientist', email: 'sarah@example.com' },
    'u2': { id: 'u2', name: 'Dr. Michael Lee', avatar: 'ML', role: 'admin', email: 'michael@example.com' },
    'u3': { id: 'u3', name: 'Alex Wong', avatar: 'AW', role: 'technician', email: 'alex@example.com' },
    'u4': { id: 'u4', name: 'Emily Chen', avatar: 'EC', role: 'scientist', email: 'emily@example.com' },
    'u5': { id: 'u5', name: 'James Wilson', avatar: 'JW', role: 'technician', email: 'james@example.com' },
    'user1': { id: 'user1', name: 'John Doe', avatar: 'JD', role: 'Lab Manager', email: 'john@example.com' },
    'user2': { id: 'user2', name: 'Jane Smith', avatar: 'JS', role: 'Senior Researcher', email: 'jane@example.com' },
    'user3': { id: 'user3', name: 'Alex Johnson', avatar: 'AJ', role: 'Lab Technician', email: 'alex.j@example.com' },
    '1': { id: '1', name: 'John Doe', role: 'Lab Manager', email: 'john@example.com', avatar: 'JD' },
    '2': { id: '2', name: 'Jane Smith', role: 'Senior Researcher', email: 'jane@example.com', avatar: 'JS' },
    '3': { id: '3', name: 'Robert Johnson', role: 'Lab Technician', email: 'robert@example.com', avatar: 'RJ' },
    '4': { id: '4', name: 'Emily Davis', role: 'Research Assistant', email: 'emily@example.com', avatar: 'ED' },
    'current-user': { id: 'current-user', name: 'You', avatarUrl: '' }
};

// Mock tasks data
export const mockTasks = [
    {
        id: 't1',
        _id: '1',
        title: 'Analyze blood samples for Project XYZ',
        name: 'Analyze blood samples for Project XYZ',
        description: 'Calibrate and prepare all lab equipment for the upcoming experiment.',
        experimentName: 'Compound A Toxicity Study',
        experimentId: 'e1',
        experiment: 'exp1',
        assignedTo: {
            id: 'u1',
            name: 'Dr. Sarah Johnson',
            avatar: 'SJ'
        },
        assignedToName: 'Dr. Sarah Johnson',
        assigneeId: 'u1',
        priority: 'high',
        status: 'pending',
        dueDate: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        attachments: [
            { id: 'a1', name: 'protocol.pdf', type: 'pdf', size: '2.4 MB' }
        ],
        dependencies: [],
        activityLog: [
            {
                id: 'al1',
                userId: 'u2',
                action: 'created',
                timestamp: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                details: 'Task created'
            }
        ]
    },
    {
        id: 't2',
        _id: '2',
        title: 'Prepare cell cultures for experiment',
        name: 'Prepare cell cultures for experiment',
        description: 'Review and interpret the latest test results from the experiment.',
        experimentName: 'Compound B Efficacy Test',
        experimentId: 'e2',
        experiment: 'exp2',
        assignedTo: {
            id: 'u3',
            name: 'Alex Wong',
            avatar: 'AW'
        },
        assignedToName: 'Alex Wong',
        assigneeId: 'u3',
        priority: 'medium',
        status: 'in-progress',
        dueDate: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        attachments: [],
        dependencies: [],
        activityLog: [
            {
                id: 'al2',
                userId: 'u2',
                action: 'created',
                timestamp: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                details: 'Task created'
            },
            {
                id: 'al3',
                userId: 'u3',
                action: 'updated',
                timestamp: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                details: 'Status changed from "pending" to "in-progress"'
            }
        ]
    },
    {
        id: 't3',
        _id: '3',
        title: 'Document experiment results',
        name: 'Document experiment results',
        description: 'Place an order for new chemicals and lab supplies.',
        experimentName: 'Compound A Toxicity Study',
        experimentId: 'e1',
        experiment: 'exp3',
        assignedTo: {
            id: 'u4',
            name: 'Emily Chen',
            avatar: 'EC'
        },
        assignedToName: 'Emily Chen',
        assigneeId: 'u4',
        priority: 'low',
        status: 'completed',
        dueDate: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        attachments: [
            { id: 'a2', name: 'results.xlsx', type: 'excel', size: '1.2 MB' },
            { id: 'a3', name: 'images.zip', type: 'zip', size: '18.5 MB' }
        ],
        dependencies: ['t1'],
        activityLog: [
            {
                id: 'al4',
                userId: 'u2',
                action: 'created',
                timestamp: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                details: 'Task created'
            },
            {
                id: 'al5',
                userId: 'u4',
                action: 'updated',
                timestamp: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                details: 'Status changed from "pending" to "in-progress"'
            },
            {
                id: 'al6',
                userId: 'u4',
                action: 'updated',
                timestamp: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                details: 'Status changed from "in-progress" to "completed"'
            }
        ]
    },
    {
        id: 't4',
        _id: '4',
        title: 'Set up equipment for microscopy',
        name: 'Set up equipment for microscopy',
        description: 'Calibrate all measurement instruments for accuracy.',
        experimentName: 'Compound C Cellular Study',
        experimentId: 'e3',
        experiment: 'exp1',
        assignedTo: {
            id: 'u5',
            name: 'James Wilson',
            avatar: 'JW'
        },
        assignedToName: 'James Wilson',
        assigneeId: 'u5',
        priority: 'high',
        status: 'in-progress',
        dueDate: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        attachments: [
            { id: 'a4', name: 'equipment_manual.pdf', type: 'pdf', size: '4.8 MB' }
        ],
        dependencies: [],
        activityLog: [
            {
                id: 'al7',
                userId: 'u1',
                action: 'created',
                timestamp: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                details: 'Task created'
            },
            {
                id: 'al8',
                userId: 'u5',
                action: 'updated',
                timestamp: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                details: 'Status changed from "pending" to "in-progress"'
            }
        ]
    },
    {
        id: 't5',
        _id: '5',
        title: 'Analyze data from previous experiment',
        name: 'Analyze data from previous experiment',
        description: 'Update the documentation for all lab procedures performed this week.',
        experimentName: 'Compound B Efficacy Test',
        experimentId: 'e2',
        experiment: 'exp2',
        assignedTo: {
            id: 'u1',
            name: 'Dr. Sarah Johnson',
            avatar: 'SJ'
        },
        assignedToName: 'Dr. Sarah Johnson',
        assigneeId: 'u1',
        priority: 'medium',
        status: 'pending',
        dueDate: new Date(new Date().getTime() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        attachments: [],
        dependencies: ['t2'],
        activityLog: [
            {
                id: 'al9',
                userId: 'u2',
                action: 'created',
                timestamp: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                details: 'Task created'
            }
        ]
    },
    {
        id: 't6',
        title: 'Prepare equipment for next experiment',
        name: 'Prepare equipment for next experiment',
        description: 'Prepare equipment for the next experiment phase.',
        experimentName: 'Compound C Cellular Study',
        experimentId: 'e3',
        experiment: 'exp3',
        assignedTo: {
            id: 'u3',
            name: 'Alex Wong',
            avatar: 'AW'
        },
        assignedToName: 'Alex Wong',
        assigneeId: 'u3',
        priority: 'high',
        status: 'pending',
        dueDate: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        attachments: [],
        dependencies: [],
        activityLog: [
            {
                id: 'al10',
                userId: 'u1',
                action: 'created',
                timestamp: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                details: 'Task created'
            }
        ]
    }
];

// Task templates data
export const taskTemplates = [
    {
        id: "template1",
        name: "Quality Control Check",
        description: "Template for standard quality control tasks that occur weekly",
        defaultPriority: "medium",
        defaultStatus: "pending",
        defaultAssigneeRole: "technician",
        categoryTags: ["quality", "routine", "weekly"],
        createdAt: "2025-02-15T08:30:00Z",
        updatedAt: "2025-03-01T11:45:00Z",
        createdBy: "u1"
    },
    {
        id: "template2",
        name: "Experiment Setup",
        description: "Template for setting up new scientific experiments",
        defaultPriority: "high",
        defaultStatus: "pending",
        defaultAssigneeRole: "scientist",
        categoryTags: ["experiment", "setup", "preparation"],
        createdAt: "2025-02-05T14:15:00Z",
        updatedAt: "2025-02-20T09:30:00Z",
        createdBy: "u3"
    },
    {
        id: "template3",
        name: "Lab Maintenance",
        description: "Template for monthly lab equipment maintenance tasks",
        defaultPriority: "low",
        defaultStatus: "pending",
        defaultAssigneeRole: "technician",
        categoryTags: ["maintenance", "monthly", "equipment"],
        createdAt: "2025-01-10T10:00:00Z",
        updatedAt: "2025-03-05T15:20:00Z",
        createdBy: "u2"
    },
    {
        id: "template4",
        name: "Regulatory Documentation",
        description: "Template for regulatory compliance documentation tasks",
        defaultPriority: "critical",
        defaultStatus: "pending",
        defaultAssigneeRole: "admin",
        categoryTags: ["regulatory", "documentation", "compliance"],
        createdAt: "2025-02-25T16:45:00Z",
        updatedAt: "2025-03-10T13:10:00Z",
        createdBy: "u1"
    }
];

// Mock activity log
export const mockActivityLog = [
    {
        id: "act1",
        userId: "2",
        action: "created",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        details: "Created the task and assigned to Robert Johnson"
    },
    {
        id: "act2",
        userId: "3",
        action: "updated",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        details: "Changed status from 'Pending' to 'In Progress'"
    },
    {
        id: "act3",
        userId: "1",
        action: "commented",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        details: "Please make sure to document all findings in the shared lab notebook."
    },
    {
        id: "act4",
        userId: "3",
        action: "updated",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        details: "Completed subtask: 'Clean optical components'"
    }
];

// Mock attachments
export const mockAttachments = [
    {
        id: "att1",
        name: "Experiment Protocol.pdf",
        type: "pdf",
        size: "2.4 MB",
        uploadedBy: "2",
        uploadedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
    },
    {
        id: "att2",
        name: "Sample Images.zip",
        type: "zip",
        size: "14.8 MB",
        uploadedBy: "1",
        uploadedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
    },
    {
        id: "att3",
        name: "Equipment Manual.pdf",
        type: "pdf",
        size: "5.1 MB",
        uploadedBy: "3",
        uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    }
];

// Task status configurations
export const taskStatusConfig = {
    'pending': {
        label: 'Pending',
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: 'Clock'
    },
    'in-progress': {
        label: 'In Progress',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: 'Loader2'
    },
    'completed': {
        label: 'Completed',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: 'CheckCircle2'
    },
    'cancelled': {
        label: 'Cancelled',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: 'XCircle'
    },
    'on-hold': {
        label: 'On Hold',
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: 'Pause'
    }
};

// Task priority configurations
export const taskPriorityConfig = {
    'low': {
        label: 'Low',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: 'ArrowDown'
    },
    'medium': {
        label: 'Medium',
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: 'Minus'
    },
    'high': {
        label: 'High',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: 'ArrowUp'
    },
    'critical': {
        label: 'Critical',
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: 'AlertTriangle'
    }
};

// Task status options
export const taskStatuses = [
    { value: "pending", label: "Pending" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "on-hold", label: "On Hold" }
];

// Task priority options
export const taskPriorities = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" }
];

// Subtask priorities
export const subtaskPriorities = ["high", "medium", "low"];

// Subtask statuses
export const subtaskStatuses = ["not_started", "in_progress", "completed"];

// Week days for heatmap
export const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Task order for sorting
export const taskOrder = ["backlog", "in_progress", "completed"];

// Avatar colors for task assignees
export const avatarColors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-cyan-500',
    'bg-amber-500',
    'bg-emerald-500',
    'bg-violet-500',
    'bg-rose-500'
];

// User status colors
export const userStatusColors = {
    'online': 'bg-green-400 border-green-300',
    'away': 'bg-yellow-400 border-yellow-300',
    'busy': 'bg-red-400 border-red-300',
    'offline': 'bg-gray-300 border-gray-200'
};

// Avatar size classes
export const avatarSizeClasses = {
    'sm': 'h-6 w-6 text-xs',
    'md': 'h-8 w-8 text-sm',
    'lg': 'h-10 w-10 text-base',
    'xl': 'h-12 w-12 text-lg'
};

// Avatar variant classes
export const avatarVariantClasses = {
    'default': 'bg-gray-100 text-gray-600',
    'primary': 'bg-blue-100 text-blue-600',
    'secondary': 'bg-purple-100 text-purple-600',
    'success': 'bg-green-100 text-green-600',
    'warning': 'bg-yellow-100 text-yellow-600',
    'danger': 'bg-red-100 text-red-600'
};

// Task categories
export const taskCategories = [
    "Quality Control",
    "Experiment Setup",
    "Data Analysis",
    "Equipment Maintenance",
    "Documentation",
    "Sample Preparation",
    "Safety Protocols",
    "Regulatory Compliance",
    "Research",
    "Training"
];

// Task tags
export const taskTags = [
    "urgent",
    "routine",
    "weekly",
    "monthly",
    "quarterly",
    "annual",
    "safety",
    "compliance",
    "research",
    "development",
    "testing",
    "validation",
    "calibration",
    "cleaning",
    "inspection"
];

// Task suggestions for search
export const taskSuggestions = [
    "Prepare lab equipment",
    "Analyze test results",
    "Order new supplies",
    "Calibrate instruments",
    "Document procedures",
    "Review safety protocols",
    "Update documentation",
    "Conduct experiments",
    "Process samples",
    "Generate reports"
];

// Status options for dialogs (for TaskDetailsDialog)
export const statusOptions = [
    {
        value: 'backlog',
        label: 'Backlog',
        icon: 'CircleDashed',
        color: 'text-muted-foreground bg-muted hover:bg-muted/80',
        bgColor: 'bg-muted',
        textColor: 'text-muted-foreground',
        borderColor: 'border-muted-foreground/20'
    },
    {
        value: 'todo',
        label: 'To Do',
        icon: 'Circle',
        color: 'text-blue-600 bg-blue-50 hover:bg-blue-100',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200'
    },
    {
        value: 'in_progress',
        label: 'In Progress',
        icon: 'Clock',
        color: 'text-amber-600 bg-amber-50 hover:bg-amber-100',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-700',
        borderColor: 'border-amber-200'
    },
    {
        value: 'in_review',
        label: 'In Review',
        icon: 'Eye',
        color: 'text-purple-600 bg-purple-50 hover:bg-purple-100',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-700',
        borderColor: 'border-purple-200'
    },
    {
        value: 'done',
        label: 'Done',
        icon: 'CheckCircle',
        color: 'text-green-600 bg-green-50 hover:bg-green-100',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        borderColor: 'border-green-200'
    },
];

export const priorityOptions = [
    {
        value: 'none',
        label: 'None',
        icon: 'CircleDashed',
        color: 'text-muted-foreground bg-muted hover:bg-muted/80',
        bgColor: 'bg-muted',
        textColor: 'text-muted-foreground',
        borderColor: 'border-muted-foreground/20'
    },
    {
        value: 'low',
        label: 'Low',
        icon: 'ArrowDown',
        color: 'text-blue-600 bg-blue-50 hover:bg-blue-100',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200'
    },
    {
        value: 'medium',
        label: 'Medium',
        icon: 'ArrowRight',
        color: 'text-amber-600 bg-amber-50 hover:bg-amber-100',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-700',
        borderColor: 'border-amber-200'
    },
    {
        value: 'high',
        label: 'High',
        icon: 'ArrowUp',
        color: 'text-orange-600 bg-orange-50 hover:bg-orange-100',
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-700',
        borderColor: 'border-orange-200'
    },
    {
        value: 'urgent',
        label: 'Urgent',
        icon: 'AlertTriangle',
        color: 'text-red-600 bg-red-50 hover:bg-red-100',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
        borderColor: 'border-red-200'
    },
];

export const dialogTaskTemplates = [
    {
        id: 'bug-report',
        name: 'Bug Report',
        icon: 'Bug',
        template: {
            title: 'Bug: [Brief description]',
            description: '## Bug Description\n\n### Steps to Reproduce\n1. \n2. \n3. \n\n### Expected Behavior\n\n### Actual Behavior\n\n### Environment\n- OS: \n- Browser: \n- Version: \n\n### Additional Information\n',
            type: 'bug',
            priority: 'high'
        }
    },
    {
        id: 'feature-request',
        name: 'Feature Request',
        icon: 'Sparkles',
        template: {
            title: 'Feature: [Feature name]',
            description: '## Feature Description\n\n### Problem Statement\n\n### Proposed Solution\n\n### Benefits\n\n### Implementation Notes\n\n### Acceptance Criteria\n- [ ] \n- [ ] \n- [ ] ',
            type: 'feature',
            priority: 'medium'
        }
    },
    {
        id: 'task-template',
        name: 'General Task',
        icon: 'FileText',
        template: {
            title: 'Task: [Task description]',
            description: '## Task Overview\n\n### Objectives\n\n### Requirements\n\n### Deliverables\n\n### Timeline\n\n### Notes\n',
            type: 'task',
            priority: 'medium'
        }
    },
    {
        id: 'improvement',
        name: 'Improvement',
        icon: 'Zap',
        template: {
            title: 'Improve: [Area to improve]',
            description: '## Current State\n\n### Issues\n\n### Proposed Improvements\n\n### Benefits\n\n### Implementation Plan\n',
            type: 'improvement',
            priority: 'low'
        }
    }
]; 