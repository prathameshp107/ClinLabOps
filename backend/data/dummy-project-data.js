const dummyProjectData = {
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
    tags: ["laboratory", "management", "automation", "research", "equipment", "monitoring", "data-analysis"],

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

module.exports = {
    dummyProjectData,
    getProjectStats,
    getRecentActivity,
    getTeamWorkload,
    getDocumentStats
}; 