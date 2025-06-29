// Centralized mock data for enquiries

export const mockEnquiries = [
    {
        id: "e1",
        customerName: "John Smith",
        email: "john.smith@example.com",
        phone: "+1 (555) 123-4567",
        companyName: "Acme Laboratories",
        subject: "PCR Testing Requirements",
        details: "Need information about your PCR testing capabilities for our upcoming clinical trial.",
        priority: "High",
        assignedTo: "Dr. Sarah Johnson",
        status: "Pending",
        createdAt: "2025-03-20T10:30:00Z",
        updatedAt: "2025-03-20T10:30:00Z",
        documents: [
            { id: "d1", name: "Requirements.pdf", type: "pdf", size: "1.2 MB", uploadedAt: "2025-03-20T10:30:00Z" }
        ],
        activities: [
            { id: "a1", action: "Enquiry created", user: "Reception Staff", timestamp: "2025-03-20T10:30:00Z" }
        ]
    },
    {
        id: "e2",
        customerName: "Emily Chen",
        email: "emily.chen@biotech.com",
        phone: "+1 (555) 987-6543",
        companyName: "BioTech Innovations",
        subject: "Protein Analysis Services",
        details: "Interested in your mass spectrometry services for protein characterization. We have a set of 15 protein samples that need to be analyzed for post-translational modifications. We would also like to discuss the possibility of an ongoing collaboration for regular analysis of our research samples.",
        priority: "Medium",
        assignedTo: "Dr. Michael Rodriguez",
        status: "In Progress",
        createdAt: "2025-03-18T14:15:00Z",
        updatedAt: "2025-03-21T09:45:00Z",
        documents: [
            { id: "d2", name: "Sample_Data.xlsx", type: "xlsx", size: "3.4 MB", uploadedAt: "2025-03-18T14:15:00Z", uploadedBy: "Emily Chen" },
            { id: "d3", name: "Protocol_Requirements.docx", type: "docx", size: "0.8 MB", uploadedAt: "2025-03-19T11:20:00Z", uploadedBy: "Emily Chen" },
            { id: "d4", name: "Preliminary_Analysis.pdf", type: "pdf", size: "2.1 MB", uploadedAt: "2025-03-21T09:45:00Z", uploadedBy: "Dr. Michael Rodriguez", isReport: true }
        ],
        activities: [
            { id: "a2", action: "Enquiry created", user: "Reception Staff", timestamp: "2025-03-18T14:15:00Z", details: "Customer submitted enquiry through the website" },
            { id: "a3", action: "Assigned to Dr. Michael Rodriguez", user: "Lab Manager", timestamp: "2025-03-19T09:30:00Z", details: "Assigned based on expertise in protein analysis" },
            { id: "a4", action: "Status updated to In Progress", user: "Dr. Michael Rodriguez", timestamp: "2025-03-21T09:45:00Z", details: "Initial assessment completed, preliminary analysis started" },
            { id: "a5", action: "Document uploaded", user: "Dr. Michael Rodriguez", timestamp: "2025-03-21T09:45:00Z", details: "Uploaded preliminary analysis report" }
        ],
        comments: [
            { id: "c1", user: "Dr. Michael Rodriguez", userRole: "Senior Scientist", content: "I've reviewed the samples list and protocol requirements. We can definitely handle this type of analysis. I'll prepare a preliminary report with our approach.", timestamp: "2025-03-19T14:30:00Z" },
            { id: "c2", user: "Lab Manager", userRole: "Manager", content: "Great. Please also include estimated timeline and resource requirements in your preliminary report.", timestamp: "2025-03-20T10:15:00Z" },
            { id: "c3", user: "Dr. Michael Rodriguez", userRole: "Senior Scientist", content: "Preliminary analysis has been completed. I've uploaded the report with our proposed methodology, timeline, and cost estimates.", timestamp: "2025-03-21T09:50:00Z" }
        ],
        progress: 65
    },
    {
        id: "e3",
        customerName: "Robert Johnson",
        email: "robert.johnson@medresearch.org",
        phone: "+1 (555) 456-7890",
        companyName: "Medical Research Institute",
        subject: "Genomic Sequencing Project",
        details: "Need a quote for whole genome sequencing of 50 samples.",
        priority: "High",
        assignedTo: "Dr. Lisa Wong",
        status: "Completed",
        createdAt: "2025-03-15T11:00:00Z",
        updatedAt: "2025-03-22T16:30:00Z",
        documents: [
            { id: "d4", name: "Sample_List.csv", type: "csv", size: "0.5 MB", uploadedAt: "2025-03-15T11:00:00Z" },
            { id: "d5", name: "Final_Report.pdf", type: "pdf", size: "4.2 MB", uploadedAt: "2025-03-22T16:30:00Z" }
        ],
        activities: [
            { id: "a5", action: "Enquiry created", user: "Reception Staff", timestamp: "2025-03-15T11:00:00Z" },
            { id: "a6", action: "Assigned to Dr. Lisa Wong", user: "Lab Manager", timestamp: "2025-03-15T14:20:00Z" },
            { id: "a7", action: "Status updated to In Progress", user: "Dr. Lisa Wong", timestamp: "2025-03-16T09:15:00Z" },
            { id: "a8", action: "Final report uploaded", user: "Dr. Lisa Wong", timestamp: "2025-03-22T16:30:00Z" },
            { id: "a9", action: "Status updated to Completed", user: "Dr. Lisa Wong", timestamp: "2025-03-22T16:35:00Z" }
        ]
    },
    {
        id: "e4",
        customerName: "Sarah Williams",
        email: "sarah.williams@pharmaco.com",
        phone: "+1 (555) 789-0123",
        companyName: "PharmaCo",
        subject: "Stability Testing for New Drug",
        details: "Need comprehensive stability testing for our new drug formulation.",
        priority: "Medium",
        assignedTo: "Dr. James Peterson",
        status: "In Progress",
        createdAt: "2025-03-17T13:45:00Z",
        updatedAt: "2025-03-23T10:15:00Z",
        documents: [
            { id: "d6", name: "Drug_Specifications.pdf", type: "pdf", size: "2.1 MB", uploadedAt: "2025-03-17T13:45:00Z" },
            { id: "d7", name: "Testing_Parameters.xlsx", type: "xlsx", size: "1.7 MB", uploadedAt: "2025-03-17T13:45:00Z" }
        ],
        activities: [
            { id: "a10", action: "Enquiry created", user: "Reception Staff", timestamp: "2025-03-17T13:45:00Z" },
            { id: "a11", action: "Assigned to Dr. James Peterson", user: "Lab Manager", timestamp: "2025-03-18T09:00:00Z" },
            { id: "a12", action: "Status updated to In Progress", user: "Dr. James Peterson", timestamp: "2025-03-19T11:30:00Z" },
            { id: "a13", action: "Preliminary results added", user: "Dr. James Peterson", timestamp: "2025-03-23T10:15:00Z" }
        ]
    },
    {
        id: "e5",
        customerName: "David Wilson",
        email: "david.wilson@agritech.com",
        phone: "+1 (555) 321-6540",
        companyName: "AgriTech Solutions",
        subject: "Soil Analysis Services",
        details: "Looking for comprehensive soil analysis for agricultural research project.",
        priority: "Low",
        assignedTo: "Dr. Sarah Johnson",
        status: "On Hold",
        createdAt: "2025-03-19T16:20:00Z",
        updatedAt: "2025-03-22T14:30:00Z",
        documents: [
            { id: "d8", name: "Soil_Samples_List.xlsx", type: "xlsx", size: "0.9 MB", uploadedAt: "2025-03-19T16:20:00Z" }
        ],
        activities: [
            { id: "a14", action: "Enquiry created", user: "Reception Staff", timestamp: "2025-03-19T16:20:00Z" },
            { id: "a15", action: "Assigned to Dr. Sarah Johnson", user: "Lab Manager", timestamp: "2025-03-20T10:15:00Z" },
            { id: "a16", action: "Status updated to On Hold", user: "Dr. Sarah Johnson", timestamp: "2025-03-22T14:30:00Z" }
        ]
    },
    {
        id: "e6",
        customerName: "Lisa Anderson",
        email: "lisa.anderson@environsci.com",
        phone: "+1 (555) 654-3210",
        companyName: "Environmental Sciences Corp",
        subject: "Water Quality Testing",
        details: "Need water quality analysis for environmental impact assessment.",
        priority: "High",
        assignedTo: "Dr. Michael Rodriguez",
        status: "Cancelled",
        createdAt: "2025-03-16T09:45:00Z",
        updatedAt: "2025-03-21T11:20:00Z",
        documents: [
            { id: "d9", name: "Water_Samples_Data.csv", type: "csv", size: "1.5 MB", uploadedAt: "2025-03-16T09:45:00Z" }
        ],
        activities: [
            { id: "a17", action: "Enquiry created", user: "Reception Staff", timestamp: "2025-03-16T09:45:00Z" },
            { id: "a18", action: "Assigned to Dr. Michael Rodriguez", user: "Lab Manager", timestamp: "2025-03-16T14:30:00Z" },
            { id: "a19", action: "Status updated to Cancelled", user: "Lisa Anderson", timestamp: "2025-03-21T11:20:00Z" }
        ]
    }
];

export const teamMembers = [
    { id: "tm1", name: "Dr. Sarah Johnson", role: "Lab Director" },
    { id: "tm2", name: "Dr. Michael Chen", role: "Senior Researcher" },
    { id: "tm3", name: "Jessica Williams", role: "Lab Technician" },
    { id: "tm4", name: "Robert Garcia", role: "Quality Control" },
    { id: "tm5", name: "Emily Davis", role: "Customer Relations" }
];

// Optionally export additional related mock data (team members, statuses, priorities, etc.) if needed for the UI or service layer. 