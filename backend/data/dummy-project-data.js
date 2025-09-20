// Project 1: Laboratory Management System (LMS)
const project1 = {
    name: "Laboratory Management System (LMS)",
    description: "A comprehensive laboratory management system designed to streamline research workflows, equipment tracking, and experiment management. This project aims to modernize our laboratory operations with real-time monitoring, automated reporting, and integrated data analysis capabilities.",
    startDate: "2024-01-15",
    endDate: "2024-12-31",
    status: "In Progress",
    priority: "High",
    progress: 68,
    isFavorite: true,
    budget: "$250,000",
    confidential: false,
    complexity: 4,
    department: "Research & Development",
    projectCode: "LMS-2024-001",
    tags: ["laboratory", "management", "automation", "research", "equipment", "monitoring", "data-analysis", "research"],
    category: "research",

    team: [
        {
            id: "TM001",
            name: "Dr. Sarah Chen",
            role: "Project Lead",
            email: "sarah.chen@labtech.com",
            department: "Research & Development",
            avatar: "/avatars/sarah-chen.jpg",
            status: "online"
        },
        {
            id: "TM002",
            name: "Michael Rodriguez",
            role: "Senior Software Engineer",
            email: "michael.rodriguez@labtech.com",
            department: "Engineering",
            avatar: "/avatars/michael-rodriguez.jpg",
            status: "online"
        },
        {
            id: "TM003",
            name: "Dr. Emily Watson",
            role: "Research Scientist",
            email: "emily.watson@labtech.com",
            department: "Research & Development",
            avatar: "/avatars/emily-watson.jpg",
            status: "away"
        },
        {
            id: "TM004",
            name: "Alex Thompson",
            role: "UI/UX Designer",
            email: "alex.thompson@labtech.com",
            department: "Design",
            avatar: "/avatars/alex-thompson.jpg",
            status: "online"
        },
        {
            id: "TM005",
            name: "Dr. James Wilson",
            role: "Lab Technician",
            email: "james.wilson@labtech.com",
            department: "Laboratory",
            avatar: "/avatars/james-wilson.jpg",
            status: "busy"
        },
        {
            id: "TM006",
            name: "Lisa Park",
            role: "Data Analyst",
            email: "lisa.park@labtech.com",
            department: "Analytics",
            avatar: "/avatars/lisa-park.jpg",
            status: "online"
        }
    ],

    tasks: [
        {
            id: "TASK001",
            name: "System Architecture Design",
            status: "Completed",
            assignee: "Michael Rodriguez",
            assigneeId: "TM002",
            dueDate: "2024-02-15",
            priority: "High",
            progress: 100,
            description: "Design the overall system architecture including database schema, API endpoints, and microservices structure."
        },
        {
            id: "TASK002",
            name: "Equipment Tracking Module",
            status: "In Progress",
            assignee: "Dr. James Wilson",
            assigneeId: "TM005",
            dueDate: "2024-04-30",
            priority: "High",
            progress: 75,
            description: "Develop the equipment tracking and management module with RFID integration and maintenance scheduling."
        },
        {
            id: "TASK003",
            name: "User Interface Design",
            status: "In Progress",
            assignee: "Alex Thompson",
            assigneeId: "TM004",
            dueDate: "2024-03-20",
            priority: "Medium",
            progress: 60,
            description: "Create responsive UI designs for all system modules with focus on laboratory workflow optimization."
        },
        {
            id: "TASK004",
            name: "Data Analysis Integration",
            status: "Not Started",
            assignee: "Lisa Park",
            assigneeId: "TM006",
            dueDate: "2024-06-15",
            priority: "Medium",
            progress: 0,
            description: "Integrate advanced data analysis tools and machine learning algorithms for experiment result processing."
        },
        {
            id: "TASK005",
            name: "Security Implementation",
            status: "In Progress",
            assignee: "Michael Rodriguez",
            assigneeId: "TM002",
            dueDate: "2024-05-10",
            priority: "High",
            progress: 45,
            description: "Implement comprehensive security measures including user authentication, data encryption, and access controls."
        },
        {
            id: "TASK006",
            name: "Testing Protocol Development",
            status: "Not Started",
            assignee: "Dr. Emily Watson",
            assigneeId: "TM003",
            dueDate: "2024-07-01",
            priority: "Medium",
            progress: 0,
            description: "Develop comprehensive testing protocols and validation procedures for laboratory equipment integration."
        },
        {
            id: "TASK007",
            name: "Documentation and Training",
            status: "Not Started",
            assignee: "Dr. Sarah Chen",
            assigneeId: "TM001",
            dueDate: "2024-11-30",
            priority: "Low",
            progress: 0,
            description: "Create comprehensive user documentation and training materials for laboratory staff."
        }
    ],

    documents: [
        {
            id: "DOC001",
            name: "LMS_System_Requirements_Specification.pdf",
            type: "pdf",
            size: 2048576,
            uploadedBy: "Dr. Sarah Chen",
            uploadedAt: "2024-01-20",
            lastModified: "2024-01-25",
            tags: ["requirements", "specification", "system-design"],
            status: "active"
        },
        {
            id: "DOC002",
            name: "Equipment_Integration_Protocol.docx",
            type: "docx",
            size: 1536000,
            uploadedBy: "Dr. James Wilson",
            uploadedAt: "2024-02-10",
            lastModified: "2024-02-15",
            tags: ["equipment", "protocol", "integration"],
            status: "active"
        },
        {
            id: "DOC003",
            name: "UI_Design_Mockups.pptx",
            type: "pptx",
            size: 5120000,
            uploadedBy: "Alex Thompson",
            uploadedAt: "2024-02-28",
            lastModified: "2024-03-05",
            tags: ["design", "mockups", "ui-ux"],
            status: "active"
        },
        {
            id: "DOC004",
            name: "Database_Schema_Diagram.xlsx",
            type: "xlsx",
            size: 1024000,
            uploadedBy: "Michael Rodriguez",
            uploadedAt: "2024-01-30",
            lastModified: "2024-02-10",
            tags: ["database", "schema", "technical"],
            status: "active"
        },
        {
            id: "DOC005",
            name: "Security_Audit_Report.pdf",
            type: "pdf",
            size: 3072000,
            uploadedBy: "Michael Rodriguez",
            uploadedAt: "2024-03-15",
            lastModified: "2024-03-20",
            tags: ["security", "audit", "compliance"],
            status: "review"
        },
        {
            id: "DOC006",
            name: "Lab_Equipment_Inventory.xlsx",
            type: "xlsx",
            size: 2048000,
            uploadedBy: "Dr. James Wilson",
            uploadedAt: "2024-02-05",
            lastModified: "2024-02-12",
            tags: ["inventory", "equipment", "tracking"],
            status: "active"
        },
        {
            id: "DOC007",
            name: "Data_Analysis_Requirements.docx",
            type: "docx",
            size: 1792000,
            uploadedBy: "Lisa Park",
            uploadedAt: "2024-03-01",
            lastModified: "2024-03-10",
            tags: ["data-analysis", "requirements", "analytics"],
            status: "active"
        },
        {
            id: "DOC008",
            name: "Old_System_Documentation.pdf",
            type: "pdf",
            size: 4096000,
            uploadedBy: "Dr. Emily Watson",
            uploadedAt: "2024-01-15",
            lastModified: "2024-01-15",
            tags: ["legacy", "documentation", "reference"],
            status: "archived"
        }
    ],

    milestones: [
        {
            id: "MIL001",
            name: "Project Kickoff",
            date: "2024-01-15",
            status: "Completed",
            description: "Project officially started with team assembly and initial planning phase completed."
        },
        {
            id: "MIL002",
            name: "Requirements Finalization",
            date: "2024-02-15",
            status: "Completed",
            description: "All system requirements documented and approved by stakeholders."
        },
        {
            id: "MIL003",
            name: "System Architecture Complete",
            date: "2024-03-15",
            status: "Completed",
            description: "System architecture design finalized and technical specifications approved."
        },
        {
            id: "MIL004",
            name: "UI/UX Design Complete",
            date: "2024-04-15",
            status: "In Progress",
            description: "User interface and experience design completed and ready for development."
        },
        {
            id: "MIL005",
            name: "Core Development Phase",
            date: "2024-06-30",
            status: "In Progress",
            description: "Core system modules developed and integrated with basic functionality."
        },
        {
            id: "MIL006",
            name: "Equipment Integration",
            date: "2024-08-15",
            status: "Not Started",
            description: "Laboratory equipment successfully integrated with the management system."
        },
        {
            id: "MIL007",
            name: "Testing Phase",
            date: "2024-10-15",
            status: "Not Started",
            description: "Comprehensive testing completed including unit, integration, and user acceptance testing."
        },
        {
            id: "MIL008",
            name: "System Deployment",
            date: "2024-12-15",
            status: "Not Started",
            description: "System deployed to production environment with full functionality."
        }
    ],

    dependencies: [
        {
            id: "DEP001",
            sourceId: "TASK001",
            sourceName: "System Architecture Design",
            targetId: "TASK002",
            targetName: "Equipment Tracking Module",
            type: "finish-to-start",
            created: "2024-01-20"
        },
        {
            id: "DEP002",
            sourceId: "TASK003",
            sourceName: "User Interface Design",
            targetId: "TASK002",
            targetName: "Equipment Tracking Module",
            type: "finish-to-start",
            created: "2024-02-01"
        },
        {
            id: "DEP003",
            sourceId: "TASK002",
            sourceName: "Equipment Tracking Module",
            targetId: "TASK006",
            targetName: "Testing Protocol Development",
            type: "finish-to-start",
            created: "2024-02-15"
        },
        {
            id: "DEP004",
            sourceId: "TASK005",
            sourceName: "Security Implementation",
            targetId: "TASK007",
            targetName: "Documentation and Training",
            type: "finish-to-start",
            created: "2024-03-01"
        }
    ],

    activityLog: [
        {
            id: "ACT001",
            userId: "TM001",
            action: "Project Created",
            timestamp: "2024-01-15T09:00:00Z",
            details: "Laboratory Management System project created",
            user: "Dr. Sarah Chen",
            task: "",
            taskId: "",
            comment: "Project kickoff initiated with initial team assembly",
            document: "",
            documentId: "",
            type: "project",
            time: "2024-01-15 09:00"
        },
        {
            id: "ACT002",
            userId: "TM002",
            action: "Task Completed",
            timestamp: "2024-02-15T14:30:00Z",
            details: "System Architecture Design completed",
            user: "Michael Rodriguez",
            task: "System Architecture Design",
            taskId: "TASK001",
            comment: "Architecture design finalized and approved by stakeholders",
            document: "",
            documentId: "",
            type: "task",
            time: "2024-02-15 14:30"
        },
        {
            id: "ACT003",
            userId: "TM004",
            action: "Document Uploaded",
            timestamp: "2024-02-28T11:15:00Z",
            details: "UI Design Mockups uploaded",
            user: "Alex Thompson",
            task: "",
            taskId: "",
            comment: "Initial UI mockups for laboratory interface",
            document: "UI_Design_Mockups.pptx",
            documentId: "DOC003",
            type: "document",
            time: "2024-02-28 11:15"
        },
        {
            id: "ACT004",
            userId: "TM005",
            action: "Task Updated",
            timestamp: "2024-03-10T16:45:00Z",
            details: "Equipment Tracking Module progress updated to 75%",
            user: "Dr. James Wilson",
            task: "Equipment Tracking Module",
            taskId: "TASK002",
            comment: "RFID integration module completed, moving to testing phase",
            document: "",
            documentId: "",
            type: "task",
            time: "2024-03-10 16:45"
        },
        {
            id: "ACT005",
            userId: "TM002",
            action: "Document Commented",
            timestamp: "2024-03-15T10:20:00Z",
            details: "Security Audit Report reviewed",
            user: "Michael Rodriguez",
            task: "",
            taskId: "",
            comment: "Security measures implemented according to industry standards",
            document: "Security_Audit_Report.pdf",
            documentId: "DOC005",
            type: "document",
            time: "2024-03-15 10:20"
        },
        {
            id: "ACT006",
            userId: "TM006",
            action: "Task Started",
            timestamp: "2024-03-20T13:00:00Z",
            details: "Data Analysis Integration task initiated",
            user: "Lisa Park",
            task: "Data Analysis Integration",
            taskId: "TASK004",
            comment: "Beginning analysis of data processing requirements",
            document: "",
            documentId: "",
            type: "task",
            time: "2024-03-20 13:00"
        },
        {
            id: "ACT007",
            userId: "TM001",
            action: "Milestone Updated",
            timestamp: "2024-03-25T09:30:00Z",
            details: "UI/UX Design milestone status updated",
            user: "Dr. Sarah Chen",
            task: "",
            taskId: "",
            comment: "Design phase progressing well, on track for April completion",
            document: "",
            documentId: "",
            type: "milestone",
            time: "2024-03-25 09:30"
        },
        {
            id: "ACT008",
            userId: "TM003",
            action: "Document Archived",
            timestamp: "2024-03-28T15:15:00Z",
            details: "Old System Documentation archived",
            user: "Dr. Emily Watson",
            task: "",
            taskId: "",
            comment: "Legacy documentation moved to archive for reference",
            document: "Old_System_Documentation.pdf",
            documentId: "DOC008",
            type: "document",
            time: "2024-03-28 15:15"
        }
    ]
};

// Additional helper functions for data manipulation
const getProjectStats = (project) => {
    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(task => task.status === 'Completed').length;
    const inProgressTasks = project.tasks.filter(task => task.status === 'In Progress').length;
    const notStartedTasks = project.tasks.filter(task => task.status === 'Not Started').length;

    const totalTeamMembers = project.team.length;
    const onlineMembers = project.team.filter(member => member.status === 'online').length;

    const totalDocuments = project.documents.length;
    const activeDocuments = project.documents.filter(doc => doc.status === 'active').length;

    const completedMilestones = project.milestones.filter(milestone => milestone.status === 'Completed').length;
    const totalMilestones = project.milestones.length;

    return {
        tasks: { total: totalTasks, completed: completedTasks, inProgress: inProgressTasks, notStarted: notStartedTasks },
        team: { total: totalTeamMembers, online: onlineMembers },
        documents: { total: totalDocuments, active: activeDocuments },
        milestones: { total: totalMilestones, completed: completedMilestones },
        progress: project.progress
    };
};

const getRecentActivity = (project, limit = 5) => {
    return project.activityLog
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit);
};

const getTeamWorkload = (project) => {
    return project.team.map(member => {
        const assignedTasks = project.tasks.filter(task => task.assigneeId === member.id);
        const completedTasks = assignedTasks.filter(task => task.status === 'Completed').length;
        const totalTasks = assignedTasks.length;
        const workload = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        return {
            ...member,
            assignedTasks: totalTasks,
            completedTasks,
            workload
        };
    });
};

const getDocumentStats = (project) => {
    const typeCounts = project.documents.reduce((acc, doc) => {
        acc[doc.type] = (acc[doc.type] || 0) + 1;
        return acc;
    }, {});

    const statusCounts = project.documents.reduce((acc, doc) => {
        acc[doc.status] = (acc[doc.status] || 0) + 1;
        return acc;
    }, {});

    const totalSize = project.documents.reduce((sum, doc) => sum + doc.size, 0);

    return {
        typeCounts,
        statusCounts,
        totalSize,
        averageSize: project.documents.length > 0 ? Math.round(totalSize / project.documents.length) : 0
    };
};

// Project 2: Drug Discovery Platform
const project2 = {
    name: "Drug Discovery Platform (DDP)",
    description: "Advanced computational platform for accelerating drug discovery through AI-powered molecular analysis, virtual screening, and predictive modeling. This project integrates machine learning algorithms with laboratory automation to identify promising drug candidates faster and more efficiently.",
    startDate: "2024-02-01",
    endDate: "2025-01-31",
    status: "In Progress",
    priority: "Critical",
    progress: 45,
    isFavorite: true,
    budget: "$500,000",
    confidential: true,
    complexity: 5,
    department: "Pharmaceutical Research",
    projectCode: "DDP-2024-002",
    tags: ["drug-discovery", "ai", "machine-learning", "pharmaceutical", "automation", "molecular-analysis", "research"],
    category: "research",

    team: [
        {
            id: "TM007",
            name: "Dr. Maria Gonzalez",
            role: "Principal Investigator",
            email: "maria.gonzalez@pharmatech.com",
            department: "Pharmaceutical Research",
            avatar: "/avatars/maria-gonzalez.jpg",
            status: "online"
        },
        {
            id: "TM008",
            name: "Dr. Robert Kim",
            role: "Computational Biologist",
            email: "robert.kim@pharmatech.com",
            department: "Bioinformatics",
            avatar: "/avatars/robert-kim.jpg",
            status: "online"
        },
        {
            id: "TM009",
            name: "Jennifer Liu",
            role: "ML Engineer",
            email: "jennifer.liu@pharmatech.com",
            department: "Data Science",
            avatar: "/avatars/jennifer-liu.jpg",
            status: "busy"
        },
        {
            id: "TM010",
            name: "Dr. Ahmed Hassan",
            role: "Medicinal Chemist",
            email: "ahmed.hassan@pharmatech.com",
            department: "Chemistry",
            avatar: "/avatars/ahmed-hassan.jpg",
            status: "online"
        },
        {
            id: "TM011",
            name: "Rachel Green",
            role: "Laboratory Automation Specialist",
            email: "rachel.green@pharmatech.com",
            department: "Automation",
            avatar: "/avatars/rachel-green.jpg",
            status: "away"
        }
    ],

    tasks: [
        {
            id: "TASK008",
            name: "AI Model Development",
            status: "In Progress",
            assignee: "Jennifer Liu",
            assigneeId: "TM009",
            dueDate: "2024-05-15",
            priority: "High",
            progress: 70,
            description: "Develop and train machine learning models for molecular property prediction and drug-target interaction analysis."
        },
        {
            id: "TASK009",
            name: "Virtual Screening Pipeline",
            status: "In Progress",
            assignee: "Dr. Robert Kim",
            assigneeId: "TM008",
            dueDate: "2024-04-30",
            priority: "High",
            progress: 55,
            description: "Build automated virtual screening pipeline for compound library analysis and hit identification."
        },
        {
            id: "TASK010",
            name: "Laboratory Automation Integration",
            status: "Not Started",
            assignee: "Rachel Green",
            assigneeId: "TM011",
            dueDate: "2024-06-30",
            priority: "Medium",
            progress: 0,
            description: "Integrate robotic systems with the computational platform for automated compound synthesis and testing."
        },
        {
            id: "TASK011",
            name: "Compound Database Curation",
            status: "Completed",
            assignee: "Dr. Ahmed Hassan",
            assigneeId: "TM010",
            dueDate: "2024-03-15",
            priority: "High",
            progress: 100,
            description: "Curate and standardize compound databases with chemical properties and biological activity data."
        }
    ],

    documents: [
        {
            id: "DOC009",
            name: "AI_Model_Architecture.pdf",
            type: "pdf",
            size: 3145728,
            uploadedBy: "Jennifer Liu",
            uploadedAt: "2024-03-01",
            tags: ["ai", "architecture", "machine-learning"],
            status: "active"
        },
        {
            id: "DOC010",
            name: "Virtual_Screening_Protocol.docx",
            type: "docx",
            size: 2097152,
            uploadedBy: "Dr. Robert Kim",
            uploadedAt: "2024-02-20",
            tags: ["screening", "protocol", "computational"],
            status: "active"
        }
    ],

    milestones: [
        {
            id: "MIL009",
            name: "Platform Architecture Complete",
            date: "2024-03-31",
            status: "Completed",
            description: "Core platform architecture designed and approved for drug discovery workflows."
        },
        {
            id: "MIL010",
            name: "AI Models Deployed",
            date: "2024-06-30",
            status: "In Progress",
            description: "Machine learning models trained and deployed for molecular analysis."
        }
    ],

    dependencies: [
        {
            id: "DEP005",
            sourceId: "TASK011",
            sourceName: "Compound Database Curation",
            targetId: "TASK008",
            targetName: "AI Model Development",
            type: "finish-to-start",
            created: "2024-02-15"
        }
    ],

    activityLog: [
        {
            id: "ACT009",
            userId: "TM007",
            action: "Project Created",
            timestamp: "2024-02-01T10:00:00Z",
            details: "Drug Discovery Platform project initiated",
            user: "Dr. Maria Gonzalez",
            type: "project",
            time: "2024-02-01 10:00"
        }
    ]
};

// Project 3: Environmental Monitoring System
const project3 = {
    name: "Environmental Monitoring System (EMS)",
    description: "Comprehensive environmental monitoring system for tracking air quality, water contamination, and soil health using IoT sensors and real-time data analytics. This project aims to provide early warning systems for environmental hazards and support regulatory compliance.",
    startDate: "2024-03-01",
    endDate: "2024-11-30",
    status: "In Progress",
    priority: "High",
    progress: 35,
    isFavorite: false,
    budget: "$180,000",
    confidential: false,
    complexity: 3,
    department: "Environmental Science",
    projectCode: "EMS-2024-003",
    tags: ["environmental", "monitoring", "iot", "sensors", "analytics", "compliance", "regulatory"],
    category: "regulatory",

    team: [
        {
            id: "TM012",
            name: "Dr. Elena Petrov",
            role: "Environmental Scientist",
            email: "elena.petrov@envirotech.com",
            department: "Environmental Science",
            avatar: "/avatars/elena-petrov.jpg",
            status: "online"
        },
        {
            id: "TM013",
            name: "Marcus Johnson",
            role: "IoT Engineer",
            email: "marcus.johnson@envirotech.com",
            department: "Engineering",
            avatar: "/avatars/marcus-johnson.jpg",
            status: "online"
        },
        {
            id: "TM014",
            name: "Dr. Yuki Tanaka",
            role: "Data Analyst",
            email: "yuki.tanaka@envirotech.com",
            department: "Analytics",
            avatar: "/avatars/yuki-tanaka.jpg",
            status: "busy"
        }
    ],

    tasks: [
        {
            id: "TASK012",
            name: "Sensor Network Deployment",
            status: "In Progress",
            assignee: "Marcus Johnson",
            assigneeId: "TM013",
            dueDate: "2024-05-31",
            priority: "High",
            progress: 60,
            description: "Deploy IoT sensors across monitoring sites for air, water, and soil quality measurements."
        },
        {
            id: "TASK013",
            name: "Data Analytics Dashboard",
            status: "In Progress",
            assignee: "Dr. Yuki Tanaka",
            assigneeId: "TM014",
            dueDate: "2024-06-15",
            priority: "Medium",
            progress: 40,
            description: "Develop real-time analytics dashboard for environmental data visualization and alerts."
        }
    ],

    documents: [
        {
            id: "DOC011",
            name: "Environmental_Monitoring_Plan.pdf",
            type: "pdf",
            size: 1572864,
            uploadedBy: "Dr. Elena Petrov",
            uploadedAt: "2024-03-05",
            tags: ["monitoring", "plan", "environmental"],
            status: "active"
        }
    ],

    milestones: [
        {
            id: "MIL011",
            name: "Sensor Network Operational",
            date: "2024-06-30",
            status: "In Progress",
            description: "Complete sensor network deployed and operational across all monitoring sites."
        }
    ],

    dependencies: [],

    activityLog: [
        {
            id: "ACT010",
            userId: "TM012",
            action: "Project Created",
            timestamp: "2024-03-01T09:00:00Z",
            details: "Environmental Monitoring System project started",
            user: "Dr. Elena Petrov",
            type: "project",
            time: "2024-03-01 09:00"
        }
    ]
};

// Project 4: Genomics Research Platform
const project4 = {
    name: "Genomics Research Platform (GRP)",
    description: "Next-generation genomics research platform for DNA sequencing, variant analysis, and personalized medicine research. This platform integrates high-throughput sequencing technologies with advanced bioinformatics pipelines for genomic data analysis and interpretation.",
    startDate: "2024-01-01",
    endDate: "2024-10-31",
    status: "In Progress",
    priority: "High",
    progress: 72,
    isFavorite: true,
    budget: "$350,000",
    confidential: true,
    complexity: 4,
    department: "Genomics",
    projectCode: "GRP-2024-004",
    tags: ["genomics", "dna-sequencing", "bioinformatics", "personalized-medicine", "research", "research"],
    category: "research",

    team: [
        {
            id: "TM015",
            name: "Dr. Catherine Wright",
            role: "Genomics Lead",
            email: "catherine.wright@genomics.com",
            department: "Genomics",
            avatar: "/avatars/catherine-wright.jpg",
            status: "online"
        },
        {
            id: "TM016",
            name: "Dr. Raj Patel",
            role: "Bioinformatics Specialist",
            email: "raj.patel@genomics.com",
            department: "Bioinformatics",
            avatar: "/avatars/raj-patel.jpg",
            status: "online"
        },
        {
            id: "TM017",
            name: "Sophie Anderson",
            role: "Laboratory Technician",
            email: "sophie.anderson@genomics.com",
            department: "Laboratory",
            avatar: "/avatars/sophie-anderson.jpg",
            status: "away"
        },
        {
            id: "TM018",
            name: "Dr. Lin Zhang",
            role: "Clinical Researcher",
            email: "lin.zhang@genomics.com",
            department: "Clinical Research",
            avatar: "/avatars/lin-zhang.jpg",
            status: "online"
        }
    ],

    tasks: [
        {
            id: "TASK014",
            name: "Sequencing Pipeline Optimization",
            status: "Completed",
            assignee: "Dr. Raj Patel",
            assigneeId: "TM016",
            dueDate: "2024-03-31",
            priority: "High",
            progress: 100,
            description: "Optimize bioinformatics pipelines for faster and more accurate genomic variant calling."
        },
        {
            id: "TASK015",
            name: "Clinical Sample Processing",
            status: "In Progress",
            assignee: "Sophie Anderson",
            assigneeId: "TM017",
            dueDate: "2024-08-31",
            priority: "High",
            progress: 85,
            description: "Process clinical samples for genomic analysis and maintain sample quality standards."
        },
        {
            id: "TASK016",
            name: "Personalized Medicine Database",
            status: "In Progress",
            assignee: "Dr. Lin Zhang",
            assigneeId: "TM018",
            dueDate: "2024-09-30",
            priority: "Medium",
            progress: 60,
            description: "Build comprehensive database linking genomic variants to clinical outcomes for personalized medicine."
        }
    ],

    documents: [
        {
            id: "DOC012",
            name: "Genomics_Analysis_Protocol.pdf",
            type: "pdf",
            size: 2621440,
            uploadedBy: "Dr. Catherine Wright",
            uploadedAt: "2024-01-15",
            tags: ["genomics", "protocol", "analysis"],
            status: "active"
        },
        {
            id: "DOC013",
            name: "Clinical_Sample_Guidelines.docx",
            type: "docx",
            size: 1048576,
            uploadedBy: "Dr. Lin Zhang",
            uploadedAt: "2024-02-01",
            tags: ["clinical", "samples", "guidelines"],
            status: "active"
        }
    ],

    milestones: [
        {
            id: "MIL012",
            name: "Pipeline Validation Complete",
            date: "2024-04-30",
            status: "Completed",
            description: "Bioinformatics pipelines validated and ready for clinical sample processing."
        },
        {
            id: "MIL013",
            name: "Clinical Database Launch",
            date: "2024-10-15",
            status: "In Progress",
            description: "Personalized medicine database launched with initial clinical correlations."
        }
    ],

    dependencies: [
        {
            id: "DEP006",
            sourceId: "TASK014",
            sourceName: "Sequencing Pipeline Optimization",
            targetId: "TASK015",
            targetName: "Clinical Sample Processing",
            type: "finish-to-start",
            created: "2024-01-15"
        }
    ],

    activityLog: [
        {
            id: "ACT011",
            userId: "TM015",
            action: "Project Created",
            timestamp: "2024-01-01T08:00:00Z",
            details: "Genomics Research Platform project initiated",
            user: "Dr. Catherine Wright",
            type: "project",
            time: "2024-01-01 08:00"
        },
        {
            id: "ACT012",
            userId: "TM016",
            action: "Task Completed",
            timestamp: "2024-03-31T16:00:00Z",
            details: "Sequencing Pipeline Optimization completed successfully",
            user: "Dr. Raj Patel",
            task: "Sequencing Pipeline Optimization",
            taskId: "TASK014",
            type: "task",
            time: "2024-03-31 16:00"
        }
    ]
};

// Project 5: Biomedical Device Testing
const project5 = {
    name: "Biomedical Device Testing (BDT)",
    description: "Comprehensive testing and validation program for next-generation biomedical devices including wearable health monitors, implantable sensors, and diagnostic equipment. This project ensures regulatory compliance and safety standards for medical device approval.",
    startDate: "2024-02-15",
    endDate: "2025-02-14",
    status: "In Progress",
    priority: "Critical",
    progress: 28,
    isFavorite: false,
    budget: "$420,000",
    confidential: true,
    complexity: 5,
    department: "Biomedical Engineering",
    projectCode: "BDT-2024-005",
    tags: ["biomedical", "device-testing", "validation", "regulatory", "safety", "medical-devices", "regulatory"],
    category: "regulatory",

    team: [
        {
            id: "TM019",
            name: "Dr. Thomas Mueller",
            role: "Biomedical Engineer",
            email: "thomas.mueller@biomedtech.com",
            department: "Biomedical Engineering",
            avatar: "/avatars/thomas-mueller.jpg",
            status: "online"
        },
        {
            id: "TM020",
            name: "Dr. Priya Sharma",
            role: "Regulatory Affairs Specialist",
            email: "priya.sharma@biomedtech.com",
            department: "Regulatory Affairs",
            avatar: "/avatars/priya-sharma.jpg",
            status: "busy"
        },
        {
            id: "TM021",
            name: "Kevin O'Connor",
            role: "Test Engineer",
            email: "kevin.oconnor@biomedtech.com",
            department: "Quality Assurance",
            avatar: "/avatars/kevin-oconnor.jpg",
            status: "online"
        },
        {
            id: "TM022",
            name: "Dr. Anna Kowalski",
            role: "Clinical Validation Lead",
            email: "anna.kowalski@biomedtech.com",
            department: "Clinical Research",
            avatar: "/avatars/anna-kowalski.jpg",
            status: "away"
        },
        {
            id: "TM023",
            name: "David Chen",
            role: "Quality Assurance Manager",
            email: "david.chen@biomedtech.com",
            department: "Quality Assurance",
            avatar: "/avatars/david-chen.jpg",
            status: "online"
        }
    ],

    tasks: [
        {
            id: "TASK017",
            name: "Device Safety Testing",
            status: "In Progress",
            assignee: "Kevin O'Connor",
            assigneeId: "TM021",
            dueDate: "2024-07-31",
            priority: "Critical",
            progress: 45,
            description: "Conduct comprehensive safety testing including biocompatibility, electrical safety, and mechanical stress tests."
        },
        {
            id: "TASK018",
            name: "Regulatory Documentation",
            status: "In Progress",
            assignee: "Dr. Priya Sharma",
            assigneeId: "TM020",
            dueDate: "2024-09-30",
            priority: "High",
            progress: 30,
            description: "Prepare regulatory submission documents for FDA approval including 510(k) premarket notification."
        },
        {
            id: "TASK019",
            name: "Clinical Validation Study",
            status: "Not Started",
            assignee: "Dr. Anna Kowalski",
            assigneeId: "TM022",
            dueDate: "2024-12-31",
            priority: "High",
            progress: 0,
            description: "Design and execute clinical validation studies to demonstrate device efficacy and safety in real-world conditions."
        },
        {
            id: "TASK020",
            name: "Quality Management System",
            status: "In Progress",
            assignee: "David Chen",
            assigneeId: "TM023",
            dueDate: "2024-06-30",
            priority: "Medium",
            progress: 55,
            description: "Implement ISO 13485 quality management system for medical device manufacturing and testing."
        }
    ],

    documents: [
        {
            id: "DOC014",
            name: "Device_Testing_Protocol.pdf",
            type: "pdf",
            size: 3670016,
            uploadedBy: "Dr. Thomas Mueller",
            uploadedAt: "2024-02-20",
            tags: ["testing", "protocol", "biomedical"],
            status: "active"
        },
        {
            id: "DOC015",
            name: "FDA_Submission_Draft.docx",
            type: "docx",
            size: 2359296,
            uploadedBy: "Dr. Priya Sharma",
            uploadedAt: "2024-03-10",
            tags: ["fda", "regulatory", "submission"],
            status: "review"
        },
        {
            id: "DOC016",
            name: "Clinical_Study_Design.pdf",
            type: "pdf",
            size: 1835008,
            uploadedBy: "Dr. Anna Kowalski",
            uploadedAt: "2024-03-15",
            tags: ["clinical", "study", "design"],
            status: "active"
        }
    ],

    milestones: [
        {
            id: "MIL014",
            name: "Safety Testing Complete",
            date: "2024-08-31",
            status: "In Progress",
            description: "All safety and biocompatibility testing completed and documented."
        },
        {
            id: "MIL015",
            name: "FDA Submission",
            date: "2024-10-31",
            status: "Not Started",
            description: "Regulatory submission package submitted to FDA for device approval."
        },
        {
            id: "MIL016",
            name: "Clinical Validation Complete",
            date: "2025-01-31",
            status: "Not Started",
            description: "Clinical validation studies completed with positive efficacy results."
        }
    ],

    dependencies: [
        {
            id: "DEP007",
            sourceId: "TASK017",
            sourceName: "Device Safety Testing",
            targetId: "TASK018",
            targetName: "Regulatory Documentation",
            type: "finish-to-start",
            created: "2024-02-20"
        },
        {
            id: "DEP008",
            sourceId: "TASK018",
            sourceName: "Regulatory Documentation",
            targetId: "TASK019",
            targetName: "Clinical Validation Study",
            type: "finish-to-start",
            created: "2024-03-01"
        }
    ],

    activityLog: [
        {
            id: "ACT013",
            userId: "TM019",
            action: "Project Created",
            timestamp: "2024-02-15T11:00:00Z",
            details: "Biomedical Device Testing project initiated",
            user: "Dr. Thomas Mueller",
            type: "project",
            time: "2024-02-15 11:00"
        },
        {
            id: "ACT014",
            userId: "TM021",
            action: "Task Started",
            timestamp: "2024-03-01T09:30:00Z",
            details: "Device Safety Testing commenced",
            user: "Kevin O'Connor",
            task: "Device Safety Testing",
            taskId: "TASK017",
            type: "task",
            time: "2024-03-01 09:30"
        }
    ]
};

// Array of all projects for easy access
const allProjects = [project1, project2, project3, project4, project5];

module.exports = {
    project1,
    project2,
    project3,
    project4,
    project5,
    allProjects,
    dummyProjectData: project1, // Keep backward compatibility
    getProjectStats,
    getRecentActivity,
    getTeamWorkload,
    getDocumentStats
}; 