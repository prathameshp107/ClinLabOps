export const profileData = {
  personal: {
    profilePicture: "RJ",
    fullName: "Dr. Sarah Johnson",
    email: "sarah.johnson@labtasker.com",
    phone: "+1 (555) 123-4567",
    gender: "female",
    dateOfBirth: new Date("1985-06-15"),
    address: "123 Research Avenue, Boston, MA 02115",
    emergencyContactName: "Michael Johnson",
    emergencyContactPhone: "+1 (555) 987-6543",
    emergencyContactRelation: "Spouse"
  },
  professional: {
    title: "Senior Research Scientist",
    department: "Research & Development",
    labLocation: "Main Laboratory",
    employeeId: "EMP-2021-0042",
    dateJoined: new Date("2021-03-15"),
    employmentType: "Full-time",
    isVerified: true,
    isProfileComplete: true,
    supervisorName: "Dr. Robert Chen",
    supervisorTitle: "Research Director",
    certifications: [
      "Good Laboratory Practice (GLP)",
      "Animal Handling",
      "Biosafety Level 2",
      "Radiation Safety"
    ]
  },
  skills: [
    "PCR",
    "HPLC",
    "Cell Culture",
    "Western Blotting",
    "Flow Cytometry",
    "Mass Spectrometry",
    "Immunohistochemistry",
    "ELISA",
    "Confocal Microscopy",
    "RNA Sequencing"
  ],
  specializations: [
    {
      name: "Molecular Biology",
      proficiency: 90
    },
    {
      name: "Immunology",
      proficiency: 85
    },
    {
      name: "Toxicology",
      proficiency: 75
    },
    {
      name: "Bioanalytics",
      proficiency: 80
    },
    {
      name: "Data Analysis",
      proficiency: 70
    }
  ],
  assignedEquipment: [
    {
      id: "EQ-001",
      name: "High-Performance Liquid Chromatograph",
      type: "Analytical",
      model: "Agilent 1260 Infinity II",
      location: "Lab A",
      status: "Available"
    },
    {
      id: "EQ-010",
      name: "Flow Cytometer",
      type: "Analytical",
      model: "BD FACSymphony A5",
      location: "Flow Cytometry Suite",
      status: "In Use"
    },
    {
      id: "EQ-004",
      name: "Microplate Reader",
      type: "Laboratory",
      model: "BioTek Synergy HTX",
      location: "Lab B",
      status: "Under Maintenance",
      maintenanceEndDate: "2023-10-15T00:00:00Z"
    }
  ],
  activityLogs: [
    {
      type: "experiment",
      title: "Started new experiment: HPLC Analysis of Compound XYZ",
      description: "Initiated a new HPLC analysis experiment for compound characterization.",
      timestamp: "2023-09-28T14:30:00Z",
      details: "Experiment ID: EXP-2023-0089\nStatus: In Progress\nEstimated completion: October 2, 2023"
    },
    {
      type: "task",
      title: "Completed task: Weekly equipment calibration",
      description: "Performed routine calibration of lab equipment as scheduled.",
      timestamp: "2023-09-26T11:15:00Z"
    },
    {
      type: "document",
      title: "Uploaded document: Research protocol for Project Alpha",
      description: "Added the final research protocol document for the Project Alpha study.",
      timestamp: "2023-09-25T09:45:00Z"
    },
    {
      type: "equipment",
      title: "Reserved equipment: Mass Spectrometer",
      description: "Reserved the Thermo Scientific Q Exactive mass spectrometer for October 5-7.",
      timestamp: "2023-09-22T16:20:00Z"
    },
    {
      type: "system",
      title: "Profile updated",
      description: "Updated professional information and added new certifications.",
      timestamp: "2023-09-20T10:30:00Z"
    },
    {
      type: "experiment",
      title: "Completed experiment: Cell Viability Assay",
      description: "Finished the cell viability assay for Project Beta and recorded results.",
      timestamp: "2023-09-18T15:45:00Z",
      details: "Experiment ID: EXP-2023-0076\nStatus: Completed\nResults: 87% viability observed in test group vs. 95% in control"
    }
  ]
};