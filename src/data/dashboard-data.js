/**
 * Dashboard Data
 * This file contains all the mock data used in the dashboard components
 */

// Tasks Overview data
export const tasksOverviewData = {
    total: 128,
    completed: 84,
    inProgress: 32,
    pending: 12,
    overdue: 12,
    recentTasks: [
        {
            id: 1,
            title: "Update project documentation",
            status: "completed",
            dueDate: "2023-06-20",
            priority: "high",
            assignee: "Alex Johnson"
        },
        {
            id: 2,
            title: "Fix authentication bug",
            status: "in progress",
            dueDate: "2023-06-22",
            priority: "high",
            assignee: "Maria Garcia"
        },
        {
            id: 3,
            title: "Design new dashboard layout",
            status: "in progress",
            dueDate: "2023-06-25",
            priority: "medium",
            assignee: "David Kim"
        },
        {
            id: 4,
            title: "Write unit tests",
            status: "pending",
            dueDate: "2023-06-18",
            priority: "high",
            assignee: "Sarah Lee"
        },
        {
            id: 5,
            title: "Update dependencies",
            status: "pending",
            dueDate: "2023-06-30",
            priority: "low",
            assignee: "James Wilson"
        }
    ]
};

// Task distribution data for the pie chart
export const taskDistributionData = [
    { name: 'Completed', value: tasksOverviewData.completed, color: '#10B981' },
    { name: 'In Progress', value: tasksOverviewData.inProgress, color: '#3B82F6' },
    { name: 'Pending', value: tasksOverviewData.pending, color: '#F59E0B' },
    { name: 'Overdue', value: tasksOverviewData.overdue, color: '#EF4444' },
];

// Stats data for the dashboard cards
export const dashboardStats = [
    {
        title: "Total Tasks",
        value: tasksOverviewData.total.toString(),
        change: "+12% from last month",
        icon: "FileText",
        variant: "default"
    },
    {
        title: "Completed",
        value: tasksOverviewData.completed.toString(),
        change: "+8% from last month",
        icon: "CheckCircle2",
        variant: "success"
    },
    {
        title: "In Progress",
        value: tasksOverviewData.inProgress.toString(),
        change: "+5% from last month",
        icon: "Clock",
        variant: "warning"
    },
    {
        title: "Overdue",
        value: tasksOverviewData.overdue.toString(),
        change: "-3% from last month",
        icon: "AlertTriangle",
        variant: "destructive"
    }
];

// Recent activity data
export const recentActivities = [
    {
        id: 1,
        user: {
            name: "Alex Johnson",
            role: "Senior Researcher",
            avatar: "/avatars/01.png"
        },
        action: "completed",
        target: "Project Documentation Update",
        timestamp: "2023-06-20T14:32:00Z"
    },
    {
        id: 2,
        user: {
            name: "Maria Garcia",
            role: "Lab Technician",
            avatar: "/avatars/02.png"
        },
        action: "started",
        target: "Authentication Bug Fix",
        timestamp: "2023-06-20T12:15:00Z"
    },
    {
        id: 3,
        user: {
            name: "David Kim",
            role: "UI/UX Designer",
            avatar: "/avatars/03.png"
        },
        action: "updated",
        target: "Dashboard Layout Design",
        timestamp: "2023-06-20T10:45:00Z"
    },
    {
        id: 4,
        user: {
            name: "Sarah Lee",
            role: "QA Engineer",
            avatar: "/avatars/04.png"
        },
        action: "assigned",
        target: "Unit Testing Task",
        timestamp: "2023-06-20T09:20:00Z"
    },
    {
        id: 5,
        user: {
            name: "James Wilson",
            role: "DevOps Engineer",
            avatar: "/avatars/05.png"
        },
        action: "updated",
        target: "Dependencies",
        timestamp: "2023-06-19T16:30:00Z"
    }
];

// Team performance data
export const teamPerformance = {
    overall: 82,
    trend: "up",
    change: 5.2,
    metrics: [
        {
            name: "On Track",
            value: 68,
            change: 3.5,
            target: 70
        },
        {
            name: "At Risk",
            value: 22,
            change: -2.1,
            target: 20
        },
        {
            name: "Behind",
            value: 10,
            change: -1.4,
            target: 10
        }
    ]
};

// Reports data
export const reportsData = [
    {
        id: 'rep-001',
        title: 'Q2 2023 Performance Report',
        type: 'Performance',
        format: 'PDF',
        size: '2.4 MB',
        created: '2023-07-15T09:30:00Z',
        status: 'ready',
        generatedBy: 'Alex Johnson',
        tags: ['quarterly', 'performance', 'executive']
    },
    {
        id: 'rep-002',
        title: 'Task Completion Analysis - June 2023',
        type: 'Analytics',
        format: 'Excel',
        size: '1.8 MB',
        created: '2023-07-10T14:20:00Z',
        status: 'ready',
        generatedBy: 'Maria Garcia',
        tags: ['monthly', 'tasks', 'analysis']
    },
    {
        id: 'rep-003',
        title: 'Team Performance Dashboard',
        type: 'Dashboard',
        format: 'PDF',
        size: '3.2 MB',
        created: '2023-07-05T11:15:00Z',
        status: 'ready',
        generatedBy: 'David Kim',
        tags: ['team', 'performance', 'dashboard']
    },
    {
        id: 'rep-004',
        title: 'Project Health Status - Q2 2023',
        type: 'Status',
        format: 'PDF',
        size: '2.1 MB',
        created: '2023-06-28T16:45:00Z',
        status: 'ready',
        generatedBy: 'Sarah Lee',
        tags: ['quarterly', 'projects', 'health']
    },
    {
        id: 'rep-005',
        title: 'Resource Utilization Report',
        type: 'Resource',
        format: 'Excel',
        size: '1.5 MB',
        created: '2023-06-25T10:10:00Z',
        status: 'ready',
        generatedBy: 'James Wilson',
        tags: ['resources', 'utilization', 'monthly']
    },
    {
        id: 'rep-006',
        title: 'Budget vs. Actuals - H1 2023',
        type: 'Financial',
        format: 'PDF',
        size: '2.8 MB',
        created: '2023-06-20T13:25:00Z',
        status: 'ready',
        generatedBy: 'Emma Davis',
        tags: ['financial', 'budget', 'half-yearly']
    }
];

// Report types for filtering
export const reportTypes = [
    { value: 'all', label: 'All Reports' },
    { value: 'Performance', label: 'Performance' },
    { value: 'Analytics', label: 'Analytics' },
    { value: 'Dashboard', label: 'Dashboard' },
    { value: 'Status', label: 'Status' },
    { value: 'Resource', label: 'Resource' },
    { value: 'Financial', label: 'Financial' }
];

// Report formats
export const reportFormats = [
    { value: 'all', label: 'All Formats' },
    { value: 'PDF', label: 'PDF' },
    { value: 'Excel', label: 'Excel' },
    { value: 'CSV', label: 'CSV' },
    { value: 'Word', label: 'Word' }
];

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
export const userActivityData =
    [
        {
            id: "act-1",
            user: {
                name: "Alex Johnson",
                email: "alex.johnson@labtasker.com",
                avatar: "/avatars/alex.png"
            },
            action: "Started experiment",
            actionDetail: "Enzyme Stability Analysis (EXP-1023)",
            timestamp: "2025-03-22T16:20:45",
            type: "experiment"
        },
        {
            id: "act-2",
            user: {
                name: "Sarah Miller",
                email: "sarah.miller@labtasker.com",
                avatar: "/avatars/sarah.png"
            },
            action: "Updated protocol",
            actionDetail: "PCR Amplification Protocol v2.3",
            timestamp: "2025-03-22T15:45:22",
            type: "protocol"
        },
        {
            id: "act-3",
            user: {
                name: "David Chen",
                email: "david.chen@labtasker.com",
                avatar: "/avatars/david.png"
            },
            action: "Uploaded results",
            actionDetail: "Substrate Specificity Results (EXP-1025)",
            timestamp: "2025-03-22T15:10:33",
            type: "data"
        },
        {
            id: "act-4",
            user: {
                name: "Emily Wong",
                email: "emily.wong@labtasker.com",
                avatar: "/avatars/emily.png"
            },
            action: "Created task",
            actionDetail: "Prepare samples for next week's run",
            timestamp: "2025-03-22T14:30:15",
            type: "task"
        },
        {
            id: "act-5",
            user: {
                name: "James Rivera",
                email: "james.rivera@labtasker.com",
                avatar: "/avatars/james.png"
            },
            action: "Generated report",
            actionDetail: "Monthly Equipment Usage Summary",
            timestamp: "2025-03-22T13:55:40",
            type: "report"
        }
    ];

export const dailyActiveUsersData =
    [
        { name: "Mar 16", users: 24 },
        { name: "Mar 17", users: 28 },
        { name: "Mar 18", users: 26 },
        { name: "Mar 19", users: 32 },
        { name: "Mar 20", users: 29 },
        { name: "Mar 21", users: 25 },
        { name: "Mar 22", users: 31 }
    ];

// Experiment Progress data
export const experimentProgressData = [
    {
      id: "exp-001",
      name: "Enzyme Stability Analysis",
      status: "in-progress",
      progress: 68,
      startDate: "2025-03-15T08:30:00",
      endDate: "2025-03-29T17:00:00",
      department: "Biochemistry",
      priority: "high",
      owner: "Dr. Sarah Miller"
    },
    {
      id: "exp-002",
      name: "Substrate Specificity Assay",
      status: "in-progress",
      progress: 45,
      startDate: "2025-03-18T09:15:00",
      endDate: "2025-04-01T16:30:00",
      department: "Molecular Biology",
      priority: "medium",
      owner: "Dr. Alex Johnson"
    },
    {
      id: "exp-003",
      name: "Protein Folding Kinetics",
      status: "delayed",
      progress: 32,
      startDate: "2025-03-12T10:00:00",
      endDate: "2025-03-26T17:00:00",
      department: "Biochemistry",
      priority: "high",
      owner: "Dr. Emily Wong"
    },
    {
      id: "exp-004",
      name: "Gene Expression Analysis",
      status: "completed",
      progress: 100,
      startDate: "2025-03-10T08:00:00",
      endDate: "2025-03-20T15:45:00",
      department: "Genetics",
      priority: "medium",
      owner: "Dr. James Rivera"
    },
    {
      id: "exp-005",
      name: "Cell Culture Optimization",
      status: "scheduled",
      progress: 0,
      startDate: "2025-03-25T09:00:00",
      endDate: "2025-04-08T16:00:00",
      department: "Cell Biology",
      priority: "low",
      owner: "Dr. David Chen"
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
