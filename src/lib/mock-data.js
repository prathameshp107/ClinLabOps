// Mock data generator for tasks
export const generateMockTasks = () => [
  {
    id: "task-1",
    title: "Document experiment results",
    description: "Complete documentation for recent experiment findings",
    status: "completed",
    priority: "low",
    assigneeId: "2",
    experimentId: "exp1",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    subtasks: [
      { id: "subtask1", description: "Organize data files", completed: true },
      { id: "subtask2", description: "Draft initial findings", completed: true },
      { id: "subtask3", description: "Submit to team lead for review", completed: true },
    ],
  },
  {
    id: "t1",
    title: "Analyze blood samples for Project XYZ",
    description: "Run analysis on collected blood samples and record results",
    status: "pending",
    priority: "high",
    assigneeId: "3",
    experimentId: "exp1",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    subtasks: [
      { id: "subtask10", description: "Prepare testing equipment", completed: false },
      { id: "subtask11", description: "Process samples according to protocol", completed: false },
      { id: "subtask12", description: "Document findings in lab system", completed: false },
    ],
  },
  {
    id: "task-2",
    title: "Prepare cell cultures for experiment",
    description: "Set up cell cultures for next week's scheduled experiment",
    status: "in-progress",
    priority: "medium",
    assigneeId: "1",
    experimentId: "exp2",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    subtasks: [
      { id: "subtask4", description: "Prepare growth media", completed: true },
      { id: "subtask5", description: "Sterilize equipment", completed: true },
      { id: "subtask6", description: "Set up incubator conditions", completed: false },
    ],
  },
  {
    id: "t2",
    title: "Prepare cell cultures for experiment",
    description: "Set up cell cultures for next week's scheduled experiment",
    status: "in-progress",
    priority: "medium",
    assigneeId: "1",
    experimentId: "exp2",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    subtasks: [
      { id: "subtask4", description: "Prepare growth media", completed: true },
      { id: "subtask5", description: "Sterilize equipment", completed: true },
      { id: "subtask6", description: "Set up incubator conditions", completed: false },
    ],
  },
  {
    id: "task-3",
    title: "Set up equipment for microscopy",
    description: "Configure and calibrate microscope for scheduled imaging session",
    status: "in-progress",
    priority: "high",
    assigneeId: "3",
    experimentId: "exp3",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    subtasks: [
      { id: "subtask7", description: "Clean optical components", completed: true },
      { id: "subtask8", description: "Run calibration protocol", completed: false },
      { id: "subtask9", description: "Test with standard samples", completed: false },
    ],
  },
  {
    id: "t3",
    title: "Document experiment results",
    description: "Complete documentation for recent experiment findings",
    status: "completed",
    priority: "low",
    assigneeId: "2",
    experimentId: "exp1",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    subtasks: [
      { id: "subtask13", description: "Review documentation", completed: true },
      { id: "subtask14", description: "Update findings", completed: true },
      { id: "subtask15", description: "Final submission", completed: true },
    ],
  }
]

// Mock data generator for experiments
export function generateMockExperiments() {
  const statuses = ["planning", "in-progress", "completed", "archived"];
  const priorities = ["low", "medium", "high"];
  
  const experimentTitles = [
    "Protein Crystallization Analysis",
    "DNA Sequencing of Bacterial Strains",
    "Enzyme Kinetics Study",
    "Cell Culture Optimization",
    "Antibody Characterization",
    "PCR Protocol Development",
    "Spectroscopic Analysis of Compounds",
    "Microbial Growth Rate Analysis",
    "Chromatography Method Development",
    "Biomarker Identification Study",
    "Nanoparticle Synthesis and Characterization",
    "Gene Expression Analysis",
    "Protein Purification Protocol",
    "Metabolite Profiling",
    "Toxicity Screening Assay"
  ];
  
  const teamMembers = [
    "John Smith",
    "Maria Rodriguez",
    "David Chen",
    "Sarah Johnson",
    "Ahmed Hassan",
    "Emily Wilson",
    "Michael Brown",
    "Priya Patel",
    "James Taylor",
    "Sophia Kim"
  ];
  
  // Generate random experiments
  return experimentTitles.map((title, index) => {
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 60));
    
    const updatedDate = new Date(createdDate);
    updatedDate.setDate(updatedDate.getDate() + Math.floor(Math.random() * 30));
    
    const startDate = new Date(createdDate);
    startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 10));
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 14 + Math.floor(Math.random() * 30));
    
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    
    // Generate random team members (1-4 people)
    const numTeamMembers = 1 + Math.floor(Math.random() * 4);
    const assignedTeam = [];
    const usedIndices = new Set();
    
    for (let i = 0; i < numTeamMembers; i++) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * teamMembers.length);
      } while (usedIndices.has(randomIndex));
      
      usedIndices.add(randomIndex);
      assignedTeam.push(teamMembers[randomIndex]);
    }
    
    // Generate version history
    const versionCount = 1 + Math.floor(Math.random() * 3);
    const versionHistory = [];
    
    for (let v = 1; v <= versionCount; v++) {
      const versionDate = new Date(createdDate);
      versionDate.setDate(versionDate.getDate() + (v - 1) * 5 + Math.floor(Math.random() * 5));
      
      versionHistory.push({
        version: v,
        updatedAt: versionDate.toISOString(),
        updatedBy: teamMembers[Math.floor(Math.random() * teamMembers.length)],
        changes: v === 1 
          ? "Initial version" 
          : `Updated ${["protocol", "description", "team members", "timeline"][Math.floor(Math.random() * 4)]}`
      });
    }
    
    return {
      id: `exp-${index + 1}`,
      title,
      description: `This experiment aims to ${getRandomDescription(title)}. The study will provide valuable insights into ${getRandomInsight(title)}.`,
      protocol: getRandomProtocol(title),
      status,
      priority,
      createdAt: createdDate.toISOString(),
      updatedAt: updatedDate.toISOString(),
      startDate: startDate.toISOString(),
      endDate: status === "completed" || status === "archived" ? endDate.toISOString() : null,
      teamMembers: assignedTeam,
      version: versionCount,
      versionHistory
    };
  });
}

// Helper functions for generating realistic descriptions
function getRandomDescription(title) {
  const actions = [
    "investigate the properties of",
    "characterize the behavior of",
    "optimize the conditions for",
    "develop a new method for analyzing",
    "establish a protocol for isolating",
    "determine the efficacy of",
    "validate the performance of",
    "explore the relationship between",
    "quantify the effects of"
  ];
  
  const action = actions[Math.floor(Math.random() * actions.length)];
  
  if (title.includes("Protein")) {
    return `${action} protein structures under varying pH conditions`;
  } else if (title.includes("DNA")) {
    return `${action} genetic markers in bacterial populations`;
  } else if (title.includes("Enzyme")) {
    return `${action} enzymatic reactions at different temperatures`;
  } else if (title.includes("Cell")) {
    return `${action} cell growth in modified culture media`;
  } else if (title.includes("Antibody")) {
    return `${action} antibody binding specificity and affinity`;
  } else if (title.includes("PCR")) {
    return `${action} PCR amplification of low-abundance targets`;
  } else if (title.includes("Spectroscopic")) {
    return `${action} molecular structures using advanced spectroscopy`;
  } else if (title.includes("Microbial")) {
    return `${action} microbial communities in environmental samples`;
  } else if (title.includes("Chromatography")) {
    return `${action} complex mixtures using novel chromatographic techniques`;
  } else if (title.includes("Biomarker")) {
    return `${action} potential biomarkers for early disease detection`;
  } else if (title.includes("Nanoparticle")) {
    return `${action} nanoparticle stability and cellular uptake`;
  } else if (title.includes("Gene")) {
    return `${action} gene expression patterns under stress conditions`;
  } else if (title.includes("Purification")) {
    return `${action} protein purification yield and purity`;
  } else if (title.includes("Metabolite")) {
    return `${action} metabolic pathways in model organisms`;
  } else {
    return `${action} novel compounds for potential therapeutic applications`;
  }
}

function getRandomInsight(title) {
  const insights = [
    "fundamental biological processes",
    "potential therapeutic applications",
    "improved diagnostic methods",
    "optimized laboratory techniques",
    "novel research methodologies",
    "disease mechanisms",
    "cellular response pathways",
    "molecular interactions",
    "biochemical reaction kinetics",
    "structure-function relationships"
  ];
  
  return insights[Math.floor(Math.random() * insights.length)];
}

function getRandomProtocol(title) {
  let protocol = "";
  
  if (title.includes("Protein")) {
    protocol = `1. Prepare protein samples at concentrations of 1-5 mg/mL
2. Set up crystallization screens using hanging drop vapor diffusion
3. Incubate plates at 18°C and monitor crystal growth daily
4. Harvest crystals and prepare for X-ray diffraction
5. Collect diffraction data and process using XDS software
6. Perform molecular replacement using Phenix
7. Refine structure and validate using MolProbity`;
  } else if (title.includes("DNA")) {
    protocol = `1. Extract genomic DNA from bacterial cultures using QIAamp DNA Mini Kit
2. Quantify DNA using Qubit fluorometer
3. Prepare sequencing libraries using Nextera XT DNA Library Prep Kit
4. Perform quality control using Bioanalyzer
5. Sequence on Illumina MiSeq platform (2x300bp paired-end)
6. Analyze data using BWA for alignment and GATK for variant calling
7. Annotate variants using SnpEff`;
  } else if (title.includes("Enzyme")) {
    protocol = `1. Prepare enzyme dilutions in appropriate buffer (pH 7.4)
2. Prepare substrate solutions at concentrations ranging from 0.1-10 mM
3. Mix enzyme and substrate in 96-well plate
4. Monitor reaction progress by measuring absorbance at 405 nm
5. Collect data at 30-second intervals for 10 minutes
6. Calculate reaction rates for each substrate concentration
7. Fit data to Michaelis-Menten equation to determine Km and Vmax`;
  } else if (title.includes("Cell")) {
    protocol = `1. Prepare culture media with varying supplements
2. Seed cells at density of 5x10^4 cells/mL
3. Incubate at 37°C, 5% CO2 for 72 hours
4. Monitor cell growth using automated cell counter
5. Assess viability using trypan blue exclusion
6. Measure metabolite consumption using HPLC
7. Analyze growth curves and determine optimal conditions`;
  } else {
    protocol = `1. Prepare all reagents according to manufacturer specifications
2. Set up experimental and control groups (n=3 for each condition)
3. Perform procedure following standard laboratory practices
4. Collect data at specified timepoints (0h, 24h, 48h, 72h)
5. Process samples according to established protocol
6. Analyze results using appropriate statistical methods
7. Document findings and prepare visualization of key results`;
  }
  
  return protocol;
}