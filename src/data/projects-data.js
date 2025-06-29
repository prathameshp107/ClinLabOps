// Centralized data file for Projects section
// This file contains all the hardcoded data that was previously scattered across components

// Mock users data
export const mockUsers = {
  "u1": { 
    id: "u1", 
    name: "Dr. Sarah Johnson", 
    avatar: "SJ", 
    role: "Admin", 
    department: "Research & Development",
    email: "s.johnson@example.com",
    status: "online"
  },
  "u2": { 
    id: "u2", 
    name: "Mark Williams", 
    avatar: "MW", 
    role: "Scientist", 
    department: "Biochemistry",
    email: "m.williams@example.com",
    status: "online"
  },
  "u3": { 
    id: "u3", 
    name: "Dr. Emily Chen", 
    avatar: "EC", 
    role: "Reviewer", 
    department: "Quality Control",
    email: "e.chen@example.com",
    status: "away"
  },
  "u4": { 
    id: "u4", 
    name: "James Rodriguez", 
    avatar: "JR", 
    role: "Technician", 
    department: "Laboratory Operations",
    email: "j.rodriguez@example.com",
    status: "online"
  },
  "u5": { 
    id: "u5", 
    name: "Olivia Taylor", 
    avatar: "OT", 
    role: "Scientist", 
    department: "Microbiology",
    email: "o.taylor@example.com",
    status: "offline"
  },
  "u6": { 
    id: "u6", 
    name: "Robert Kim", 
    avatar: "RK", 
    role: "Technician", 
    department: "Equipment Maintenance",
    email: "r.kim@example.com",
    status: "online"
  }
};

// Sample project data
export const mockProjects = [
  {
    id: "p1",
    name: "Cancer Biomarker Discovery",
    description: "Identifying novel biomarkers for early detection of pancreatic cancer using proteomics approaches",
    startDate: "2025-01-15",
    endDate: "2025-07-15",
    status: "In Progress",
    priority: "High",
    progress: 45,
    isFavorite: true,
    budget: "150000",
    confidential: false,
    complexity: 75,
    department: "Oncology Research",
    team: [
      { id: "u1", name: "Dr. Sarah Johnson", role: "Principal Investigator", email: "s.johnson@example.com" },
      { id: "u2", name: "Mark Williams", role: "Research Scientist", email: "m.williams@example.com" },
      { id: "u4", name: "James Rodriguez", role: "Lab Technician", email: "j.rodriguez@example.com" }
    ],
    tags: ["Oncology", "Proteomics", "Clinical"],
    dependencies: [
      { id: "dep1", sourceId: "p1", sourceName: "Cancer Biomarker Discovery", targetId: "p3", targetName: "Neuroimaging Data Analysis", type: "finish-to-start", created: "2025-01-20T14:15:00Z" }
    ],
    activityLog: [
      { id: "a1", userId: "u1", action: "created", timestamp: "2025-01-14T09:30:00Z", details: "Project created" },
      { id: "a2", userId: "u1", action: "updated", timestamp: "2025-01-20T14:15:00Z", details: "Updated project description" },
      { id: "a3", userId: "u2", action: "updated", timestamp: "2025-02-05T11:45:00Z", details: "Updated progress to 30%" },
      { id: "a4", userId: "u1", action: "added_member", timestamp: "2025-02-10T10:00:00Z", details: "Added James Rodriguez to the team" }
    ],
    tasks: [
      { id: 't1', name: 'Sample Collection', status: 'completed', assignee: 'Dr. Sarah Johnson', assigneeId: 'u1', dueDate: '2025-02-15', priority: 'high', progress: 100, description: 'Collect all required samples from the laboratory storage.' },
      { id: 't2', name: 'PCR Analysis', status: 'in_progress', assignee: 'Mark Williams', assigneeId: 'u2', dueDate: '2025-03-05', priority: 'medium', progress: 65, description: 'Perform PCR analysis on the collected samples.' },
      { id: 't3', name: 'Data Processing', status: 'pending', assignee: 'James Rodriguez', assigneeId: 'u4', dueDate: '2025-03-15', priority: 'medium', progress: 0, description: 'Process the raw data from PCR analysis using statistical methods.' }
    ],
    documents: [
      { id: 'd1', name: 'Project Proposal.pdf', type: 'pdf', size: '2.4 MB', uploadedBy: 'Dr. Sarah Johnson', uploadedAt: '2025-01-10', tags: ['proposal', 'planning'] },
      { id: 'd2', name: 'Experiment Protocol.docx', type: 'docx', size: '1.8 MB', uploadedBy: 'Mark Williams', uploadedAt: '2025-01-15', tags: ['protocol', 'methods'] }
    ],
    milestones: [
      { id: 'ms1', name: 'Phase 1 Completion', date: '2025-03-15', status: 'upcoming', description: 'Complete all initial sample collection and analysis.' },
      { id: 'ms2', name: 'Interim Report', date: '2025-05-01', status: 'upcoming', description: 'Submit interim report with preliminary findings.' }
    ]
  },
  {
    id: "p2",
    name: "Antibiotic Resistance Testing",
    description: "Evaluating resistance patterns of bacterial strains against new antibiotic compounds",
    startDate: "2025-02-10",
    endDate: "2025-05-10",
    status: "In Progress",
    priority: "Medium",
    progress: 68,
    isFavorite: false,
    budget: "75000",
    confidential: false,
    complexity: 50,
    department: "Microbiology",
    team: [
      { id: "u3", name: "Dr. Emily Chen", role: "Project Lead", email: "e.chen@example.com" },
      { id: "u5", name: "Olivia Taylor", role: "Microbiologist", email: "o.taylor@example.com" }
    ],
    tags: ["Microbiology", "Drug Development"],
    dependencies: [
      { id: "dep2", sourceId: "p2", sourceName: "Antibiotic Resistance Testing", targetId: "p6", targetName: "Lab Equipment Validation", type: "start-to-start", created: "2025-02-15T10:30:00Z" }
    ],
    activityLog: [],
    tasks: [
      { id: 't4', name: 'Bacterial Culture', status: 'completed', assignee: 'Dr. Emily Chen', assigneeId: 'u3', dueDate: '2025-02-20', priority: 'high', progress: 100, description: 'Prepare bacterial cultures for testing.' },
      { id: 't5', name: 'Resistance Testing', status: 'in_progress', assignee: 'Olivia Taylor', assigneeId: 'u5', dueDate: '2025-04-01', priority: 'medium', progress: 45, description: 'Test bacterial resistance to various antibiotics.' }
    ],
    documents: [
      { id: 'd3', name: 'Testing Protocol.pdf', type: 'pdf', size: '1.2 MB', uploadedBy: 'Dr. Emily Chen', uploadedAt: '2025-02-12', tags: ['protocol', 'testing'] }
    ],
    milestones: [
      { id: 'ms3', name: 'Testing Complete', date: '2025-04-15', status: 'upcoming', description: 'Complete all resistance testing procedures.' }
    ]
  },
  {
    id: "p3",
    name: "Neuroimaging Data Analysis",
    description: "Processing and analyzing fMRI data from Alzheimer's patients to identify early markers",
    startDate: "2024-11-20",
    endDate: "2025-06-30",
    status: "On Hold",
    priority: "Medium",
    progress: 32,
    isFavorite: false,
    budget: "200000",
    confidential: true,
    complexity: 85,
    department: "Neuroscience",
    team: [
      { id: "u1", name: "Dr. Sarah Johnson", role: "Supervisor", email: "s.johnson@example.com" },
      { id: "u2", name: "Mark Williams", role: "Data Analyst", email: "m.williams@example.com" }
    ],
    tags: ["Neuroscience", "Data Analysis", "Clinical"],
    dependencies: [],
    activityLog: [],
    tasks: [
      { id: 't6', name: 'Data Collection', status: 'completed', assignee: 'Dr. Sarah Johnson', assigneeId: 'u1', dueDate: '2024-12-15', priority: 'high', progress: 100, description: 'Collect fMRI data from participants.' },
      { id: 't7', name: 'Data Processing', status: 'on_hold', assignee: 'Mark Williams', assigneeId: 'u2', dueDate: '2025-02-01', priority: 'medium', progress: 30, description: 'Process and clean the collected fMRI data.' }
    ],
    documents: [
      { id: 'd4', name: 'Research Protocol.pdf', type: 'pdf', size: '3.1 MB', uploadedBy: 'Dr. Sarah Johnson', uploadedAt: '2024-11-25', tags: ['protocol', 'research'] }
    ],
    milestones: [
      { id: 'ms4', name: 'Data Collection Complete', date: '2024-12-15', status: 'completed', description: 'Complete all data collection from participants.' }
    ]
  },
  {
    id: "p4",
    name: "Vaccine Stability Study",
    description: "Evaluating long-term stability of mRNA vaccine formulations under various storage conditions",
    startDate: "2025-03-01",
    endDate: "2025-09-01",
    status: "Pending",
    priority: "High",
    progress: 0,
    isFavorite: false,
    budget: "300000",
    confidential: true,
    complexity: 90,
    department: "Vaccine Research",
    team: [
      { id: "u6", name: "Robert Kim", role: "Equipment Specialist", email: "r.kim@example.com" },
      { id: "u4", name: "James Rodriguez", role: "Lab Technician", email: "j.rodriguez@example.com" }
    ],
    tags: ["Vaccines", "Stability", "mRNA"],
    dependencies: [],
    activityLog: [],
    tasks: [
      { id: 't8', name: 'Equipment Setup', status: 'pending', assignee: 'Robert Kim', assigneeId: 'u6', dueDate: '2025-03-15', priority: 'high', progress: 0, description: 'Set up temperature-controlled storage units.' },
      { id: 't9', name: 'Sample Preparation', status: 'pending', assignee: 'James Rodriguez', assigneeId: 'u4', dueDate: '2025-03-20', priority: 'medium', progress: 0, description: 'Prepare vaccine samples for stability testing.' }
    ],
    documents: [
      { id: 'd5', name: 'Study Design.pdf', type: 'pdf', size: '4.2 MB', uploadedBy: 'Robert Kim', uploadedAt: '2025-02-25', tags: ['design', 'study'] }
    ],
    milestones: [
      { id: 'ms5', name: 'Study Initiation', date: '2025-03-01', status: 'upcoming', description: 'Begin stability study with prepared samples.' }
    ]
  },
  {
    id: "p5",
    name: "Genetic Screening Protocol Development",
    description: "Developing a rapid genetic screening protocol for rare genetic disorders",
    startDate: "2024-12-05",
    endDate: "2025-04-15",
    status: "Completed",
    priority: "Medium",
    progress: 100,
    isFavorite: true,
    budget: "120000",
    confidential: false,
    complexity: 60,
    department: "Genetics",
    team: [
      { id: "u3", name: "Dr. Emily Chen", role: "Quality Control", email: "e.chen@example.com" },
      { id: "u5", name: "Olivia Taylor", role: "Genetic Analyst", email: "o.taylor@example.com" }
    ],
    tags: ["Genetics", "Protocol", "Screening"],
    dependencies: [],
    activityLog: [],
    tasks: [
      { id: 't10', name: 'Protocol Design', status: 'completed', assignee: 'Dr. Emily Chen', assigneeId: 'u3', dueDate: '2025-01-15', priority: 'high', progress: 100, description: 'Design the genetic screening protocol.' },
      { id: 't11', name: 'Validation Testing', status: 'completed', assignee: 'Olivia Taylor', assigneeId: 'u5', dueDate: '2025-03-01', priority: 'medium', progress: 100, description: 'Validate the protocol with sample data.' }
    ],
    documents: [
      { id: 'd6', name: 'Final Protocol.pdf', type: 'pdf', size: '2.8 MB', uploadedBy: 'Dr. Emily Chen', uploadedAt: '2025-04-10', tags: ['protocol', 'final'] }
    ],
    milestones: [
      { id: 'ms6', name: 'Protocol Complete', date: '2025-04-15', status: 'completed', description: 'Complete protocol development and validation.' }
    ]
  },
  {
    id: "p6",
    name: "Lab Equipment Validation",
    description: "Validation of new mass spectrometry equipment for clinical sample analysis",
    startDate: "2025-02-20",
    endDate: "2025-03-20",
    status: "In Progress",
    priority: "Low",
    progress: 85,
    isFavorite: false,
    budget: "50000",
    confidential: false,
    complexity: 40,
    department: "Equipment Maintenance",
    team: [
      { id: "u6", name: "Robert Kim", role: "Lead Technician", email: "r.kim@example.com" },
      { id: "u4", name: "James Rodriguez", role: "Assistant", email: "j.rodriguez@example.com" }
    ],
    tags: ["Equipment", "Validation", "Mass Spec"],
    dependencies: [],
    activityLog: [],
    tasks: [
      { id: 't12', name: 'Equipment Installation', status: 'completed', assignee: 'Robert Kim', assigneeId: 'u6', dueDate: '2025-02-25', priority: 'high', progress: 100, description: 'Install and calibrate the mass spectrometry equipment.' },
      { id: 't13', name: 'Validation Testing', status: 'in_progress', assignee: 'James Rodriguez', assigneeId: 'u4', dueDate: '2025-03-15', priority: 'medium', progress: 70, description: 'Perform validation tests on the equipment.' }
    ],
    documents: [
      { id: 'd7', name: 'Installation Manual.pdf', type: 'pdf', size: '1.5 MB', uploadedBy: 'Robert Kim', uploadedAt: '2025-02-22', tags: ['manual', 'installation'] }
    ],
    milestones: [
      { id: 'ms7', name: 'Validation Complete', date: '2025-03-20', status: 'upcoming', description: 'Complete all validation procedures.' }
    ]
  }
];

// Configuration data
export const projectStatuses = [
  { value: "Not Started", label: "Not Started" },
  { value: "In Progress", label: "In Progress" },
  { value: "On Hold", label: "On Hold" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
  { value: "Pending", label: "Pending" }
];

export const projectPriorities = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
  { value: "Critical", label: "Critical" }
];

export const researchAreas = [
  "Oncology",
  "Microbiology",
  "Neuroscience",
  "Genetics",
  "Immunology",
  "Cardiovascular",
  "Endocrinology",
  "Pharmacology",
  "Toxicology",
  "Epidemiology"
];

export const studyTypes = [
  "Clinical Trial",
  "Laboratory Study",
  "Observational Study",
  "Case-Control Study",
  "Cohort Study",
  "Cross-Sectional Study",
  "Longitudinal Study",
  "Pilot Study"
];

export const dataCollectionFrequencies = [
  "Daily",
  "Weekly",
  "Monthly",
  "Quarterly",
  "Annually",
  "As needed",
  "Continuous"
];

export const commonTags = [
  "Research",
  "Development",
  "Clinical",
  "Laboratory",
  "Data Analysis",
  "Protocol",
  "Validation",
  "Equipment",
  "Quality Control",
  "Documentation",
  "Oncology",
  "Proteomics",
  "Microbiology",
  "Drug Development",
  "Neuroscience",
  "Genetics",
  "Screening",
  "Vaccines",
  "Stability",
  "mRNA",
  "Mass Spec"
];

// User suggestions for sharing
export const userSuggestions = [
  { id: "u7", name: "Dr. Lisa Wang", email: "l.wang@example.com", role: "Senior Researcher" },
  { id: "u8", name: "David Thompson", email: "d.thompson@example.com", role: "Lab Manager" },
  { id: "u9", name: "Maria Garcia", email: "m.garcia@example.com", role: "Research Assistant" },
  { id: "u10", name: "Dr. Alex Kumar", email: "a.kumar@example.com", role: "Principal Investigator" }
];

// Suggested members for adding to projects
export const suggestedMembers = [
  { id: "u7", name: "Dr. Lisa Wang", role: "Senior Researcher", department: "Molecular Biology", avatar: "LW" },
  { id: "u8", name: "David Thompson", role: "Lab Manager", department: "Laboratory Operations", avatar: "DT" },
  { id: "u9", name: "Maria Garcia", role: "Research Assistant", department: "Clinical Research", avatar: "MG" },
  { id: "u10", name: "Dr. Alex Kumar", role: "Principal Investigator", department: "Biochemistry", avatar: "AK" }
];

// Team workload data
export const teamWorkloadData = [
  { name: "Dr. Sarah Johnson", completed: 12, inProgress: 3, pending: 2 },
  { name: "Mark Williams", completed: 8, inProgress: 4, pending: 1 },
  { name: "Dr. Emily Chen", completed: 15, inProgress: 2, pending: 0 },
  { name: "James Rodriguez", completed: 6, inProgress: 5, pending: 3 },
  { name: "Olivia Taylor", completed: 10, inProgress: 3, pending: 1 },
  { name: "Robert Kim", completed: 7, inProgress: 4, pending: 2 }
];

// Task status overview data
export const tasksData = [
  { status: "Completed", count: 45, color: "#10b981" },
  { status: "In Progress", count: 23, color: "#3b82f6" },
  { status: "Pending", count: 18, color: "#f59e0b" },
  { status: "On Hold", count: 8, color: "#ef4444" }
];

// Priority breakdown data
export const priorityData = [
  { priority: "High", count: 25, color: "#ef4444" },
  { priority: "Medium", count: 42, color: "#f59e0b" },
  { priority: "Low", count: 18, color: "#10b981" }
];

// Recent activities data
export const defaultActivities = [
  { id: "a1", type: "task_completed", user: "Dr. Sarah Johnson", userId: "u1", task: "Sample Collection", taskId: "t1", time: "2 hours ago", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: "a2", type: "comment_added", user: "Mark Williams", userId: "u2", task: "PCR Analysis", taskId: "t2", comment: "Found some interesting patterns in the samples.", time: "5 hours ago", timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
  { id: "a3", type: "document_uploaded", user: "Dr. Emily Chen", userId: "u3", document: "Initial Results.xlsx", documentId: "d3", time: "1 day ago", timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
  { id: "a4", type: "member_joined", user: "James Rodriguez", userId: "u4", time: "3 days ago", timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "a5", type: "task_created", user: "Dr. Sarah Johnson", userId: "u1", task: "Quality Control", taskId: "t5", time: "4 days ago", timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() }
];

// Default team data
export const defaultTeam = [
  { id: 'm1', name: 'Dr. Sarah Johnson', role: 'Project Lead', department: 'Research', joinedAt: '3 months ago', avatar: 'SJ', status: 'online' },
  { id: 'm2', name: 'Mark Williams', role: 'Lab Technician', department: 'Laboratory', joinedAt: '2 months ago', avatar: 'MW', status: 'online' },
  { id: 'm3', name: 'Dr. Emily Chen', role: 'Data Scientist', department: 'Analytics', joinedAt: '1 month ago', avatar: 'EC', status: 'away' },
  { id: 'm4', name: 'James Rodriguez', role: 'Research Assistant', department: 'Research', joinedAt: '3 weeks ago', avatar: 'JR', status: 'online' }
];

// Mock activities for project overview
export const mockActivities = [
  { id: 'a1', type: 'task_completed', user: 'Dr. Sarah Johnson', userId: 'u1', task: 'Sample Collection', taskId: 't1', time: '2 hours ago', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: 'a2', type: 'comment_added', user: 'Mark Williams', userId: 'u2', task: 'PCR Analysis', taskId: 't2', comment: 'Found some interesting patterns in the samples.', time: '5 hours ago', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
  { id: 'a3', type: 'document_uploaded', user: 'Dr. Emily Chen', userId: 'u3', document: 'Initial Results.xlsx', documentId: 'd3', time: '1 day ago', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() }
];

// Mock milestones for project overview
export const mockMilestones = [
  { id: 'ms1', name: 'Phase 1 Completion', date: '2025-03-15', status: 'upcoming', description: 'Complete all initial sample collection and analysis.' },
  { id: 'ms2', name: 'Interim Report', date: '2025-05-01', status: 'upcoming', description: 'Submit interim report with preliminary findings.' },
  { id: 'ms3', name: 'Final Testing', date: '2025-06-20', status: 'upcoming', description: 'Complete all testing and validation procedures.' },
  { id: 'ms4', name: 'Project Delivery', date: '2025-07-15', status: 'upcoming', description: 'Deliver final project with complete documentation.' }
];

// Status chips for filtering
export const statusChips = [
  { label: "All", value: "all" },
  { label: "In Progress", value: "in-progress" },
  { label: "On Hold", value: "on-hold" },
  { label: "Completed", value: "completed" },
];

// Member options for project details
export const memberOptions = [
  { value: "u1", label: "Dr. Sarah Johnson - Principal Investigator" },
  { value: "u2", label: "Mark Williams - Research Scientist" },
  { value: "u3", label: "Dr. Emily Chen - Project Lead" },
  { value: "u4", label: "James Rodriguez - Lab Technician" },
  { value: "u5", label: "Olivia Taylor - Microbiologist" },
  { value: "u6", label: "Robert Kim - Equipment Specialist" }
];

// Color schemes for charts and UI
export const chartColors = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // purple
  "#06b6d4", // cyan
  "#84cc16", // lime
  "#f97316"  // orange
];

// Progress colors
export const progressColors = {
  high: "#ef4444",
  medium: "#f59e0b", 
  low: "#10b981"
};

// Status colors
export const statusColors = {
  "Pending": "#f59e0b",
  "In Progress": "#3b82f6",
  "Completed": "#10b981",
  "On Hold": "#f97316",
  "Cancelled": "#ef4444"
};

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

// Task status configurations
export const taskStatusConfig = {
  'completed': {
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    label: 'Completed'
  },
  'in_progress': {
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    label: 'In Progress'
  },
  'review': {
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    label: 'Review'
  },
  'pending': {
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    label: 'Pending'
  },
  'on_hold': {
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    label: 'On Hold'
  }
};

// Task priority configurations
export const taskPriorityConfig = {
  'high': {
    color: 'bg-red-100 text-red-800 border-red-200',
    label: 'High'
  },
  'medium': {
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    label: 'Medium'
  },
  'low': {
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    label: 'Low'
  }
};

// Member role configurations
export const memberRoleConfig = {
  'Project Lead': {
    bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
    text: 'text-white',
    icon: 'Crown',
    glow: 'shadow-blue-200'
  },
  'Data Scientist': {
    bg: 'bg-gradient-to-r from-purple-500 to-purple-600',
    text: 'text-white',
    icon: 'Zap',
    glow: 'shadow-purple-200'
  },
  'Developer': {
    bg: 'bg-gradient-to-r from-green-500 to-green-600',
    text: 'text-white',
    icon: 'Shield',
    glow: 'shadow-green-200'
  },
  'Designer': {
    bg: 'bg-gradient-to-r from-pink-500 to-pink-600',
    text: 'text-white',
    icon: 'Star',
    glow: 'shadow-pink-200'
  },
  'QA Engineer': {
    bg: 'bg-gradient-to-r from-amber-500 to-amber-600',
    text: 'text-white',
    icon: 'Award',
    glow: 'shadow-amber-200'
  },
  'Lab Technician': {
    bg: 'bg-gradient-to-r from-cyan-500 to-cyan-600',
    text: 'text-white',
    icon: 'Beaker',
    glow: 'shadow-cyan-200'
  },
  'Research Assistant': {
    bg: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
    text: 'text-white',
    icon: 'Microscope',
    glow: 'shadow-indigo-200'
  },
  'Principal Investigator': {
    bg: 'bg-gradient-to-r from-red-500 to-red-600',
    text: 'text-white',
    icon: 'Crown',
    glow: 'shadow-red-200'
  }
};

// Status color configurations for team members
export const memberStatusConfig = {
  'online': {
    color: 'bg-green-400 border-green-300',
    label: 'Online'
  },
  'away': {
    color: 'bg-yellow-400 border-yellow-300',
    label: 'Away'
  },
  'busy': {
    color: 'bg-red-400 border-red-300',
    label: 'Busy'
  },
  'offline': {
    color: 'bg-gray-300 border-gray-200',
    label: 'Offline'
  }
};

// Workload color configurations
export const workloadConfig = {
  high: {
    color: 'text-red-600 bg-red-50',
    threshold: 80
  },
  medium: {
    color: 'text-amber-600 bg-amber-50',
    threshold: 60
  },
  low: {
    color: 'text-green-600 bg-green-50',
    threshold: 0
  }
};

// Stat progress color configurations
export const statProgressColors = {
  blue: { 
    bg: "from-blue-50 to-blue-100", 
    progress: "bg-gradient-to-r from-blue-500 to-blue-600", 
    text: "text-blue-700", 
    icon: "text-blue-600" 
  },
  green: { 
    bg: "from-green-50 to-green-100", 
    progress: "bg-gradient-to-r from-green-500 to-green-600", 
    text: "text-green-700", 
    icon: "text-green-600" 
  },
  yellow: { 
    bg: "from-amber-50 to-amber-100", 
    progress: "bg-gradient-to-r from-amber-500 to-amber-600", 
    text: "text-amber-700", 
    icon: "text-amber-600" 
  },
  purple: { 
    bg: "from-purple-50 to-purple-100", 
    progress: "bg-gradient-to-r from-purple-500 to-purple-600", 
    text: "text-purple-700", 
    icon: "text-purple-600" 
  }
};

// Priority order for sorting
export const priorityOrder = { 
  high: 3, 
  medium: 2, 
  low: 1 
};

// Status order for sorting
export const statusOrder = { 
  completed: 3, 
  in_progress: 2, 
  pending: 1,
  on_hold: 0
};

// Milestone status configurations
export const milestoneStatusConfig = {
  'completed': {
    color: 'bg-green-100 text-green-700 border-green-200',
    label: 'Completed'
  },
  'in_progress': {
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    label: 'In Progress'
  },
  'upcoming': {
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    label: 'Upcoming'
  },
  'overdue': {
    color: 'bg-red-100 text-red-700 border-red-200',
    label: 'Overdue'
  },
  'pending': {
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    label: 'Pending'
  }
};
