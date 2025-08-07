// Constants and configuration data

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

// Project status options
export const projectStatuses = [
    { value: "Not Started", label: "Not Started" },
    { value: "In Progress", label: "In Progress" },
    { value: "On Hold", label: "On Hold" },
    { value: "Completed", label: "Completed" },
    { value: "Cancelled", label: "Cancelled" },
    { value: "Pending", label: "Pending" }
];

// Project priority options
export const projectPriorities = [
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
    { value: "Critical", label: "Critical" }
];

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

// Status options for dialogs
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

// Task templates for dialog
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

// Subtask priorities and statuses
export const subtaskPriorities = ["high", "medium", "low"];
export const subtaskStatuses = ["not_started", "in_progress", "completed"];

// Common tags for projects
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

// Chart colors
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

// Progress colors for stats
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
};// P
riority order for sorting
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

// Member status configurations
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

// Workload configurations
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

// Research areas
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

// Study types
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

// Data collection frequencies
export const dataCollectionFrequencies = [
    "Daily",
    "Weekly",
    "Monthly",
    "Quarterly",
    "Annually",
    "As needed",
    "Continuous"
];

// Status chips for filtering
export const statusChips = [
    { label: "All", value: "all" },
    { label: "In Progress", value: "in-progress" },
    { label: "On Hold", value: "on-hold" },
    { label: "Completed", value: "completed" },
];

// Note: Mock data has been removed - now using real API data