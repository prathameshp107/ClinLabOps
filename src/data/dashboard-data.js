/**
 * Dashboard Data
 * This file contains all the mock data used in the dashboard components
 */

// Quick Actions data
export const quickActionsData = [
    {
        id: 1,
        title: "Create Task",
        description: "Add a new task to the system",
        icon: "Plus",
        color: "bg-blue-500",
        link: "/tasks/new"
    },
    {
        id: 2,
        title: "Start Experiment",
        description: "Begin a new laboratory experiment",
        icon: "Flask",
        color: "bg-purple-500",
        link: "/experiments/new"
    },
    {
        id: 3,
        title: "Inventory Check",
        description: "Review current inventory status",
        icon: "Package",
        color: "bg-green-500",
        link: "/inventory"
    },
    {
        id: 4,
        title: "Generate Report",
        description: "Create a new report from templates",
        icon: "FileText",
        color: "bg-amber-500",
        link: "/reports/new"
    }
];

// Tasks Overview data
export const tasksOverviewData = {
    total: 24,
    completed: 14,
    inProgress: 7,
    pending: 3,
    overdue: 2,
    recentTasks: [
        {
            id: 1,
            title: "Sample preparation for PCR analysis",
            status: "completed",
            dueDate: "2023-03-28",
            priority: "high",
            assignee: "Alex Johnson"
        },
        {
            id: 2,
            title: "Calibrate mass spectrometer",
            status: "in-progress",
            dueDate: "2023-03-30",
            priority: "medium",
            assignee: "Maria Garcia"
        },
        {
            id: 3,
            title: "Review quality control data",
            status: "pending",
            dueDate: "2023-04-01",
            priority: "high",
            assignee: "David Kim"
        }
    ]
};

// Pending Approvals data

export const pendingApprovalsData = [
    {
        id: "task-1",
        name: "PCR Validation for Sample Set A",
        submitter: {
            name: "Sarah Miller",
            email: "sarah.miller@labtasker.com",
            avatar: "/avatars/sarah.png"
        },
        submitted: "2025-03-22T14:32:45",
        priority: "high",
        type: "validation"
    },
    {
        id: "task-2",
        name: "Reagent Order for Cell Culture Lab",
        submitter: {
            name: "David Chen",
            email: "david.chen@labtasker.com",
            avatar: "/avatars/david.png"
        },
        submitted: "2025-03-22T12:45:30",
        priority: "medium",
        type: "purchase"
    },
    {
        id: "task-3",
        name: "Equipment Calibration Report Review",
        submitter: {
            name: "Alex Johnson",
            email: "alex.johnson@labtasker.com",
            avatar: "/avatars/alex.png"
        },
        submitted: "2025-03-22T11:20:15",
        priority: "low",
        type: "maintenance"
    },
    {
        id: "task-4",
        name: "Experimental Protocol Update for Assay B",
        submitter: {
            name: "Emily Wong",
            email: "emily.wong@labtasker.com",
            avatar: "/avatars/emily.png"
        },
        submitted: "2025-03-21T17:10:22",
        priority: "medium",
        type: "protocol"
    },
    {
        id: "task-5",
        name: "New User Access Request for Sequencing Lab",
        submitter: {
            name: "James Rivera",
            email: "james.rivera@labtasker.com",
            avatar: "/avatars/james.png"
        },
        submitted: "2025-03-21T16:05:40",
        priority: "high",
        type: "access"
    }
]

// User Activity data
export const userActivityData = [
    {
        id: 1,
        user: {
            name: "Alex Johnson",
            avatar: "/avatars/alex.jpg"
        },
        action: "completed",
        item: "Sample preparation",
        timestamp: "2023-03-28T14:30:00Z"
    },
    {
        id: 2,
        user: {
            name: "Maria Garcia",
            avatar: "/avatars/maria.jpg"
        },
        action: "started",
        item: "Calibration procedure",
        timestamp: "2023-03-28T13:15:00Z"
    },
    {
        id: 3,
        user: {
            name: "David Kim",
            avatar: "/avatars/david.jpg"
        },
        action: "updated",
        item: "Quality control report",
        timestamp: "2023-03-28T11:45:00Z"
    },
    {
        id: 4,
        user: {
            name: "Sarah Chen",
            avatar: "/avatars/sarah.jpg"
        },
        action: "requested",
        item: "Experiment approval",
        timestamp: "2023-03-28T10:20:00Z"
    }
];

// Experiment Progress data
export const experimentProgressData = [
    {
        id: 1,
        title: "Protein Expression Analysis",
        startDate: "2023-03-20",
        endDate: "2023-04-10",
        progress: 65,
        status: "in-progress",
        lead: "Maria Garcia",
        phases: [
            { name: "Sample Prep", status: "completed", progress: 100 },
            { name: "Initial Analysis", status: "completed", progress: 100 },
            { name: "Data Collection", status: "in-progress", progress: 60 },
            { name: "Verification", status: "not-started", progress: 0 },
            { name: "Reporting", status: "not-started", progress: 0 }
        ]
    },
    {
        id: 2,
        title: "Enzyme Kinetics Study",
        startDate: "2023-03-15",
        endDate: "2023-04-05",
        progress: 40,
        status: "in-progress",
        lead: "Sarah Chen",
        phases: [
            { name: "Protocol Setup", status: "completed", progress: 100 },
            { name: "Initial Runs", status: "completed", progress: 100 },
            { name: "Data Collection", status: "in-progress", progress: 30 },
            { name: "Analysis", status: "not-started", progress: 0 },
            { name: "Reporting", status: "not-started", progress: 0 }
        ]
    }
];

// Task Heatmap data
export const taskHeatmapData = {
    weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    hours: [9, 10, 11, 12, 13, 14, 15, 16, 17],
    data: [
        // Format: [hour_index, day_index, intensity]
        [0, 0, 5], [0, 1, 7], [0, 2, 3], [0, 3, 5], [0, 4, 8], [0, 5, 2], [0, 6, 1],
        [1, 0, 6], [1, 1, 4], [1, 2, 7], [1, 3, 8], [1, 4, 5], [1, 5, 3], [1, 6, 2],
        [2, 0, 8], [2, 1, 7], [2, 2, 6], [2, 3, 4], [2, 4, 3], [2, 5, 2], [2, 6, 1],
        [3, 0, 3], [3, 1, 2], [3, 2, 1], [3, 3, 2], [3, 4, 3], [3, 5, 1], [3, 6, 0],
        [4, 0, 6], [4, 1, 5], [4, 2, 7], [4, 3, 8], [4, 4, 6], [4, 5, 3], [4, 6, 2],
        [5, 0, 9], [5, 1, 8], [5, 2, 7], [5, 3, 6], [5, 4, 5], [5, 5, 4], [5, 6, 3],
        [6, 0, 7], [6, 1, 6], [6, 2, 5], [6, 3, 4], [6, 4, 3], [6, 5, 2], [6, 6, 1],
        [7, 0, 4], [7, 1, 5], [7, 2, 6], [7, 3, 7], [7, 4, 8], [7, 5, 3], [7, 6, 2],
        [8, 0, 3], [8, 1, 4], [8, 2, 5], [8, 3, 6], [8, 4, 7], [8, 5, 2], [8, 6, 1]
    ]
};

// Compliance Alerts data
export const complianceAlertsData = [
    {
        id: 1,
        title: "Safety Protocol Review Due",
        description: "Annual safety protocol review is due in 5 days",
        severity: "medium",
        dueDate: "2023-04-02",
        assignee: "Lab Safety Officer"
    },
    {
        id: 2,
        title: "Equipment Calibration Overdue",
        description: "Mass spectrometer calibration is 2 days overdue",
        severity: "high",
        dueDate: "2023-03-26",
        assignee: "Equipment Manager"
    },
    {
        id: 3,
        title: "Waste Disposal Documentation",
        description: "Chemical waste disposal records need updating",
        severity: "low",
        dueDate: "2023-04-05",
        assignee: "Environmental Compliance"
    }
];

// Notification Center data
export const notificationCenterData = [
    {
        id: 1,
        title: "Task Assigned",
        message: "You have been assigned to 'Sample preparation for GC-MS'",
        timestamp: "2023-03-28T15:30:00Z",
        read: false,
        type: "task"
    },
    {
        id: 2,
        title: "Experiment Completed",
        message: "Protein Analysis experiment has been marked as complete",
        timestamp: "2023-03-28T14:15:00Z",
        read: false,
        type: "experiment"
    },
    {
        id: 3,
        title: "Approval Request",
        message: "Sarah Chen requested your approval for 'Enzyme Kinetics Study'",
        timestamp: "2023-03-28T10:20:00Z",
        read: false,
        type: "approval"
    },
    {
        id: 4,
        title: "Inventory Alert",
        message: "Low stock alert: Methanol (2L remaining)",
        timestamp: "2023-03-27T16:45:00Z",
        read: true,
        type: "inventory"
    },
    {
        id: 5,
        title: "System Maintenance",
        message: "Scheduled maintenance on April 2nd, 8:00 PM - 10:00 PM",
        timestamp: "2023-03-27T09:30:00Z",
        read: true,
        type: "system"
    }
];

// System Logs data
export const systemLogsData = [
    {
        id: 1,
        event: "User Login",
        user: "Alex Johnson",
        timestamp: "2023-03-28T15:45:23Z",
        details: "Successful login from 192.168.1.105",
        level: "info"
    },
    {
        id: 2,
        event: "Experiment Started",
        user: "Maria Garcia",
        timestamp: "2023-03-28T14:32:17Z",
        details: "Experiment #EXP-2023-042 initiated",
        level: "info"
    },
    {
        id: 3,
        event: "Data Export",
        user: "David Kim",
        timestamp: "2023-03-28T13:15:09Z",
        details: "Exported analysis results to LIMS",
        level: "info"
    },
    {
        id: 4,
        event: "Permission Change",
        user: "Admin",
        timestamp: "2023-03-28T11:47:32Z",
        details: "Updated access rights for Research Group B",
        level: "warning"
    },
    {
        id: 5,
        event: "System Error",
        user: "System",
        timestamp: "2023-03-28T10:23:45Z",
        details: "Database connection timeout - auto-recovered",
        level: "error"
    },
    {
        id: 6,
        event: "Backup Completed",
        user: "System",
        timestamp: "2023-03-28T03:00:12Z",
        details: "Daily backup completed successfully",
        level: "info"
    }
];

// Smart Insights data
export const smartInsightsData = {
    productivityScore: 87,
    tasksCompletedThisWeek: 32,
    tasksCompletedLastWeek: 28,
    experimentSuccessRate: 92,
    upcomingDeadlines: 5,
    resourceUtilization: 78,
    insights: [
        {
            id: 1,
            title: "Productivity Increase",
            description: "Task completion rate increased by 14% compared to last week",
            type: "positive"
        },
        {
            id: 2,
            title: "Resource Optimization",
            description: "Equipment scheduling conflicts reduced by 23% this month",
            type: "positive"
        },
        {
            id: 3,
            title: "Attention Needed",
            description: "3 high-priority tasks are approaching their deadlines",
            type: "warning"
        }
    ],
    recommendations: [
        {
            id: 1,
            title: "Schedule Optimization",
            description: "Consider rescheduling non-critical tasks from Friday to Monday to balance workload"
        },
        {
            id: 2,
            title: "Resource Allocation",
            description: "Mass spectrometer usage is at capacity; consider prioritizing or extending hours"
        }
    ]
};

// Tasks Dashboard data
export const tasksDashboardData = {
    categories: [
        { name: "Sample Preparation", count: 8, color: "#3b82f6" },
        { name: "Analysis", count: 12, color: "#8b5cf6" },
        { name: "Documentation", count: 7, color: "#10b981" },
        { name: "Maintenance", count: 5, color: "#f59e0b" }
    ],
    priorities: [
        { name: "High", count: 9, color: "#ef4444" },
        { name: "Medium", count: 15, color: "#f59e0b" },
        { name: "Low", count: 8, color: "#10b981" }
    ],
    recentlyAssigned: [
        {
            id: 101,
            title: "Prepare samples for NMR analysis",
            assignee: "Alex Johnson",
            dueDate: "2023-04-05",
            priority: "high",
            status: "in-progress"
        },
        {
            id: 102,
            title: "Update SOP for HPLC method",
            assignee: "Maria Garcia",
            dueDate: "2023-04-07",
            priority: "medium",
            status: "not-started"
        },
        {
            id: 103,
            title: "Calibrate pH meters",
            assignee: "David Kim",
            dueDate: "2023-04-03",
            priority: "medium",
            status: "in-progress"
        }
    ],
    upcomingDeadlines: [
        {
            id: 201,
            title: "Submit quality control report",
            assignee: "Sarah Chen",
            dueDate: "2023-03-30",
            priority: "high",
            status: "in-progress"
        },
        {
            id: 202,
            title: "Complete equipment maintenance log",
            assignee: "James Wilson",
            dueDate: "2023-03-31",
            priority: "medium",
            status: "not-started"
        }
    ]
};

// Experiments Dashboard data
export const experimentsDashboardData = {
    activeExperiments: [
        {
            id: "EXP-2023-042",
            title: "Protein Expression Analysis",
            startDate: "2023-03-20",
            endDate: "2023-04-10",
            lead: "Maria Garcia",
            status: "in-progress",
            progress: 65,
            priority: "high"
        },
        {
            id: "EXP-2023-043",
            title: "Enzyme Kinetics Study",
            startDate: "2023-03-15",
            endDate: "2023-04-05",
            lead: "Sarah Chen",
            status: "in-progress",
            progress: 40,
            priority: "medium"
        },
        {
            id: "EXP-2023-044",
            title: "Compound Stability Testing",
            startDate: "2023-03-25",
            endDate: "2023-04-15",
            lead: "David Kim",
            status: "in-progress",
            progress: 25,
            priority: "medium"
        }
    ],
    completedExperiments: [
        {
            id: "EXP-2023-039",
            title: "Antibody Characterization",
            startDate: "2023-03-01",
            endDate: "2023-03-22",
            lead: "Alex Johnson",
            status: "completed",
            progress: 100,
            priority: "high"
        },
        {
            id: "EXP-2023-040",
            title: "Cell Viability Assay",
            startDate: "2023-03-05",
            endDate: "2023-03-25",
            lead: "James Wilson",
            status: "completed",
            progress: 100,
            priority: "medium"
        }
    ],
    experimentTypes: [
        { name: "Analytical", count: 12, color: "#3b82f6" },
        { name: "Biochemical", count: 8, color: "#8b5cf6" },
        { name: "Cell-based", count: 5, color: "#10b981" },
        { name: "Stability", count: 7, color: "#f59e0b" }
    ],
    successRate: {
        overall: 87,
        byType: [
            { name: "Analytical", rate: 92 },
            { name: "Biochemical", rate: 85 },
            { name: "Cell-based", rate: 78 },
            { name: "Stability", rate: 90 }
        ]
    }
};

// task-Overview data
export const taskOverviewData = [
    { name: 'Pending', value: 12, color: '#f87171' }, // Red
    { name: 'In Progress', value: 18, color: '#facc15' }, // Yellow
    { name: 'Completed', value: 24, color: '#4ade80' }, // Green
    { name: 'Overdue', value: 6, color: '#ef4444' }, // Dark Red
    { name: 'On Hold', value: 8, color: '#9ca3af' } // Gray
];
