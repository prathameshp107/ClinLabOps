// Mock data generator for inventory items
export function generateMockInventory() {
  const categories = [
    "Chemicals",
    "Glassware",
    "Equipment",
    "Consumables",
    "Reagents",
    "Safety Supplies",
    "Plasticware",
    "Electronics",
    "Biologicals",
    "Tools"
  ];
  
  const locations = [
    "Main Laboratory",
    "Storage Room A",
    "Storage Room B",
    "Cold Storage",
    "Hazardous Materials Cabinet",
    "Equipment Room",
    "Clean Room",
    "Warehouse"
  ];
  
  const suppliers = [
    "LabSupply Co.",
    "SciencePro Inc.",
    "ChemWorks",
    "BioTech Solutions",
    "MediLab Distributors",
    "Global Scientific",
    "TechLab Equipment",
    "Research Essentials"
  ];
  
  const units = ["pcs", "boxes", "bottles", "kits", "packs", "sets", "vials", "tubes"];
  
  // Generate 50 random inventory items
  const items = [];
  
  for (let i = 1; i <= 50; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
    const unit = units[Math.floor(Math.random() * units.length)];
    
    const currentStock = Math.floor(Math.random() * 100);
    const minStockLevel = Math.floor(Math.random() * 20);
    const isLowStock = currentStock <= minStockLevel;
    
    const lastRestocked = new Date();
    lastRestocked.setDate(lastRestocked.getDate() - Math.floor(Math.random() * 60));
    
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    expiryDate.setDate(expiryDate.getDate() + Math.floor(Math.random() * 365));
    
    items.push({
      id: `INV-${String(i).padStart(4, '0')}`,
      name: generateItemName(category),
      sku: `SKU-${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
      barcode: `${Math.floor(Math.random() * 10000000000000)}`,
      category,
      subcategory: generateSubcategory(category),
      currentStock,
      unit,
      minStockLevel,
      isLowStock,
      unitPrice: parseFloat((Math.random() * 500 + 10).toFixed(2)),
      totalValue: function() { return this.currentStock * this.unitPrice; },
      location,
      supplier,
      lastRestocked: lastRestocked.toISOString(),
      expiryDate: category === "Chemicals" || category === "Reagents" || category === "Biologicals" 
        ? expiryDate.toISOString() 
        : null,
      notes: Math.random() > 0.7 ? "Special storage requirements apply" : "",
      status: isLowStock ? "Low Stock" : "In Stock"
    });
  }
  
  return items;
}

// Helper function to generate realistic item names
function generateItemName(category) {
  const chemicalNames = [
    "Sodium Chloride", "Hydrochloric Acid", "Sulfuric Acid", "Ethanol", 
    "Methanol", "Acetone", "Hydrogen Peroxide", "Sodium Hydroxide",
    "Potassium Chloride", "Ammonium Nitrate", "Phosphoric Acid", "Acetic Acid"
  ];
  
  const glasswareNames = [
    "Beaker Set", "Erlenmeyer Flask", "Graduated Cylinder", "Test Tubes",
    "Petri Dishes", "Volumetric Flask", "Burette", "Pipette Set",
    "Microscope Slides", "Watch Glass", "Condensers", "Distillation Kit"
  ];
  
  const equipmentNames = [
    "Digital Scale", "Centrifuge", "Microscope", "Hot Plate",
    "Stirrer", "pH Meter", "Spectrophotometer", "Incubator",
    "Autoclave", "Water Bath", "Fume Hood", "Electrophoresis System"
  ];
  
  const consumablesNames = [
    "Nitrile Gloves", "Disposable Pipettes", "Filter Paper", "Parafilm",
    "Microcentrifuge Tubes", "Syringe Filters", "Weigh Boats", "Lab Wipes",
    "Petri Dishes", "Microscope Slides", "Coverslips", "Cuvettes"
  ];
  
  const reagentsNames = [
    "Buffer Solution", "Enzyme Kit", "Antibody Set", "DNA Extraction Kit",
    "PCR Master Mix", "Protein Assay Kit", "Staining Solution", "Fixative",
    "Mounting Medium", "Calibration Standard", "Indicator Solution", "Assay Reagent"
  ];
  
  const safetyNames = [
    "Safety Goggles", "Lab Coat", "Face Shield", "Chemical Spill Kit",
    "First Aid Kit", "Fire Extinguisher", "Emergency Shower", "Eye Wash Station",
    "Hazard Signs", "Chemical Storage Cabinet", "Respirator", "Safety Gloves"
  ];
  
  const plasticwareNames = [
    "Microcentrifuge Tubes", "Pipette Tips", "Centrifuge Tubes", "PCR Tubes",
    "Culture Plates", "Storage Boxes", "Reagent Reservoirs", "Cryogenic Vials",
    "Conical Tubes", "Microplates", "Petri Dishes", "Sample Containers"
  ];
  
  const electronicsNames = [
    "Digital Thermometer", "Data Logger", "Timer", "Barcode Scanner",
    "Label Printer", "Tablet Computer", "Wireless Sensor", "Power Supply",
    "Voltage Meter", "Oscilloscope", "Function Generator", "Multimeter"
  ];
  
  const biologicalsNames = [
    "Cell Culture Media", "Fetal Bovine Serum", "Antibiotics", "Growth Factors",
    "Bacterial Strains", "Plasmid DNA", "Primers", "Enzymes",
    "Protein Standards", "Antibodies", "Fluorescent Dyes", "Transfection Reagent"
  ];
  
  const toolsNames = [
    "Forceps Set", "Dissection Kit", "Spatula", "Scissors",
    "Clamps", "Lab Stand", "Burner", "Mortar and Pestle",
    "Magnetic Stirrer", "Tube Rack", "Pipette Pump", "Crimper"
  ];
  
  switch (category) {
    case "Chemicals":
      return chemicalNames[Math.floor(Math.random() * chemicalNames.length)];
    case "Glassware":
      return glasswareNames[Math.floor(Math.random() * glasswareNames.length)];
    case "Equipment":
      return equipmentNames[Math.floor(Math.random() * equipmentNames.length)];
    case "Consumables":
      return consumablesNames[Math.floor(Math.random() * consumablesNames.length)];
    case "Reagents":
      return reagentsNames[Math.floor(Math.random() * reagentsNames.length)];
    case "Safety Supplies":
      return safetyNames[Math.floor(Math.random() * safetyNames.length)];
    case "Plasticware":
      return plasticwareNames[Math.floor(Math.random() * plasticwareNames.length)];
    case "Electronics":
      return electronicsNames[Math.floor(Math.random() * electronicsNames.length)];
    case "Biologicals":
      return biologicalsNames[Math.floor(Math.random() * biologicalsNames.length)];
    case "Tools":
      return toolsNames[Math.floor(Math.random() * toolsNames.length)];
    default:
      return "Lab Item";
  }
}

function generateSubcategory(category) {
  const subcategories = {
    "Chemicals": ["Acids", "Bases", "Solvents", "Salts", "Indicators"],
    "Glassware": ["Measurement", "Storage", "Mixing", "Filtration", "Distillation"],
    "Equipment": ["Measurement", "Analysis", "Processing", "Storage", "Heating"],
    "Consumables": ["Disposables", "Filtration", "Sampling", "Protection", "Cleaning"],
    "Reagents": ["Assay Kits", "Buffers", "Standards", "Stains", "Enzymes"],
    "Safety Supplies": ["Personal Protection", "Emergency", "Storage", "Signage", "Cleanup"],
    "Plasticware": ["Storage", "Sampling", "Culture", "Measurement", "Processing"],
    "Electronics": ["Measurement", "Data Collection", "Monitoring", "Power", "Computing"],
    "Biologicals": ["Cell Culture", "Molecular Biology", "Immunology", "Microbiology", "Genetics"],
    "Tools": ["Handling", "Cutting", "Measurement", "Assembly", "Heating"]
  };
  
  const options = subcategories[category] || ["General"];
  return options[Math.floor(Math.random() * options.length)];
}