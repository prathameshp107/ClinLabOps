// Mock data for user dashboard

// Mock tasks assigned to the user
export const mockAssignedTasks = [
  {
    id: 1,
    title: "Complete PCR analysis for Project X",
    description: "Run PCR analysis on the samples collected from experiment 3B and document the results.",
    dueDate: "2023-11-15",
    status: "In Progress",
    priority: "High",
    projectName: "Oncology Research",
    projectColor: "bg-blue-500",
    createdBy: "Dr. Emily Chen",
    createdDate: "2023-11-01",
    updatedDate: "2023-11-10"
  },
  {
    id: 2,
    title: "Review protocol documentation",
    description: "Review and approve the updated protocol documentation for the clinical trial.",
    dueDate: "2023-11-18",
    status: "Pending",
    priority: "Medium",
    projectName: "Clinical Trial XYZ",
    projectColor: "bg-purple-500",
    createdBy: "Mark Williams",
    createdDate: "2023-11-05",
    updatedDate: null
  },
  {
    id: 3,
    title: "Prepare samples for mass spectrometry",
    description: "Prepare and label all samples for the upcoming mass spectrometry analysis.",
    dueDate: "2023-11-12",
    status: "Overdue",
    priority: "High",
    projectName: "Proteomics Study",
    projectColor: "bg-green-500",
    createdBy: "Dr. Sarah Johnson",
    createdDate: "2023-10-28",
    updatedDate: "2023-11-02"
  },
  {
    id: 4,
    title: "Analyze gene expression data",
    description: "Perform statistical analysis on the gene expression data from experiment 2A.",
    dueDate: "2023-11-25",
    status: "Pending",
    priority: "Medium",
    projectName: "Genomics Research",
    projectColor: "bg-amber-500",
    createdBy: "Dr. Robert Kim",
    createdDate: "2023-11-08",
    updatedDate: null
  },
  {
    id: 5,
    title: "Calibrate laboratory equipment",
    description: "Calibrate and verify all equipment in Lab B according to SOP.",
    dueDate: "2023-11-10",
    status: "Completed",
    priority: "Low",
    projectName: "Lab Maintenance",
    projectColor: "bg-gray-500",
    createdBy: "James Rodriguez",
    createdDate: "2023-11-03",
    updatedDate: "2023-11-09"
  },
  {
    id: 6,
    title: "Draft research paper introduction",
    description: "Write the introduction section for the upcoming research paper on findings from Project X.",
    dueDate: "2023-11-30",
    status: "Pending",
    priority: "Medium",
    projectName: "Oncology Research",
    projectColor: "bg-blue-500",
    createdBy: "Dr. Sarah Johnson",
    createdDate: "2023-11-10",
    updatedDate: null
  },
  {
    id: 7,
    title: "Prepare presentation for team meeting",
    description: "Create slides summarizing the current project status and findings for the weekly team meeting.",
    dueDate: "2023-11-16",
    status: "In Progress",
    priority: "Medium",
    projectName: "Oncology Research",
    projectColor: "bg-blue-500",
    createdBy: "Dr. Emily Chen",
    createdDate: "2023-11-09",
    updatedDate: "2023-11-11"
  }
];

// Mock tasks created by the user
export const mockCreatedTasks = [
  {
    id: 101,
    title: "Analyze antibody binding data",
    description: "Perform statistical analysis on the antibody binding data from experiment 4C.",
    dueDate: "2023-11-20",
    status: "In Progress",
    priority: "High",
    projectName: "Immunology Study",
    projectColor: "bg-indigo-500",
    createdBy: "Dr. Sarah Johnson",
    assignedTo: "Dr. Emily Chen",
    createdDate: "2023-11-05",
    updatedDate: "2023-11-10"
  },
  {
    id: 102,
    title: "Update sample tracking database",
    description: "Add new samples to the tracking database and update status of processed samples.",
    dueDate: "2023-11-14",
    status: "Completed",
    priority: "Medium",
    projectName: "Sample Management",
    projectColor: "bg-teal-500",
    createdBy: "Dr. Sarah Johnson",
    assignedTo: "James Rodriguez",
    createdDate: "2023-11-02",
    updatedDate: "2023-11-12"
  },
  {
    id: 103,
    title: "Review research grant proposal",
    description: "Review and provide feedback on the draft research grant proposal for the new cancer study.",
    dueDate: "2023-11-25",
    status: "Pending",
    priority: "High",
    projectName: "Grant Applications",
    projectColor: "bg-pink-500",
    createdBy: "Dr. Sarah Johnson",
    assignedTo: "Dr. Robert Kim",
    createdDate: "2023-11-08",
    updatedDate: null
  },
  {
    id: 104,
    title: "Organize team building event",
    description: "Plan and coordinate the quarterly team building event for the research department.",
    dueDate: "2023-12-05",
    status: "In Progress",
    priority: "Low",
    projectName: "Department Activities",
    projectColor: "bg-orange-500",
    createdBy: "Dr. Sarah Johnson",
    assignedTo: "Olivia Taylor",
    createdDate: "2023-11-10",
    updatedDate: "2023-11-11"
  },
  {
    id: 105,
    title: "Prepare monthly progress report",
    description: "Compile and prepare the monthly progress report for all active research projects.",
    dueDate: "2023-11-30",
    status: "Pending",
    priority: "Medium",
    projectName: "Administration",
    projectColor: "bg-gray-500",
    createdBy: "Dr. Sarah Johnson",
    assignedTo: "Dr. Sarah Johnson",
    createdDate: "2023-11-11",
    updatedDate: null
  }
];

// Mock projects where user is a member
export const mockMemberProjects = [
  {
    id: 201,
    name: "Oncology Research",
    description: "Investigation of novel therapeutic targets for breast cancer treatment",
    status: "Active",
    progress: 65,
    dueDate: "Feb 28, 2024",
    completedTasks: 18,
    totalTasks: 32,
    teamSize: 8,
    priority: "High",
    color: "bg-blue-500",
    role: "Lead Researcher",
    team: [
      { name: "Dr. Sarah Johnson", avatar: "SJ" },
      { name: "Dr. Emily Chen", avatar: "EC" },
      { name: "Mark Williams", avatar: "MW" },
      { name: "Dr. Robert Kim", avatar: "RK" }
    ]
  },
  {
    id: 202,
    name: "Clinical Trial XYZ",
    description: "Phase II clinical trial for experimental drug XYZ-123",
    status: "Active",
    progress: 40,
    dueDate: "May 15, 2024",
    completedTasks: 12,
    totalTasks: 45,
    teamSize: 15,
    priority: "High",
    color: "bg-purple-500",
    role: "Scientific Advisor",
    team: [
      { name: "Dr. Emily Chen", avatar: "EC" },
      { name: "Dr. Sarah Johnson", avatar: "SJ" },
      { name: "James Rodriguez", avatar: "JR" },
      { name: "Olivia Taylor", avatar: "OT" }
    ]
  },
  {
    id: 203,
    name: "Proteomics Study",
    description: "Comprehensive analysis of protein expression in tumor samples",
    status: "Active",
    progress: 75,
    dueDate: "Jan 10, 2024",
    completedTasks: 24,
    totalTasks: 30,
    teamSize: 6,
    priority: "Medium",
    color: "bg-green-500",
    role: "Collaborator",
    team: [
      { name: "Mark Williams", avatar: "MW" },
      { name: "Dr. Sarah Johnson", avatar: "SJ" },
      { name: "Dr. Robert Kim", avatar: "RK" }
    ]
  },
  {
    id: 204,
    name: "Genomics Research",
    description: "Genetic profiling of patient samples for personalized medicine",
    status: "On Hold",
    progress: 30,
    dueDate: "Mar 20, 2024",
    completedTasks: 8,
    totalTasks: 25,
    teamSize: 7,
    priority: "Medium",
    color: "bg-amber-500",
    role: "Researcher",
    team: [
      { name: "Dr. Robert Kim", avatar: "RK" },
      { name: "Dr. Sarah Johnson", avatar: "SJ" },
      { name: "Olivia Taylor", avatar: "OT" }
    ]
  },
  {
    id: 205,
    name: "Lab Maintenance",
    description: "Regular maintenance and calibration of laboratory equipment",
    status: "Active",
    progress: 90,
    dueDate: "Dec 15, 2023",
    completedTasks: 18,
    totalTasks: 20,
    teamSize: 4,
    priority: "Low",
    color: "bg-gray-500",
    role: "Supervisor",
    team: [
      { name: "James Rodriguez", avatar: "JR" },
      { name: "Dr. Sarah Johnson", avatar: "SJ" },
      { name: "Mark Williams", avatar: "MW" }
    ]
  }
];

// Mock projects created by the user
export const mockOwnedProjects = [
  {
    id: 301,
    name: "Immunology Study",
    description: "Investigation of immune response to novel vaccine candidates",
    status: "Active",
    progress: 55,
    dueDate: "Apr 10, 2024",
    completedTasks: 15,
    totalTasks: 35,
    teamSize: 9,
    priority: "High",
    color: "bg-indigo-500",
    isOwner: true,
    team: [
      { name: "Dr. Sarah Johnson", avatar: "SJ" },
      { name: "Dr. Emily Chen", avatar: "EC" },
      { name: "Mark Williams", avatar: "MW" },
      { name: "Olivia Taylor", avatar: "OT" }
    ]
  },
  {
    id: 302,
    name: "Sample Management",
    description: "System for tracking and managing laboratory samples",
    status: "Completed",
    progress: 100,
    dueDate: "Nov 5, 2023",
    completedTasks: 22,
    totalTasks: 22,
    teamSize: 5,
    priority: "Medium",
    color: "bg-teal-500",
    isOwner: true,
    team: [
      { name: "Dr. Sarah Johnson", avatar: "SJ" },
      { name: "James Rodriguez", avatar: "JR" },
      { name: "Mark Williams", avatar: "MW" }
    ]
  },
  {
    id: 303,
    name: "Grant Applications",
    description: "Preparation and submission of research grant proposals",
    status: "Active",
    progress: 35,
    dueDate: "Jan 30, 2024",
    completedTasks: 7,
    totalTasks: 20,
    teamSize: 4,
    priority: "High",
    color: "bg-pink-500",
    isOwner: true,
    team: [
      { name: "Dr. Sarah Johnson", avatar: "SJ" },
      { name: "Dr. Robert Kim", avatar: "RK" },
      { name: "Dr. Emily Chen", avatar: "EC" }
    ]
  },
  {
    id: 304,
    name: "Department Activities",
    description: "Coordination of department events and team building activities",
    status: "Active",
    progress: 25,
    dueDate: "Dec 20, 2023",
    completedTasks: 3,
    totalTasks: 12,
    teamSize: 6,
    priority: "Low",
    color: "bg-orange-500",
    isOwner: true,
    team: [
      { name: "Dr. Sarah Johnson", avatar: "SJ" },
      { name: "Olivia Taylor", avatar: "OT" },
      { name: "James Rodriguez", avatar: "JR" },
      { name: "Mark Williams", avatar: "MW" }
    ]
  }
];

// Mock recent activities
export const mockActivities = [
  {
    id: 401,
    type: "task_completed",
    title: "Completed a task",
    description: "Calibrate laboratory equipment",
    time: "2 hours ago",
    project: "Lab Maintenance",
    user: { name: "Dr. Sarah Johnson", avatar: "SJ" }
  },
  {
    id: 402,
    type: "comment_added",
    title: "Added a comment",
    description: "Left feedback on PCR analysis results",
    time: "Yesterday",
    project: "Oncology Research",
    user: { name: "Dr. Sarah Johnson", avatar: "SJ" }
  },
  {
    id: 403,
    type: "task_created",
    title: "Created a new task",
    description: "Prepare monthly progress report",
    time: "2 days ago",
    project: "Administration",
    user: { name: "Dr. Sarah Johnson", avatar: "SJ" }
  },
  {
    id: 404,
    type: "document_added",
    title: "Uploaded a document",
    description: "Added research protocol documentation",
    time: "3 days ago",
    project: "Clinical Trial XYZ",
    user: { name: "Dr. Sarah Johnson", avatar: "SJ" }
  },
  {
    id: 405,
    type: "task_edited",
    title: "Updated a task",
    description: "Modified deadline for antibody binding analysis",
    time: "4 days ago",
    project: "Immunology Study",
    user: { name: "Dr. Sarah Johnson", avatar: "SJ" }
  },
  {
    id: 406,
    type: "user_added",
    title: "Added team member",
    description: "Added Dr. Emily Chen to Proteomics Study",
    time: "1 week ago",
    project: "Proteomics Study",
    user: { name: "Dr. Sarah Johnson", avatar: "SJ" }
  }
];

// Mock notifications
export const mockNotifications = [
  {
    id: 501,
    type: "alert",
    title: "Task Overdue",
    message: "The task 'Prepare samples for mass spectrometry' is now overdue.",
    time: "Just now",
    read: false
  },
  {
    id: 502,
    type: "reminder",
    title: "Upcoming Deadline",
    message: "Task 'Review protocol documentation' is due in 3 days.",
    time: "30 minutes ago",
    read: false
  },
  {
    id: 503,
    type: "mention",
    title: "You were mentioned",
    message: "Dr. Emily Chen mentioned you in a comment on 'PCR analysis'.",
    time: "2 hours ago",
    read: true
  },
  {
    id: 504,
    type: "success",
    title: "Task Completed",
    message: "James Rodriguez completed the task 'Calibrate laboratory equipment'.",
    time: "Yesterday",
    read: true
  },
  {
    id: 505,
    type: "message",
    title: "New Message",
    message: "You received a new message from Dr. Robert Kim regarding the Genomics project.",
    time: "2 days ago",
    read: true
  }
];

// Mock upcoming deadlines
export const mockUpcomingDeadlines = [
  {
    id: 601,
    title: "Complete PCR analysis for Project X",
    dueDate: "Nov 15, 2023",
    daysLeft: 1,
    projectName: "Oncology Research"
  },
  {
    id: 602,
    title: "Update sample tracking database",
    dueDate: "Nov 14, 2023",
    daysLeft: 0,
    projectName: "Sample Management"
  },
  {
    id: 603,
    title: "Prepare samples for mass spectrometry",
    dueDate: "Nov 12, 2023",
    daysLeft: -2,
    projectName: "Proteomics Study"
  },
  {
    id: 604,
    title: "Prepare presentation for team meeting",
    dueDate: "Nov 16, 2023",
    daysLeft: 2,
    projectName: "Oncology Research"
  },
  {
    id: 605,
    title: "Review protocol documentation",
    dueDate: "Nov 18, 2023",
    daysLeft: 4,
    projectName: "Clinical Trial XYZ"
  }
];

// Mock performance data
export const mockPerformanceData = {
  taskCompletion: [
    { name: "Week 1", completed: 12, pending: 5, overdue: 1 },
    { name: "Week 2", completed: 15, pending: 4, overdue: 0 },
    { name: "Week 3", completed: 10, pending: 6, overdue: 2 },
    { name: "Week 4", completed: 18, pending: 3, overdue: 1 }
  ],
  timeTracking: [
    { day: "Mon", hours: 7.5, expected: 8 },
    { day: "Tue", hours: 8.2, expected: 8 },
    { day: "Wed", hours: 7.8, expected: 8 },
    { day: "Thu", hours: 8.5, expected: 8 },
    { day: "Fri", hours: 6.5, expected: 8 },
    { day: "Sat", hours: 2, expected: 0 },
    { day: "Sun", hours: 0, expected: 0 }
  ],
  taskDistribution: [
    { name: "Research", value: 45 },
    { name: "Documentation", value: 20 },
    { name: "Analysis", value: 15 },
    { name: "Meetings", value: 10 },
    { name: "Administration", value: 10 }
  ],
  trends: [
    { month: "Jul", efficiency: 75, taskCompletion: 82, onTimeDelivery: 88 },
    { month: "Aug", efficiency: 78, taskCompletion: 85, onTimeDelivery: 85 },
    { month: "Sep", efficiency: 82, taskCompletion: 87, onTimeDelivery: 90 },
    { month: "Oct", efficiency: 85, taskCompletion: 90, onTimeDelivery: 92 },
    { month: "Nov", efficiency: 88, taskCompletion: 92, onTimeDelivery: 95 }
  ],
  summary: {
    completionRate: 92,
    completionRateChange: 5,
    onTimeRate: 95,
    onTimeRateChange: 3,
    efficiencyScore: 88,
    efficiencyScoreChange: 6
  }
};