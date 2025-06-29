// Sample inventory data for the application
export const inventoryData = {
  items: [
    {
      id: "INV-0001",
      name: "Microscope Slides",
      sku: "MS-100",
      category: "Lab Supplies",
      description: "Glass microscope slides, 1x3 inches, 1mm thick",
      currentStock: 150,
      minStockLevel: 50,
      unitPrice: 0.15,
      location: "Cabinet A",
      supplier: "LabGlass Inc.",
      unit: "pcs",
      lastRestocked: "2023-09-15T10:30:00Z",
      isLowStock: false,
      status: "In Stock"
    },
    {
      id: "INV-0002",
      name: "Petri Dishes",
      sku: "PD-200",
      category: "Lab Supplies",
      description: "Sterile plastic petri dishes, 100mm diameter",
      currentStock: 75,
      minStockLevel: 30,
      unitPrice: 0.45,
      location: "Cabinet B",
      supplier: "BioSupplies Co.",
      unit: "pcs",
      lastRestocked: "2023-09-10T14:15:00Z",
      isLowStock: false,
      status: "In Stock"
    },
    {
      id: "INV-0003",
      name: "Micropipettes",
      sku: "MP-300",
      category: "Equipment",
      description: "Adjustable volume micropipettes, 10-100µL",
      currentStock: 10,
      minStockLevel: 5,
      unitPrice: 120.00,
      location: "Cabinet C",
      supplier: "PrecisionLab",
      unit: "pcs",
      lastRestocked: "2023-08-20T09:45:00Z",
      isLowStock: false,
      status: "In Stock"
    },
    {
      id: "INV-0004",
      name: "Nitrile Gloves",
      sku: "NG-400",
      category: "Safety Supplies",
      description: "Powder-free nitrile gloves, medium size",
      currentStock: 20,
      minStockLevel: 50,
      unitPrice: 0.25,
      location: "Storage Room",
      supplier: "SafetyFirst",
      unit: "boxes",
      lastRestocked: "2023-09-05T11:20:00Z",
      isLowStock: true,
      status: "Low Stock"
    },
    {
      id: "INV-0005",
      name: "Ethanol 70%",
      sku: "ET-500",
      category: "Chemicals",
      description: "70% ethanol solution for disinfection",
      currentStock: 5,
      minStockLevel: 3,
      unitPrice: 15.75,
      location: "Chemical Storage",
      supplier: "ChemWorks",
      unit: "bottles",
      lastRestocked: "2023-09-01T13:10:00Z",
      isLowStock: false,
      status: "In Stock"
    },
    {
      id: "INV-0006",
      name: "Centrifuge Tubes",
      sku: "CT-600",
      category: "Lab Supplies",
      description: "15mL plastic centrifuge tubes with screw caps",
      currentStock: 200,
      minStockLevel: 100,
      unitPrice: 0.35,
      location: "Cabinet A",
      supplier: "LabGlass Inc.",
      unit: "pcs",
      lastRestocked: "2023-09-12T15:30:00Z",
      isLowStock: false,
      status: "In Stock"
    }
  ],
  suppliers: [
    {
      id: "SUP-0001",
      name: "LabGlass Inc.",
      contactPerson: "John Smith",
      email: "john@labglass.com",
      phone: "555-123-4567",
      categories: ["Lab Supplies", "Glassware"],
      status: "Active"
    },
    {
      id: "SUP-0002",
      name: "BioSupplies Co.",
      contactPerson: "Jane Doe",
      email: "jane@biosupplies.com",
      phone: "555-234-5678",
      categories: ["Lab Supplies", "Consumables"],
      status: "Active"
    },
    {
      id: "SUP-0003",
      name: "PrecisionLab",
      contactPerson: "Robert Johnson",
      email: "robert@precisionlab.com",
      phone: "555-345-6789",
      categories: ["Equipment", "Instruments"],
      status: "Active"
    },
    {
      id: "SUP-0004",
      name: "SafetyFirst",
      contactPerson: "Emily Wilson",
      email: "emily@safetyfirst.com",
      phone: "555-456-7890",
      categories: ["Safety Supplies", "PPE"],
      status: "Active"
    },
    {
      id: "SUP-0005",
      name: "ChemWorks",
      contactPerson: "Michael Brown",
      email: "michael@chemworks.com",
      phone: "555-567-8901",
      categories: ["Chemicals", "Reagents"],
      status: "Active"
    }
  ],
  locations: [
    {
      id: "LOC-0001",
      name: "Cabinet A",
      type: "cabinet",
      description: "Main storage cabinet in the lab",
      capacity: "200",
      status: "Active"
    },
    {
      id: "LOC-0002",
      name: "Cabinet B",
      type: "cabinet",
      description: "Secondary storage cabinet in the lab",
      capacity: "150",
      status: "Active"
    },
    {
      id: "LOC-0003",
      name: "Cabinet C",
      type: "cabinet",
      description: "Equipment storage cabinet",
      capacity: "100",
      status: "Active"
    },
    {
      id: "LOC-0004",
      name: "Storage Room",
      type: "room",
      description: "Main storage room for bulk supplies",
      capacity: "1000",
      status: "Active"
    },
    {
      id: "LOC-0005",
      name: "Chemical Storage",
      type: "cabinet",
      description: "Ventilated cabinet for chemical storage",
      capacity: "50",
      status: "Active"
    },
    {
      id: "LOC-0006",
      name: "Refrigerator 1",
      type: "refrigerator",
      description: "4°C refrigerator for temperature-sensitive items",
      capacity: "100",
      status: "Active"
    },
    {
      id: "LOC-0007",
      name: "Freezer 1",
      type: "freezer",
      description: "-20°C freezer for frozen samples and reagents",
      capacity: "80",
      status: "Active"
    }
  ]
};

// Centralized mock warehouses data
export const warehouses = [
  {
    id: "WH-001",
    name: "Main Laboratory",
    location: "Building A, Floor 2",
    address: "123 Science Park, Boston, MA 02142",
    manager: "John Smith",
    capacity: 1000,
    used: 650,
    itemCount: 120,
    status: "active"
  },
  {
    id: "WH-002",
    name: "Storage Room A",
    location: "Building A, Basement",
    address: "123 Science Park, Boston, MA 02142",
    manager: "Sarah Johnson",
    capacity: 500,
    used: 480,
    itemCount: 85,
    status: "active"
  },
  // ...add more warehouses as needed
];

// Centralized mock warehouse items
export const warehouseItems = [
  { id: "INV-0001", name: "Sodium Chloride", category: "Chemicals", quantity: 20, unit: "bottles" },
  { id: "INV-0002", name: "Beaker Set", category: "Glassware", quantity: 5, unit: "sets" },
  { id: "INV-0003", name: "Digital Scale", category: "Equipment", quantity: 2, unit: "pcs" },
  { id: "INV-0004", name: "Nitrile Gloves", category: "Consumables", quantity: 50, unit: "boxes" },
  { id: "INV-0005", name: "Buffer Solution", category: "Reagents", quantity: 10, unit: "bottles" }
];