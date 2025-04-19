export const protocolsData = [
  {
    id: "PROT-001",
    title: "Mouse Pharmacokinetic Study Protocol",
    category: "Pharmacokinetics",
    version: "1.2",
    author: "Dr. John Smith",
    status: "Approved",
    createdAt: "2023-03-15T10:30:00Z",
    updatedAt: "2023-04-02T14:45:00Z",
    objectives: "To determine the pharmacokinetic profile of Compound XYZ-123 in mice following oral and intravenous administration.",
    materials: "- Compound XYZ-123\n- DMSO\n- Saline solution\n- 24 male C57BL/6 mice (8-10 weeks old)\n- Oral gavage needles\n- Microcentrifuge tubes\n- HPLC-MS/MS system",
    procedure: "1. Prepare dosing solutions:\n   - IV solution: 1 mg/mL in 5% DMSO/95% saline\n   - PO solution: 3 mg/mL in 5% DMSO/95% saline\n\n2. Divide mice into two groups (n=12 each):\n   - Group 1: IV administration (1 mg/kg)\n   - Group 2: PO administration (10 mg/kg)\n\n3. Administer doses according to body weight\n\n4. Collect blood samples (50 μL) at the following timepoints:\n   - IV group: 0.083, 0.25, 0.5, 1, 2, 4, 8, and 24 hours post-dose\n   - PO group: 0.25, 0.5, 1, 2, 4, 8, 12, and 24 hours post-dose\n\n5. Process blood samples by centrifugation at 3,000g for 10 minutes\n\n6. Analyze plasma samples using validated HPLC-MS/MS method\n\n7. Calculate PK parameters using non-compartmental analysis",
    outcomes: "The study will provide the following PK parameters:\n- Maximum plasma concentration (Cmax)\n- Time to reach Cmax (Tmax)\n- Area under the plasma concentration-time curve (AUC)\n- Elimination half-life (t1/2)\n- Volume of distribution (Vd)\n- Clearance (CL)\n- Bioavailability (F)",
    references: "1. Smith J, et al. (2022). Pharmacokinetic analysis methods for small molecule drugs. J Pharmacokinet Pharmacodyn 45:123-145.\n2. Internal SOP #PK-012: Blood collection from mice.",
    files: [
      {
        name: "PK_Study_Template.xlsx",
        size: 45056,
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        uploadedAt: "2023-03-15T10:35:00Z"
      },
      {
        name: "HPLC_Method.pdf",
        size: 128500,
        type: "application/pdf",
        uploadedAt: "2023-03-15T10:36:00Z"
      }
    ]
  },
  {
    id: "PROT-002",
    title: "Cell Viability Assay Protocol",
    category: "Efficacy",
    version: "1.0",
    author: "Dr. Sarah Johnson",
    status: "In Review",
    createdAt: "2023-04-10T09:15:00Z",
    updatedAt: "2023-04-12T16:20:00Z",
    objectives: "To evaluate the cytotoxic effects of test compounds on human cancer cell lines using the MTT assay.",
    materials: "- Human cancer cell lines (HCT116, MCF-7, A549)\n- RPMI-1640 medium with 10% FBS\n- Test compounds\n- DMSO\n- MTT reagent\n- 96-well plates\n- Microplate reader",
    procedure: "1. Culture cells in RPMI-1640 medium supplemented with 10% FBS\n\n2. Seed cells in 96-well plates at 5,000 cells per well\n\n3. Incubate for 24 hours at 37°C, 5% CO2\n\n4. Prepare serial dilutions of test compounds in medium\n\n5. Add 100 μL of compound dilutions to cells\n\n6. Incubate for 72 hours at 37°C, 5% CO2\n\n7. Add 20 μL of MTT solution (5 mg/mL) to each well\n\n8. Incubate for 4 hours at 37°C\n\n9. Remove medium and add 100 μL DMSO to dissolve formazan crystals\n\n10. Measure absorbance at 570 nm using microplate reader\n\n11. Calculate cell viability and IC50 values",
    outcomes: "The assay will determine:\n- Cell viability percentage at different compound concentrations\n- IC50 values for each test compound\n- Relative potency compared to positive control",
    references: "1. Johnson S, et al. (2021). Standardized methods for in vitro cytotoxicity testing. J Cancer Res Methods 32:78-92.",
    files: [
      {
        name: "MTT_Assay_SOP.pdf",
        size: 215400,
        type: "application/pdf",
        uploadedAt: "2023-04-10T09:20:00Z"
      }
    ]
  },
  {
    id: "PROT-003",
    title: "Rat Toxicology Study Protocol",
    category: "Toxicology",
    version: "2.1",
    author: "Dr. Michael Brown",
    status: "Draft",
    createdAt: "2023-04-18T11:45:00Z",
    updatedAt: "2023-04-20T13:30:00Z",
    objectives: "To assess the potential toxicity of Compound ABC-456 in rats following repeated oral administration for 28 days.",
    materials: "- Compound ABC-456\n- Vehicle solution\n- Sprague-Dawley rats (8 weeks old)\n- Metabolic cages\n- Clinical chemistry analyzer\n- Hematology analyzer\n- Histopathology supplies",
    procedure: "1. Divide rats into 4 groups (n=10/sex/group):\n   - Group 1: Vehicle control\n   - Group 2: Low dose (10 mg/kg/day)\n   - Group 3: Mid dose (30 mg/kg/day)\n   - Group 4: High dose (100 mg/kg/day)\n\n2. Administer test article or vehicle by oral gavage once daily for 28 consecutive days\n\n3. Monitor clinical signs, body weight, and food consumption\n\n4. Collect blood samples for hematology and clinical chemistry on Days 14 and 28\n\n5. Collect urine samples for urinalysis on Days 14 and 28\n\n6. Perform necropsy on Day 29\n\n7. Collect and weigh organs\n\n8. Process tissues for histopathological examination",
    outcomes: "The study will evaluate:\n- Clinical signs of toxicity\n- Effects on body weight and food consumption\n- Hematological and clinical chemistry parameters\n- Gross and microscopic tissue changes\n- Target organs of toxicity\n- NOAEL (No Observed Adverse Effect Level)",
    references: "1. OECD Guideline for Testing of Chemicals, Test No. 407: Repeated Dose 28-day Oral Toxicity Study in Rodents\n2. Brown M, et al. (2020). Preclinical toxicology assessment methods. Toxicol Res 39:156-178.",
    files: []
  },
  {
    id: "PROT-004",
    title: "LC-MS/MS Method for Drug Quantification",
    category: "Bioanalytical",
    version: "1.5",
    author: "Dr. Emily Chen",
    status: "Approved",
    createdAt: "2023-02-05T14:20:00Z",
    updatedAt: "2023-03-10T11:15:00Z",
    objectives: "To develop and validate an LC-MS/MS method for the quantification of Compound XYZ-123 and its metabolites in plasma samples.",
    materials: "- Compound XYZ-123 reference standard\n- Metabolite reference standards\n- Internal standard (deuterated analog)\n- LC-MS grade solvents\n- Blank plasma\n- Protein precipitation reagents\n- HPLC column (C18, 2.1 x 50 mm, 1.7 μm)\n- LC-MS/MS system",
    procedure: "1. Prepare stock solutions of analytes and internal standard\n\n2. Prepare calibration standards and QC samples in blank plasma\n\n3. Sample preparation:\n   - Add 50 μL plasma to 200 μL acetonitrile containing internal standard\n   - Vortex for 1 minute\n   - Centrifuge at 14,000 rpm for 10 minutes\n   - Transfer 100 μL supernatant to autosampler vial\n\n4. LC-MS/MS conditions:\n   - Column: C18, 2.1 x 50 mm, 1.7 μm\n   - Mobile phase A: 0.1% formic acid in water\n   - Mobile phase B: 0.1% formic acid in acetonitrile\n   - Gradient: 5% B to 95% B over 3 minutes\n   - Flow rate: 0.4 mL/min\n   - Injection volume: 5 μL\n   - MS/MS parameters: [specific transitions and parameters listed]\n\n5. Data analysis:\n   - Generate calibration curves\n   - Calculate concentrations of unknown samples\n   - Evaluate method performance parameters",
    outcomes: "The validated method will provide:\n- Linearity range: 1-1000 ng/mL\n- LLOQ: 1 ng/mL\n- Precision: ≤15% CV\n- Accuracy: ±15% of nominal concentration\n- Selectivity: No interference from matrix components\n- Stability under various conditions",
    references: "1. FDA Guidance for Industry: Bioanalytical Method Validation\n2. Chen E, et al. (2022). LC-MS/MS method development for preclinical drug studies. J Pharm Biomed Anal 56:234-245.",
    files: [
      {
        name: "Method_Validation_Report.pdf",
        size: 325600,
        type: "application/pdf",
        uploadedAt: "2023-03-10T11:10:00Z"
      },
      {
        name: "Calibration_Curve_Template.xlsx",
        size: 28672,
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        uploadedAt: "2023-02-05T14:25:00Z"
      }
    ]
  },
  {
    id: "PROT-005",
    title: "Stability Testing Protocol for Drug Formulation",
    category: "Formulation",
    version: "1.1",
    author: "Dr. Robert Wilson",
    status: "In Review",
    createdAt: "2023-04-25T09:30:00Z",
    updatedAt: "2023-04-28T15:45:00Z",
    objectives: "To evaluate the physical and chemical stability of Compound DEF-789 in various formulations under different storage conditions.",
    materials: "- Compound DEF-789\n- Excipients (list specific components)\n- HPLC system\n- Particle size analyzer\n- pH meter\n- Viscometer\n- Stability chambers (25°C/60% RH, 40°C/75% RH)",
    procedure: "1. Prepare the following formulations:\n   - Formulation A: 10 mg/mL in phosphate buffer pH 7.4\n   - Formulation B: 10 mg/mL in citrate buffer pH 5.0\n   - Formulation C: 10 mg/mL in lipid nanoparticles\n\n2. Store samples at the following conditions:\n   - 5°C ± 3°C\n   - 25°C ± 2°C / 60% RH ± 5% RH\n   - 40°C ± 2°C / 75% RH ± 5% RH\n\n3. Test samples at 0, 1, 3, and 6 months for:\n   - Appearance\n   - pH\n   - Particle size (for Formulation C)\n   - Viscosity\n   - Drug content by HPLC\n   - Degradation products by HPLC\n\n4. Calculate degradation rates and predict shelf life",
    outcomes: "The study will determine:\n- Physical stability of formulations\n- Chemical stability of the drug substance\n- Degradation pathways and products\n- Recommended storage conditions\n- Tentative shelf life for each formulation",
    references: "1. ICH Guideline Q1A(R2): Stability Testing of New Drug Substances and Products\n2. Wilson R, et al. (2021). Stability assessment of novel drug formulations. J Pharm Sci 110:1245-1258.",
    files: [
      {
        name: "Stability_Protocol_Template.docx",
        size: 45056,
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        uploadedAt: "2023-04-25T09:35:00Z"
      }
    ]
  },
  {
    id: "PROT-006",
    title: "In Vitro ADME Screening Protocol",
    category: "Pharmacokinetics",
    version: "2.0",
    author: "Dr. Lisa Martinez",
    status: "Archived",
    createdAt: "2022-11-12T10:00:00Z",
    updatedAt: "2023-01-05T16:30:00Z",
    objectives: "To evaluate the in vitro ADME properties of test compounds, including solubility, permeability, metabolic stability, and protein binding.",
    materials: "- Test compounds\n- DMSO\n- Buffers (pH 2.0, 6.8, 7.4)\n- Caco-2 cells\n- Human liver microsomes\n- Human plasma\n- LC-MS/MS system",
    procedure: "1. Solubility assessment:\n   - Prepare 10 mM stock solutions in DMSO\n   - Dilute to 100 μM in buffers at pH 2.0, 6.8, and 7.4\n   - Incubate at 37°C for 2 hours with shaking\n   - Centrifuge and analyze supernatant by LC-MS/MS\n\n2. Caco-2 permeability:\n   - Culture Caco-2 cells on transwell plates for 21 days\n   - Add test compounds (10 μM) to apical or basolateral compartment\n   - Collect samples at 0, 1, 2, and 3 hours\n   - Analyze by LC-MS/MS and calculate Papp values\n\n3. Metabolic stability:\n   - Incubate test compounds (1 μM) with human liver microsomes\n   - Collect samples at 0, 5, 15, 30, and 60 minutes\n   - Analyze by LC-MS/MS and calculate half-life\n\n4. Plasma protein binding:\n   - Incubate test compounds (1 μM) with human plasma\n   - Perform equilibrium dialysis against buffer for 6 hours\n   - Analyze by LC-MS/MS and calculate fraction unbound",
    outcomes: "The screening will provide:\n- Aqueous solubility at different pH values\n- Apparent permeability coefficients (Papp)\n- Efflux ratios\n- Metabolic half-life\n- Intrinsic clearance\n- Plasma protein binding percentage",
    references: "1. Martinez L, et al. (2022). High-throughput ADME screening methods for drug discovery. Drug Metab Dispos 50:89-103.\n2. Internal SOP #ADME-001: In vitro ADME screening cascade.",
    files: [
      {
        name: "ADME_Screening_Results_Template.xlsx",
        size: 36864,
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        uploadedAt: "2022-11-12T10:05:00Z"
      }
    ]
  }
];