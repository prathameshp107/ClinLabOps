// Centralized mock data for experiments

// Simple experiment list (from tasks-data.js)
export const mockExperiments = [
    { id: 'e1', name: 'Compound A Toxicity Study' },
    { id: 'e2', name: 'Compound B Efficacy Test' },
    { id: 'e3', name: 'Compound C Cellular Study' },
    { id: 'e4', name: 'Biomarker Analysis Project' },
    { id: 'exp1', name: 'Cell Culture' },
    { id: 'exp2', name: 'DNA Sequencing' },
    { id: 'exp3', name: 'Chemical Analysis' }
];

// Experiment progress data (from dashboard-data.js)
export const experimentProgressData = [
    {
        id: 'exp-001',
        name: 'Enzyme Stability Analysis',
        status: 'in-progress',
        progress: 68,
        startDate: '2025-03-15T08:30:00',
        endDate: '2025-03-29T17:00:00',
        department: 'Biochemistry',
        priority: 'high',
        owner: 'Dr. Sarah Miller'
    },
    {
        id: 'exp-002',
        name: 'Substrate Specificity Assay',
        status: 'in-progress',
        progress: 45,
        startDate: '2025-03-18T09:15:00',
        endDate: '2025-04-01T16:30:00',
        department: 'Molecular Biology',
        priority: 'medium',
        owner: 'Dr. Alex Johnson'
    },
    {
        id: 'exp-003',
        name: 'Protein Folding Kinetics',
        status: 'delayed',
        progress: 32,
        startDate: '2025-03-12T10:00:00',
        endDate: '2025-03-26T17:00:00',
        department: 'Biochemistry',
        priority: 'high',
        owner: 'Dr. Emily Wong'
    },
    {
        id: 'exp-004',
        name: 'Gene Expression Analysis',
        status: 'completed',
        progress: 100,
        startDate: '2025-03-10T08:00:00',
        endDate: '2025-03-20T15:45:00',
        department: 'Genetics',
        priority: 'medium',
        owner: 'Dr. James Rivera'
    },
    {
        id: 'exp-005',
        name: 'Cell Culture Optimization',
        status: 'scheduled',
        progress: 0,
        startDate: '2025-03-25T09:00:00',
        endDate: '2025-04-08T16:00:00',
        department: 'Cell Biology',
        priority: 'low',
        owner: 'Dr. David Chen'
    }
];

// Experiments dashboard data (from dashboard-data.js)
export const experimentsDashboardData = {
    activeExperiments: [
        {
            id: 'EXP-2023-042',
            title: 'Protein Expression Analysis',
            startDate: '2023-03-20',
            endDate: '2023-04-10',
            lead: 'Maria Garcia',
            status: 'in-progress',
            progress: 65,
            priority: 'high'
        },
        {
            id: 'EXP-2023-043',
            title: 'Enzyme Kinetics Study',
            startDate: '2023-03-15',
            endDate: '2023-04-05',
            lead: 'Sarah Chen',
            status: 'in-progress',
            progress: 40,
            priority: 'medium'
        },
        {
            id: 'EXP-2023-044',
            title: 'Compound Stability Testing',
            startDate: '2023-03-25',
            endDate: '2023-04-15',
            lead: 'David Kim',
            status: 'in-progress',
            progress: 25,
            priority: 'medium'
        }
    ],
    completedExperiments: [
        {
            id: 'EXP-2023-039',
            title: 'Antibody Characterization',
            startDate: '2023-03-01',
            endDate: '2023-03-22',
            lead: 'Alex Johnson',
            status: 'completed',
            progress: 100,
            priority: 'high'
        },
        {
            id: 'EXP-2023-040',
            title: 'Cell Viability Assay',
            startDate: '2023-03-05',
            endDate: '2023-03-25',
            lead: 'James Wilson',
            status: 'completed',
            progress: 100,
            priority: 'medium'
        }
    ],
    experimentTypes: [
        { name: 'Analytical', count: 12, color: '#3b82f6' },
        { name: 'Biochemical', count: 8, color: '#8b5cf6' },
        { name: 'Cell-based', count: 5, color: '#10b981' },
        { name: 'Stability', count: 7, color: '#f59e0b' }
    ],
    successRate: {
        overall: 87,
        byType: [
            { name: 'Analytical', rate: 92 },
            { name: 'Biochemical', rate: 85 },
            { name: 'Cell-based', rate: 78 },
            { name: 'Stability', rate: 90 }
        ]
    }
};

// Full experiment objects (static, based on generateMockExperiments)
export const mockExperimentsFull = [
    {
        id: 'exp-1',
        title: 'Protein Crystallization Analysis',
        description: 'This experiment aims to analyze protein crystallization. The study will provide valuable insights into protein structure.',
        protocol: 'Standard crystallization protocol',
        status: 'planning',
        priority: 'high',
        createdAt: '2023-01-10T09:00:00Z',
        updatedAt: '2023-01-15T10:00:00Z',
        startDate: '2023-01-12T09:00:00Z',
        endDate: '2023-01-26T17:00:00Z',
        teamMembers: ['John Smith', 'Maria Rodriguez'],
        version: 1,
        versionHistory: [
            {
                version: 1,
                updatedAt: '2023-01-15T10:00:00Z',
                updatedBy: 'John Smith',
                changes: 'Initial version'
            }
        ]
    },
    {
        id: 'exp-2',
        title: 'DNA Sequencing of Bacterial Strains',
        description: 'This experiment aims to sequence DNA of various bacterial strains. The study will provide valuable insights into genetic diversity.',
        protocol: 'Standard DNA sequencing protocol',
        status: 'in-progress',
        priority: 'medium',
        createdAt: '2023-02-01T09:00:00Z',
        updatedAt: '2023-02-10T10:00:00Z',
        startDate: '2023-02-03T09:00:00Z',
        endDate: '2023-02-17T17:00:00Z',
        teamMembers: ['David Chen', 'Sarah Johnson'],
        version: 2,
        versionHistory: [
            {
                version: 1,
                updatedAt: '2023-02-05T10:00:00Z',
                updatedBy: 'David Chen',
                changes: 'Initial version'
            },
            {
                version: 2,
                updatedAt: '2023-02-10T10:00:00Z',
                updatedBy: 'Sarah Johnson',
                changes: 'Updated protocol'
            }
        ]
    }
    // ...add more as needed
]; 