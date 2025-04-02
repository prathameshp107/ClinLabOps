// Mock data for enquiries
export const mockEnquiry = {
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
    { 
      id: "d2", 
      name: "Sample_Data.xlsx", 
      type: "xlsx", 
      size: "3.4 MB", 
      uploadedAt: "2025-03-18T14:15:00Z",
      uploadedBy: "Emily Chen" 
    },
    { 
      id: "d3", 
      name: "Protocol_Requirements.docx", 
      type: "docx", 
      size: "0.8 MB", 
      uploadedAt: "2025-03-19T11:20:00Z",
      uploadedBy: "Emily Chen" 
    },
    { 
      id: "d4", 
      name: "Preliminary_Analysis.pdf", 
      type: "pdf", 
      size: "2.1 MB", 
      uploadedAt: "2025-03-21T09:45:00Z",
      uploadedBy: "Dr. Michael Rodriguez",
      isReport: true
    }
  ],
  activities: [
    { 
      id: "a2", 
      action: "Enquiry created", 
      user: "Reception Staff", 
      timestamp: "2025-03-18T14:15:00Z",
      details: "Customer submitted enquiry through the website"
    },
    { 
      id: "a3", 
      action: "Assigned to Dr. Michael Rodriguez", 
      user: "Lab Manager", 
      timestamp: "2025-03-19T09:30:00Z",
      details: "Assigned based on expertise in protein analysis"
    },
    { 
      id: "a4", 
      action: "Status updated to In Progress", 
      user: "Dr. Michael Rodriguez", 
      timestamp: "2025-03-21T09:45:00Z",
      details: "Initial assessment completed, preliminary analysis started"
    },
    { 
      id: "a5", 
      action: "Document uploaded", 
      user: "Dr. Michael Rodriguez", 
      timestamp: "2025-03-21T09:45:00Z",
      details: "Uploaded preliminary analysis report"
    }
  ],
  comments: [
    {
      id: "c1",
      user: "Dr. Michael Rodriguez",
      userRole: "Senior Scientist",
      content: "I've reviewed the samples list and protocol requirements. We can definitely handle this type of analysis. I'll prepare a preliminary report with our approach.",
      timestamp: "2025-03-19T14:30:00Z"
    },
    {
      id: "c2",
      user: "Lab Manager",
      userRole: "Manager",
      content: "Great. Please also include estimated timeline and resource requirements in your preliminary report.",
      timestamp: "2025-03-20T10:15:00Z"
    },
    {
      id: "c3",
      user: "Dr. Michael Rodriguez",
      userRole: "Senior Scientist",
      content: "Preliminary analysis has been completed. I've uploaded the report with our proposed methodology, timeline, and cost estimates.",
      timestamp: "2025-03-21T09:50:00Z"
    }
  ],
  progress: 65
};

export const mockEnquiries = [mockEnquiry];

// Function to get file icon based on type
export const getFileIcon = (fileType) => {
  switch (fileType) {
    case "pdf":
      return "📄";
    case "docx":
      return "📝";
    case "xlsx":
      return "📊";
    case "csv":
      return "📋";
    case "jpg":
    case "png":
      return "🖼️";
    default:
      return "📁";
  }
};