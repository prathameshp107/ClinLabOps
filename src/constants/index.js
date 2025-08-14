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