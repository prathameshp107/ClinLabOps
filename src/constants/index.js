// Task and subtask constants

export const subtaskPriorities = ['low', 'medium', 'high'];

export const subtaskStatuses = ['not_started', 'in_progress', 'completed'];

export const taskPriorities = ['low', 'medium', 'high', 'urgent'];

export const taskStatuses = ['not_started', 'in_progress', 'completed', 'blocked'];

export const userRoles = ['admin', 'manager', 'user'];

export const projectStatuses = ['planning', 'active', 'on_hold', 'completed', 'cancelled'];

// Avatar constants
export const avatarColors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-yellow-500',
    'bg-lime-500',
    'bg-green-500',
    'bg-emerald-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-sky-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-violet-500',
    'bg-purple-500',
    'bg-fuchsia-500',
    'bg-pink-500',
    'bg-rose-500'
];

export const userStatusColors = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
    offline: 'bg-gray-400'
};

export const avatarSizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
    '2xl': 'h-20 w-20 text-2xl'
};

export const avatarVariantClasses = {
    default: 'ring-2 ring-background',
    outline: 'ring-2 ring-border',
    ghost: 'ring-0'
};
// Project - related constants
export const projectPriorities = ['low', 'medium', 'high', 'critical'];

export const researchAreas = [
    'Oncology',
    'Cardiology',
    'Neuroscience',
    'Immunology',
    'Genetics',
    'Pharmacology',
    'Microbiology',
    'Biochemistry',
    'Molecular Biology',
    'Clinical Research',
    'Epidemiology',
    'Biostatistics'
];

export const studyTypes = [
    'Clinical Trial',
    'Observational Study',
    'Laboratory Research',
    'Meta-Analysis',
    'Case Study',
    'Cohort Study',
    'Cross-sectional Study',
    'Randomized Controlled Trial',
    'Systematic Review',
    'Pilot Study'
];

export const dataCollectionFrequencies = [
    'Daily',
    'Weekly',
    'Bi-weekly',
    'Monthly',
    'Quarterly',
    'Semi-annually',
    'Annually',
    'As needed',
    'Continuous',
    'One-time'
];

export const commonTags = [
    'Urgent',
    'Research',
    'Clinical',
    'Laboratory',
    'Data Analysis',
    'Documentation',
    'Review',
    'Approval',
    'Testing',
    'Quality Control',
    'Compliance',
    'Training',
    'Meeting',
    'Presentation',
    'Report',
    'Follow-up'
];

import { CheckCircle2, Clock, AlertCircle, XCircle, Flag, AlertTriangle } from "lucide-react";

// Task dialog constants
export const statusOptions = [
    {
        value: 'todo',
        label: 'To Do',
        icon: Clock,
        bgColor: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
        borderColor: 'border-gray-300 dark:border-gray-600'
    },
    {
        value: 'in-progress',
        label: 'In Progress',
        icon: AlertCircle,
        bgColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        borderColor: 'border-blue-300 dark:border-blue-600'
    },
    {
        value: 'review',
        label: 'Review',
        icon: CheckCircle2,
        bgColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        borderColor: 'border-yellow-300 dark:border-yellow-600'
    },
    {
        value: 'done',
        label: 'Done',
        icon: CheckCircle2,
        bgColor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        borderColor: 'border-green-300 dark:border-green-600'
    }
];

export const priorityOptions = [
    {
        value: 'low',
        label: 'Low',
        icon: Flag,
        bgColor: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
        borderColor: 'border-gray-300 dark:border-gray-600'
    },
    {
        value: 'medium',
        label: 'Medium',
        icon: Flag,
        bgColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        borderColor: 'border-yellow-300 dark:border-yellow-600'
    },
    {
        value: 'high',
        label: 'High',
        icon: AlertTriangle,
        bgColor: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
        borderColor: 'border-orange-300 dark:border-orange-600'
    },
    {
        value: 'urgent',
        label: 'Urgent',
        icon: AlertTriangle,
        bgColor: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        borderColor: 'border-red-300 dark:border-red-600'
    }
];

export const dialogTaskTemplates = [
    {
        id: 'data-collection',
        name: 'Data Collection',
        description: 'Collect and organize research data',
        priority: 'medium',
        estimatedHours: 8
    },
    {
        id: 'analysis',
        name: 'Data Analysis',
        description: 'Analyze collected data and generate insights',
        priority: 'high',
        estimatedHours: 16
    },
    {
        id: 'documentation',
        name: 'Documentation',
        description: 'Document procedures and findings',
        priority: 'medium',
        estimatedHours: 4
    },
    {
        id: 'review',
        name: 'Review',
        description: 'Review and validate work',
        priority: 'low',
        estimatedHours: 2
    }
];

export const taskOrder = [
    { value: 'created_asc', label: 'Created (Oldest First)' },
    { value: 'created_desc', label: 'Created (Newest First)' },
    { value: 'updated_asc', label: 'Updated (Oldest First)' },
    { value: 'updated_desc', label: 'Updated (Newest First)' },
    { value: 'priority_asc', label: 'Priority (Low to High)' },
    { value: 'priority_desc', label: 'Priority (High to Low)' },
    { value: 'due_date_asc', label: 'Due Date (Earliest First)' },
    { value: 'due_date_desc', label: 'Due Date (Latest First)' },
    { value: 'title_asc', label: 'Title (A to Z)' },
    { value: 'title_desc', label: 'Title (Z to A)' }
];

// Team member role configurations
export const memberRoleConfig = {
    'Project Lead': {
        icon: 'Crown',
        bg: 'bg-gradient-to-r from-amber-100 to-amber-200',
        text: 'text-amber-800',
        glow: 'shadow-amber-200/50',
        priority: 1
    },
    'Senior Researcher': {
        icon: 'Zap',
        bg: 'bg-gradient-to-r from-purple-100 to-purple-200',
        text: 'text-purple-800',
        glow: 'shadow-purple-200/50',
        priority: 2
    },
    'Research Scientist': {
        icon: 'Shield',
        bg: 'bg-gradient-to-r from-blue-100 to-blue-200',
        text: 'text-blue-800',
        glow: 'shadow-blue-200/50',
        priority: 3
    },
    'Data Analyst': {
        icon: 'Star',
        bg: 'bg-gradient-to-r from-green-100 to-green-200',
        text: 'text-green-800',
        glow: 'shadow-green-200/50',
        priority: 4
    },
    'Lab Technician': {
        icon: 'Beaker',
        bg: 'bg-gradient-to-r from-teal-100 to-teal-200',
        text: 'text-teal-800',
        glow: 'shadow-teal-200/50',
        priority: 5
    },
    'Research Assistant': {
        icon: 'Microscope',
        bg: 'bg-gradient-to-r from-indigo-100 to-indigo-200',
        text: 'text-indigo-800',
        glow: 'shadow-indigo-200/50',
        priority: 6
    },
    'Intern': {
        icon: 'Users',
        bg: 'bg-gradient-to-r from-gray-100 to-gray-200',
        text: 'text-gray-800',
        glow: 'shadow-gray-200/50',
        priority: 7
    }
};

// Team member status configurations
export const memberStatusConfig = {
    online: {
        color: 'bg-green-400',
        text: 'text-green-600',
        label: 'Online',
        indicator: 'animate-pulse'
    },
    away: {
        color: 'bg-yellow-400',
        text: 'text-yellow-600',
        label: 'Away',
        indicator: ''
    },
    busy: {
        color: 'bg-red-400',
        text: 'text-red-600',
        label: 'Busy',
        indicator: 'animate-pulse'
    },
    offline: {
        color: 'bg-gray-400',
        text: 'text-gray-600',
        label: 'Offline',
        indicator: ''
    }
};

// Workload configurations
export const workloadConfig = {
    low: {
        threshold: 0,
        color: 'bg-green-100 text-green-800',
        label: 'Light Load'
    },
    medium: {
        threshold: 50,
        color: 'bg-yellow-100 text-yellow-800',
        label: 'Moderate Load'
    },
    high: {
        threshold: 80,
        color: 'bg-red-100 text-red-800',
        label: 'Heavy Load'
    }
};

// Milestone status configurations
export const milestoneStatusConfig = {
    pending: {
        color: 'bg-gray-100 text-gray-700 border-gray-300',
        label: 'Pending',
        icon: 'Clock'
    },
    upcoming: {
        color: 'bg-blue-100 text-blue-700 border-blue-300',
        label: 'Upcoming',
        icon: 'Calendar'
    },
    in_progress: {
        color: 'bg-amber-100 text-amber-700 border-amber-300',
        label: 'In Progress',
        icon: 'Clock'
    },
    overdue: {
        color: 'bg-red-100 text-red-700 border-red-300',
        label: 'Overdue',
        icon: 'AlertCircle'
    },
    completed: {
        color: 'bg-green-100 text-green-700 border-green-300',
        label: 'Completed',
        icon: 'CheckCircle2'
    }
};

// Task status configurations
export const taskStatusConfig = {
    pending: {
        color: 'bg-gray-100 text-gray-800 border-gray-300',
        label: 'Pending'
    },
    not_started: {
        color: 'bg-gray-100 text-gray-800 border-gray-300',
        label: 'Not Started'
    },
    in_progress: {
        color: 'bg-blue-100 text-blue-800 border-blue-300',
        label: 'In Progress'
    },
    review: {
        color: 'bg-amber-100 text-amber-800 border-amber-300',
        label: 'In Review'
    },
    completed: {
        color: 'bg-green-100 text-green-800 border-green-300',
        label: 'Completed'
    },
    blocked: {
        color: 'bg-red-100 text-red-800 border-red-300',
        label: 'Blocked'
    }
};

// Task priority configurations
export const taskPriorityConfig = {
    low: {
        color: 'bg-green-100 text-green-800 border-green-300',
        label: 'Low Priority'
    },
    medium: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        label: 'Medium Priority'
    },
    high: {
        color: 'bg-orange-100 text-orange-800 border-orange-300',
        label: 'High Priority'
    },
    urgent: {
        color: 'bg-red-100 text-red-800 border-red-300',
        label: 'Urgent'
    }
};

// Priority ordering for sorting (lower number = higher priority)
export const priorityOrder = {
    urgent: 1,
    high: 2,
    medium: 3,
    low: 4
};

// Status ordering for sorting (represents workflow progression)
export const statusOrder = {
    not_started: 1,
    pending: 2,
    in_progress: 3,
    review: 4,
    completed: 5,
    blocked: 6
};

// Statistical progress color configurations
export const statProgressColors = {
    blue: {
        bg: 'from-blue-50/50 to-blue-100/30',
        text: 'text-blue-700',
        icon: 'text-blue-600',
        progress: 'bg-blue-500'
    },
    green: {
        bg: 'from-green-50/50 to-green-100/30',
        text: 'text-green-700',
        icon: 'text-green-600',
        progress: 'bg-green-500'
    },
    purple: {
        bg: 'from-purple-50/50 to-purple-100/30',
        text: 'text-purple-700',
        icon: 'text-purple-600',
        progress: 'bg-purple-500'
    },
    amber: {
        bg: 'from-amber-50/50 to-amber-100/30',
        text: 'text-amber-700',
        icon: 'text-amber-600',
        progress: 'bg-amber-500'
    },
    red: {
        bg: 'from-red-50/50 to-red-100/30',
        text: 'text-red-700',
        icon: 'text-red-600',
        progress: 'bg-red-500'
    },
    indigo: {
        bg: 'from-indigo-50/50 to-indigo-100/30',
        text: 'text-indigo-700',
        icon: 'text-indigo-600',
        progress: 'bg-indigo-500'
    },
    pink: {
        bg: 'from-pink-50/50 to-pink-100/30',
        text: 'text-pink-700',
        icon: 'text-pink-600',
        progress: 'bg-pink-500'
    },
    teal: {
        bg: 'from-teal-50/50 to-teal-100/30',
        text: 'text-teal-700',
        icon: 'text-teal-600',
        progress: 'bg-teal-500'
    }
};