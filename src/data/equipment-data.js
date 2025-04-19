export const equipmentData = [
  {
    id: "EQ-001",
    name: "High-Performance Liquid Chromatograph",
    type: "Analytical",
    model: "Agilent 1260 Infinity II",
    manufacturer: "Agilent Technologies",
    serialNumber: "DEABC12345",
    location: "Lab A",
    status: "Available",
    purchaseDate: "2021-05-15T00:00:00Z",
    lastMaintenanceDate: "2023-08-10T00:00:00Z",
    nextMaintenanceDate: "2023-11-10T00:00:00Z",
    assignedTo: "Dr. Sarah Johnson",
    notes: "This HPLC system is equipped with a quaternary pump, autosampler, column compartment, and diode array detector. Used primarily for drug analysis and quality control testing.",
    files: [
      {
        name: "HPLC_User_Manual.pdf",
        size: 4500000,
        type: "application/pdf",
        uploadedAt: "2021-05-20T14:30:00Z"
      },
      {
        name: "Calibration_Certificate_2023.pdf",
        size: 1200000,
        type: "application/pdf",
        uploadedAt: "2023-08-12T09:15:00Z"
      }
    ]
  },
  {
    id: "EQ-002",
    name: "Mass Spectrometer",
    type: "Analytical",
    model: "Thermo Scientific Q Exactive",
    manufacturer: "Thermo Fisher Scientific",
    serialNumber: "MS78901234",
    location: "Lab A",
    status: "In Use",
    purchaseDate: "2020-11-03T00:00:00Z",
    lastMaintenanceDate: "2023-07-22T00:00:00Z",
    nextMaintenanceDate: "2023-10-22T00:00:00Z",
    assignedTo: "Dr. Michael Chen",
    notes: "High-resolution mass spectrometer with Orbitrap technology. Used for proteomics research and small molecule identification.",
    files: [
      {
        name: "MS_Technical_Specifications.pdf",
        size: 3200000,
        type: "application/pdf",
        uploadedAt: "2020-11-10T11:45:00Z"
      }
    ]
  },
  {
    id: "EQ-003",
    name: "Ultra-Low Temperature Freezer",
    type: "Storage",
    model: "Thermo Scientific Revco UxF",
    manufacturer: "Thermo Fisher Scientific",
    serialNumber: "ULT56789012",
    location: "Storage Room",
    status: "Available",
    purchaseDate: "2019-08-20T00:00:00Z",
    lastMaintenanceDate: "2023-06-15T00:00:00Z",
    nextMaintenanceDate: "2023-12-15T00:00:00Z",
    assignedTo: "",
    notes: "Ultra-low temperature freezer (-80°C) used for long-term storage of biological samples and reagents. Equipped with temperature monitoring system and alarm.",
    files: []
  },
  {
    id: "EQ-004",
    name: "Microplate Reader",
    type: "Laboratory",
    model: "BioTek Synergy HTX",
    manufacturer: "BioTek Instruments",
    serialNumber: "MPR34567890",
    location: "Lab B",
    status: "Under Maintenance",
    purchaseDate: "2022-02-10T00:00:00Z",
    lastMaintenanceDate: "2023-09-05T00:00:00Z",
    nextMaintenanceDate: "2023-12-05T00:00:00Z",
    assignedTo: "Dr. Emily Rodriguez",
    notes: "Multi-mode microplate reader capable of absorbance, fluorescence, and luminescence detection. Used for ELISA, protein quantification, and cell-based assays.",
    files: [
      {
        name: "Microplate_Reader_Manual.pdf",
        size: 2800000,
        type: "application/pdf",
        uploadedAt: "2022-02-15T10:20:00Z"
      }
    ]
  },
  {
    id: "EQ-005",
    name: "Confocal Microscope",
    type: "Imaging",
    model: "Zeiss LSM 980",
    manufacturer: "Carl Zeiss AG",
    serialNumber: "CM12345678",
    location: "Imaging Suite",
    status: "Available",
    purchaseDate: "2021-09-15T00:00:00Z",
    lastMaintenanceDate: "2023-08-28T00:00:00Z",
    nextMaintenanceDate: "2023-11-28T00:00:00Z",
    assignedTo: "Dr. Robert Kim",
    notes: "Advanced confocal laser scanning microscope with Airyscan 2 detector. Used for high-resolution imaging of cells and tissues.",
    files: [
      {
        name: "Zeiss_LSM980_Manual.pdf",
        size: 5100000,
        type: "application/pdf",
        uploadedAt: "2021-09-20T15:10:00Z"
      },
      {
        name: "Microscope_Maintenance_Log.xlsx",
        size: 450000,
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        uploadedAt: "2023-08-30T11:25:00Z"
      }
    ]
  },
  {
    id: "EQ-006",
    name: "PCR Thermal Cycler",
    type: "Laboratory",
    model: "Applied Biosystems QuantStudio 5",
    manufacturer: "Thermo Fisher Scientific",
    serialNumber: "PCR90123456",
    location: "Lab C",
    status: "In Use",
    purchaseDate: "2022-04-05T00:00:00Z",
    lastMaintenanceDate: "2023-07-10T00:00:00Z",
    nextMaintenanceDate: "2023-10-10T00:00:00Z",
    assignedTo: "Dr. Lisa Wong",
    notes: "Real-time PCR system with 96-well block. Used for gene expression analysis, genotyping, and pathogen detection.",
    files: [
      {
        name: "QuantStudio_User_Guide.pdf",
        size: 3800000,
        type: "application/pdf",
        uploadedAt: "2022-04-10T09:45:00Z"
      }
    ]
  },
  {
    id: "EQ-007",
    name: "Analytical Balance",
    type: "Laboratory",
    model: "Mettler Toledo XPE205",
    manufacturer: "Mettler Toledo",
    serialNumber: "AB78901234",
    location: "Lab B",
    status: "Available",
    purchaseDate: "2021-11-20T00:00:00Z",
    lastMaintenanceDate: "2023-05-15T00:00:00Z",
    nextMaintenanceDate: "2023-11-15T00:00:00Z",
    assignedTo: "",
    notes: "High-precision analytical balance with 0.01 mg readability. Used for precise weighing of compounds and samples.",
    files: []
  },
  {
    id: "EQ-008",
    name: "Cell Culture Incubator",
    type: "Laboratory",
    model: "Thermo Scientific Heracell VIOS 160i",
    manufacturer: "Thermo Fisher Scientific",
    serialNumber: "CCI56789012",
    location: "Cell Culture Room",
    status: "Out of Order",
    purchaseDate: "2020-06-10T00:00:00Z",
    lastMaintenanceDate: "2023-04-20T00:00:00Z",
    nextMaintenanceDate: "2023-10-20T00:00:00Z",
    assignedTo: "Dr. James Wilson",
    notes: "CO2 incubator with HEPA filtration and oxygen control. Used for mammalian cell culture. Currently out of order due to temperature control issues. Service technician scheduled for repair.",
    files: [
      {
        name: "Incubator_Manual.pdf",
        size: 2900000,
        type: "application/pdf",
        uploadedAt: "2020-06-15T13:30:00Z"
      },
      {
        name: "Service_Request_Form.pdf",
        size: 350000,
        type: "application/pdf",
        uploadedAt: "2023-09-25T10:15:00Z"
      }
    ]
  },
  {
    id: "EQ-009",
    name: "Centrifuge",
    type: "Laboratory",
    model: "Beckman Coulter Avanti J-15R",
    manufacturer: "Beckman Coulter",
    serialNumber: "CF34567890",
    location: "Lab A",
    status: "Available",
    purchaseDate: "2021-03-15T00:00:00Z",
    lastMaintenanceDate: "2023-06-05T00:00:00Z",
    nextMaintenanceDate: "2023-12-05T00:00:00Z",
    assignedTo: "",
    notes: "Refrigerated benchtop centrifuge with multiple rotor options. Used for sample preparation and cell isolation.",
    files: [
      {
        name: "Centrifuge_User_Guide.pdf",
        size: 2500000,
        type: "application/pdf",
        uploadedAt: "2021-03-20T11:15:00Z"
      }
    ]
  },
  {
    id: "EQ-010",
    name: "Flow Cytometer",
    type: "Analytical",
    model: "BD FACSymphony A5",
    manufacturer: "Becton Dickinson",
    serialNumber: "FC12345678",
    location: "Flow Cytometry Suite",
    status: "In Use",
    purchaseDate: "2022-01-10T00:00:00Z",
    lastMaintenanceDate: "2023-08-15T00:00:00Z",
    nextMaintenanceDate: "2023-11-15T00:00:00Z",
    assignedTo: "Dr. Maria Garcia",
    notes: "High-parameter flow cytometer with 5 lasers and 30 detectors. Used for immunophenotyping and cell sorting.",
    files: [
      {
        name: "FACSymphony_Manual.pdf",
        size: 4200000,
        type: "application/pdf",
        uploadedAt: "2022-01-15T14:20:00Z"
      },
      {
        name: "Flow_Cytometer_SOP.docx",
        size: 580000,
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        uploadedAt: "2022-02-05T09:30:00Z"
      }
    ]
  }
];