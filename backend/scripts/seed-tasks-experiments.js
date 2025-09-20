require('dotenv').config();
const mongoose = require('mongoose');
const Task = require('../models/Task');
const Experiment = require('../models/Experiment');
const Protocol = require('../models/Protocol');
const Enquiry = require('../models/Enquiry');
const Equipment = require('../models/Equipment');
const User = require('../models/User');
const Project = require('../models/Project');

// Connect to MongoDB
if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is required');
    process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Sample Tasks Data
const sampleTasks = [
    {
        title: 'Setup Laboratory Equipment',
        description: 'Configure and calibrate all laboratory equipment for the new research project',
        status: 'todo',
        priority: 'high',
        assignee: 'Lab Technician',
        dueDate: new Date('2024-09-15'),
        labels: ['equipment', 'setup', 'calibration'],
        customId: 'LAB-001',
        subtasks: [
            {
                id: 'subtask-1',
                title: 'Calibrate microscopes',
                status: 'not_started',
                assignee: 'John Doe',
                priority: 'high',
                dueDate: new Date('2024-09-10')
            },
            {
                id: 'subtask-2',
                title: 'Test centrifuge functionality',
                status: 'not_started',
                assignee: 'Jane Smith',
                priority: 'medium',
                dueDate: new Date('2024-09-12')
            }
        ],
        comments: [
            {
                id: 'comment-1',
                author: 'Lab Manager',
                text: 'Please ensure all safety protocols are followed during setup',
                createdAt: new Date('2024-09-01'),
                replies: []
            }
        ]
    },
    {
        title: 'Sample Collection Protocol',
        description: 'Develop and document standardized sample collection procedures',
        status: 'in-progress',
        priority: 'medium',
        assignee: 'Research Assistant',
        dueDate: new Date('2024-09-20'),
        labels: ['protocol', 'documentation', 'samples'],
        customId: 'LAB-002',
        subtasks: [
            {
                id: 'subtask-3',
                title: 'Draft initial protocol',
                status: 'completed',
                assignee: 'Alice Johnson',
                priority: 'high',
                dueDate: new Date('2024-09-05')
            },
            {
                id: 'subtask-4',
                title: 'Review with team',
                status: 'in_progress',
                assignee: 'Bob Wilson',
                priority: 'medium',
                dueDate: new Date('2024-09-15')
            }
        ]
    },
    {
        title: 'Data Analysis Pipeline',
        description: 'Create automated data analysis pipeline for experimental results',
        status: 'review',
        priority: 'high',
        assignee: 'Data Scientist',
        dueDate: new Date('2024-09-25'),
        labels: ['analysis', 'automation', 'pipeline'],
        customId: 'LAB-003'
    },
    {
        title: 'Quality Control Testing',
        description: 'Implement quality control measures for all laboratory processes',
        status: 'done',
        priority: 'high',
        assignee: 'QC Manager',
        dueDate: new Date('2024-08-30'),
        labels: ['quality', 'testing', 'compliance'],
        customId: 'LAB-004'
    },
    {
        title: 'Equipment Maintenance Schedule',
        description: 'Create and implement regular maintenance schedule for all equipment',
        status: 'todo',
        priority: 'low',
        assignee: 'Maintenance Team',
        dueDate: new Date('2024-10-01'),
        labels: ['maintenance', 'schedule', 'equipment'],
        customId: 'LAB-005'
    }
];

// Sample Experiments Data
const sampleExperiments = [
    {
        title: 'Protein Expression Analysis',
        description: 'Comprehensive analysis of protein expression levels under different environmental conditions',
        protocol: 'Standard Western Blot Protocol with modifications for temperature sensitivity analysis',
        status: 'in-progress',
        priority: 'high',
        startDate: new Date('2024-09-01'),
        endDate: new Date('2024-10-15'),
        teamMembers: ['Dr. Sarah Chen', 'Lab Tech Mike', 'Graduate Student Emma'],
        version: 1,
        versionHistory: [
            {
                version: 1,
                updatedAt: new Date('2024-09-01'),
                updatedBy: 'Dr. Sarah Chen',
                changes: 'Initial experiment setup'
            }
        ]
    },
    {
        title: 'Cell Viability Study',
        description: 'Investigation of cell viability under various drug concentrations and exposure times',
        protocol: 'MTT Assay Protocol v2.1 with automated plate reader integration',
        status: 'planning',
        priority: 'medium',
        startDate: new Date('2024-09-15'),
        endDate: new Date('2024-11-30'),
        teamMembers: ['Dr. James Rodriguez', 'Research Assistant Lisa', 'Intern David'],
        version: 1,
        versionHistory: [
            {
                version: 1,
                updatedAt: new Date('2024-08-25'),
                updatedBy: 'Dr. James Rodriguez',
                changes: 'Initial planning phase'
            }
        ]
    },
    {
        title: 'Enzyme Kinetics Characterization',
        description: 'Detailed kinetic analysis of novel enzyme variants for industrial applications',
        protocol: 'Spectrophotometric Enzyme Assay with temperature and pH optimization',
        status: 'completed',
        priority: 'high',
        startDate: new Date('2024-07-01'),
        endDate: new Date('2024-08-31'),
        teamMembers: ['Dr. Maria Garcia', 'Postdoc Alex', 'Lab Manager Tom'],
        version: 3,
        versionHistory: [
            {
                version: 1,
                updatedAt: new Date('2024-07-01'),
                updatedBy: 'Dr. Maria Garcia',
                changes: 'Initial experiment design'
            },
            {
                version: 2,
                updatedAt: new Date('2024-07-15'),
                updatedBy: 'Postdoc Alex',
                changes: 'Modified buffer conditions based on preliminary results'
            },
            {
                version: 3,
                updatedAt: new Date('2024-08-01'),
                updatedBy: 'Dr. Maria Garcia',
                changes: 'Added additional temperature points for comprehensive analysis'
            }
        ]
    },
    {
        title: 'Microbiome Diversity Analysis',
        description: 'Comprehensive analysis of microbial diversity in environmental samples',
        protocol: '16S rRNA sequencing with bioinformatics pipeline for taxonomic classification',
        status: 'on-hold',
        priority: 'low',
        startDate: new Date('2024-10-01'),
        endDate: new Date('2024-12-15'),
        teamMembers: ['Dr. Kevin Park', 'Bioinformatics Specialist Anna'],
        version: 1,
        versionHistory: [
            {
                version: 1,
                updatedAt: new Date('2024-08-20'),
                updatedBy: 'Dr. Kevin Park',
                changes: 'Initial protocol development'
            }
        ]
    },
    {
        title: 'Drug Interaction Screening',
        description: 'High-throughput screening of drug-drug interactions using cell-based assays',
        protocol: 'Automated liquid handling system with fluorescence-based readout',
        status: 'archived',
        priority: 'medium',
        startDate: new Date('2024-05-01'),
        endDate: new Date('2024-06-30'),
        teamMembers: ['Dr. Rachel Kim', 'Automation Specialist John', 'Data Analyst Sophie'],
        version: 2,
        versionHistory: [
            {
                version: 1,
                updatedAt: new Date('2024-05-01'),
                updatedBy: 'Dr. Rachel Kim',
                changes: 'Initial screening setup'
            },
            {
                version: 2,
                updatedAt: new Date('2024-05-20'),
                updatedBy: 'Automation Specialist John',
                changes: 'Optimized liquid handling parameters'
            }
        ]
    }
];

// Sample Protocols Data
const sampleProtocols = [
    {
        name: 'Western Blot Analysis',
        description: 'Standard protocol for protein detection using Western blot technique with enhanced sensitivity',
        category: 'Protein',
        version: '2.1',
        status: 'Approved',
        steps: [
            {
                stepNumber: 1,
                title: 'Sample Preparation',
                description: 'Prepare protein samples and lysis buffer',
                instructions: 'Lyse cells in RIPA buffer with protease inhibitors. Incubate on ice for 30 minutes with occasional vortexing.',
                duration: '45 minutes',
                notes: 'Keep samples on ice throughout the process'
            },
            {
                stepNumber: 2,
                title: 'Protein Quantification',
                description: 'Determine protein concentration using BCA assay',
                instructions: 'Use BCA protein assay kit according to manufacturer instructions. Read absorbance at 562nm.',
                duration: '30 minutes',
                notes: 'Prepare standard curve with BSA'
            },
            {
                stepNumber: 3,
                title: 'SDS-PAGE Electrophoresis',
                description: 'Separate proteins by molecular weight',
                instructions: 'Load equal amounts of protein (20-50μg) onto SDS-PAGE gel. Run at 120V for 90 minutes.',
                duration: '2 hours',
                notes: 'Use pre-stained molecular weight markers'
            },
            {
                stepNumber: 4,
                title: 'Transfer to Membrane',
                description: 'Transfer proteins to PVDF membrane',
                instructions: 'Transfer proteins to PVDF membrane using wet transfer method at 100V for 1 hour at 4°C.',
                duration: '1.5 hours',
                notes: 'Pre-activate PVDF membrane with methanol'
            },
            {
                stepNumber: 5,
                title: 'Blocking and Antibody Incubation',
                description: 'Block membrane and incubate with antibodies',
                instructions: 'Block with 5% milk in TBST for 1 hour. Incubate with primary antibody overnight at 4°C.',
                duration: '16 hours',
                notes: 'Optimize antibody dilution for each target'
            }
        ],
        materials: [
            { name: 'RIPA Buffer', quantity: '50ml', notes: 'Store at 4°C' },
            { name: 'Protease Inhibitor Cocktail', quantity: '1 tablet', notes: 'Add fresh before use' },
            { name: 'BCA Protein Assay Kit', quantity: '1 kit', notes: 'Store at room temperature' },
            { name: 'SDS-PAGE Gel', quantity: '2 gels', notes: '4-20% gradient recommended' },
            { name: 'PVDF Membrane', quantity: '1 sheet', notes: '0.45μm pore size' }
        ],
        safetyNotes: 'Wear gloves when handling chemicals. Work in fume hood when using methanol. Dispose of waste according to institutional guidelines.',
        references: [
            'Towbin et al. (1979) PNAS 76:4350-4354',
            'Burnette (1981) Anal Biochem 112:195-203'
        ],
        tags: ['protein', 'western blot', 'detection', 'antibody'],
        isPublic: true
    },
    {
        name: 'Cell Culture Maintenance',
        description: 'Standard operating procedure for maintaining mammalian cell cultures in sterile conditions',
        category: 'Cell Culture',
        version: '1.5',
        status: 'Approved',
        steps: [
            {
                stepNumber: 1,
                title: 'Preparation',
                description: 'Prepare sterile workspace and materials',
                instructions: 'Clean biosafety cabinet with 70% ethanol. Pre-warm media and PBS to 37°C.',
                duration: '15 minutes',
                notes: 'UV sterilize cabinet for 15 minutes before use'
            },
            {
                stepNumber: 2,
                title: 'Cell Observation',
                description: 'Examine cells under microscope',
                instructions: 'Check cell morphology, confluence, and contamination under inverted microscope.',
                duration: '10 minutes',
                notes: 'Document any abnormalities'
            },
            {
                stepNumber: 3,
                title: 'Media Change',
                description: 'Replace old media with fresh media',
                instructions: 'Aspirate old media carefully. Add fresh pre-warmed media gently to avoid cell detachment.',
                duration: '5 minutes',
                notes: 'Change media every 2-3 days'
            },
            {
                stepNumber: 4,
                title: 'Passaging (if needed)',
                description: 'Split confluent cultures',
                instructions: 'Wash with PBS, add trypsin, incubate 3-5 min. Add media to neutralize, centrifuge, resuspend.',
                duration: '20 minutes',
                notes: 'Passage when 80-90% confluent'
            }
        ],
        materials: [
            { name: 'Complete Growth Media', quantity: '500ml', notes: 'Store at 4°C, use within 2 weeks' },
            { name: 'PBS (sterile)', quantity: '100ml', notes: 'Store at room temperature' },
            { name: 'Trypsin-EDTA', quantity: '10ml', notes: 'Store at -20°C, thaw before use' },
            { name: 'T75 Culture Flasks', quantity: '5 flasks', notes: 'Sterile, tissue culture treated' }
        ],
        safetyNotes: 'Work in biosafety cabinet. Wear gloves and lab coat. Dispose of contaminated materials in biohazard waste.',
        references: [
            'Freshney (2010) Culture of Animal Cells, 6th Edition',
            'ATCC Cell Culture Guidelines'
        ],
        tags: ['cell culture', 'maintenance', 'sterile technique', 'passaging']
    },
    {
        name: 'PCR Amplification Protocol',
        description: 'Polymerase chain reaction protocol for DNA amplification with high fidelity polymerase',
        category: 'DNA/RNA',
        version: '3.0',
        status: 'Approved',
        steps: [
            {
                stepNumber: 1,
                title: 'Primer Design and Validation',
                description: 'Design and validate PCR primers',
                instructions: 'Design primers with Tm 55-65°C, 18-25 bp length. Check for specificity using BLAST.',
                duration: '30 minutes',
                notes: 'Avoid primer dimers and secondary structures'
            },
            {
                stepNumber: 2,
                title: 'Reaction Setup',
                description: 'Prepare PCR reaction mixture',
                instructions: 'Mix template DNA (10-100ng), primers (0.5μM each), dNTPs (200μM), polymerase (1U), buffer in 25μl total.',
                duration: '15 minutes',
                notes: 'Keep on ice during setup'
            },
            {
                stepNumber: 3,
                title: 'Thermal Cycling',
                description: 'Run PCR amplification program',
                instructions: 'Initial denaturation 95°C 3min, then 35 cycles: 95°C 30s, annealing temp 30s, 72°C 1min/kb, final extension 72°C 5min.',
                duration: '2-3 hours',
                notes: 'Optimize annealing temperature if needed'
            },
            {
                stepNumber: 4,
                title: 'Product Analysis',
                description: 'Analyze PCR products by gel electrophoresis',
                instructions: 'Load 5μl PCR product on 1% agarose gel with DNA ladder. Run at 120V for 30 minutes.',
                duration: '45 minutes',
                notes: 'Use appropriate DNA ladder for size estimation'
            }
        ],
        materials: [
            { name: 'High Fidelity DNA Polymerase', quantity: '1 tube', notes: 'Store at -20°C' },
            { name: 'PCR Buffer (10x)', quantity: '1ml', notes: 'Provided with polymerase' },
            { name: 'dNTP Mix (10mM)', quantity: '100μl', notes: 'Store at -20°C in small aliquots' },
            { name: 'Forward Primer (10μM)', quantity: '50μl', notes: 'Store at -20°C' },
            { name: 'Reverse Primer (10μM)', quantity: '50μl', notes: 'Store at -20°C' }
        ],
        safetyNotes: 'Handle ethidium bromide with extreme care. Use UV protection when viewing gels. Dispose of gel waste properly.',
        references: [
            'Saiki et al. (1988) Science 239:487-491',
            'Mullis & Faloona (1987) Methods Enzymol 155:335-350'
        ],
        tags: ['PCR', 'DNA amplification', 'molecular biology', 'primers']
    },
    {
        name: 'ELISA Immunoassay',
        description: 'Enzyme-linked immunosorbent assay for quantitative protein detection and analysis',
        category: 'Bioanalytical',
        version: '2.3',
        status: 'Approved',
        steps: [
            {
                stepNumber: 1,
                title: 'Plate Coating',
                description: 'Coat ELISA plate with capture antibody',
                instructions: 'Dilute capture antibody in coating buffer. Add 100μl per well. Incubate overnight at 4°C.',
                duration: '16 hours',
                notes: 'Optimize antibody concentration (typically 1-10μg/ml)'
            },
            {
                stepNumber: 2,
                title: 'Blocking',
                description: 'Block non-specific binding sites',
                instructions: 'Wash 3x with wash buffer. Add 200μl blocking buffer per well. Incubate 1 hour at RT.',
                duration: '1 hour',
                notes: 'Use 1% BSA or 5% milk in PBS-T'
            },
            {
                stepNumber: 3,
                title: 'Sample and Standard Addition',
                description: 'Add samples and standard curve',
                instructions: 'Prepare serial dilutions of standard. Add 100μl samples/standards per well. Incubate 2 hours at RT.',
                duration: '2 hours',
                notes: 'Run samples in duplicate or triplicate'
            },
            {
                stepNumber: 4,
                title: 'Detection Antibody',
                description: 'Add biotinylated detection antibody',
                instructions: 'Wash 3x. Add 100μl detection antibody in blocking buffer. Incubate 1 hour at RT.',
                duration: '1 hour',
                notes: 'Optimize detection antibody concentration'
            },
            {
                stepNumber: 5,
                title: 'Signal Development',
                description: 'Add streptavidin-HRP and substrate',
                instructions: 'Wash 3x. Add streptavidin-HRP, incubate 30 min. Wash 3x. Add TMB substrate, develop 15 min. Stop with acid.',
                duration: '1 hour',
                notes: 'Monitor color development carefully'
            }
        ],
        materials: [
            { name: '96-well ELISA Plate', quantity: '1 plate', notes: 'High binding, flat bottom' },
            { name: 'Capture Antibody', quantity: '100μg', notes: 'Store at 4°C or -20°C' },
            { name: 'Detection Antibody (biotinylated)', quantity: '50μg', notes: 'Store at 4°C' },
            { name: 'Streptavidin-HRP', quantity: '1ml', notes: 'Store at 4°C, protect from light' },
            { name: 'TMB Substrate', quantity: '25ml', notes: 'Store at 4°C, protect from light' }
        ],
        safetyNotes: 'Handle HRP substrate with care. Avoid skin contact with stop solution (sulfuric acid). Work in well-ventilated area.',
        references: [
            'Engvall & Perlmann (1971) Immunochemistry 8:871-874',
            'Van Weemen & Schuurs (1971) FEBS Lett 15:232-236'
        ],
        tags: ['ELISA', 'immunoassay', 'protein detection', 'quantitative']
    },
    {
        name: 'RNA Extraction and Purification',
        description: 'Total RNA extraction from mammalian cells using TRIzol reagent with DNase treatment',
        category: 'DNA/RNA',
        version: '1.8',
        status: 'In Review',
        steps: [
            {
                stepNumber: 1,
                title: 'Cell Lysis',
                description: 'Lyse cells with TRIzol reagent',
                instructions: 'Add 1ml TRIzol per 10cm dish. Scrape cells and transfer to tube. Incubate 5 minutes at RT.',
                duration: '10 minutes',
                notes: 'Work quickly to prevent RNA degradation'
            },
            {
                stepNumber: 2,
                title: 'Phase Separation',
                description: 'Separate aqueous and organic phases',
                instructions: 'Add 200μl chloroform per 1ml TRIzol. Shake vigorously 15s. Incubate 3 min. Centrifuge 12,000g, 15 min, 4°C.',
                duration: '25 minutes',
                notes: 'RNA is in the upper aqueous phase'
            },
            {
                stepNumber: 3,
                title: 'RNA Precipitation',
                description: 'Precipitate RNA with isopropanol',
                instructions: 'Transfer aqueous phase to new tube. Add 500μl isopropanol. Mix gently. Incubate 10 min at RT.',
                duration: '15 minutes',
                notes: 'Do not transfer any organic phase'
            },
            {
                stepNumber: 4,
                title: 'RNA Washing',
                description: 'Wash RNA pellet with ethanol',
                instructions: 'Centrifuge 12,000g, 10 min, 4°C. Remove supernatant. Wash pellet with 1ml 75% ethanol. Centrifuge again.',
                duration: '20 minutes',
                notes: 'Air dry pellet briefly, do not over-dry'
            },
            {
                stepNumber: 5,
                title: 'DNase Treatment',
                description: 'Remove contaminating DNA',
                instructions: 'Resuspend RNA in RNase-free water. Treat with DNase I for 15 min at RT. Inactivate DNase.',
                duration: '30 minutes',
                notes: 'Essential for qPCR applications'
            }
        ],
        materials: [
            { name: 'TRIzol Reagent', quantity: '50ml', notes: 'Store at 4°C, toxic - handle with care' },
            { name: 'Chloroform', quantity: '25ml', notes: 'Use in fume hood' },
            { name: 'Isopropanol', quantity: '25ml', notes: 'Molecular biology grade' },
            { name: 'Ethanol (75%)', quantity: '50ml', notes: 'Prepare with RNase-free water' },
            { name: 'DNase I Kit', quantity: '1 kit', notes: 'Store at -20°C' }
        ],
        safetyNotes: 'TRIzol contains phenol and guanidine - highly toxic. Work in fume hood. Wear gloves and eye protection. RNase-free technique essential.',
        references: [
            'Chomczynski & Sacchi (1987) Anal Biochem 162:156-159',
            'Rio et al. (2010) Cold Spring Harb Protoc'
        ],
        tags: ['RNA extraction', 'TRIzol', 'DNase treatment', 'purification']
    }
];

// Sample Enquiries Data
const sampleEnquiries = [
    {
        id: 'DS834567',
        customerName: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@biotech.com',
        phone: '+1-555-0123',
        companyName: 'BioTech Solutions Inc.',
        subject: 'Custom Protein Analysis Service',
        details: 'We need comprehensive protein expression analysis for our new therapeutic candidate. The project involves Western blot analysis, protein purification, and activity assays. Timeline is critical as we have regulatory deadlines approaching.',
        priority: 'High',
        assignedTo: 'Dr. Maria Garcia',
        status: 'In Progress',
        createdAt: new Date('2024-08-15').toISOString(),
        updatedAt: new Date('2024-08-20').toISOString(),
        progress: 65,
        documents: [
            {
                id: 'doc-1',
                name: 'Protein_Sequence.pdf',
                type: 'application/pdf',
                size: '2.5 MB',
                uploadedAt: new Date('2024-08-15').toISOString(),
                uploadedBy: 'Dr. Sarah Johnson',
                isReport: false
            },
            {
                id: 'doc-2',
                name: 'Analysis_Report_Draft.pdf',
                type: 'application/pdf',
                size: '1.8 MB',
                uploadedAt: new Date('2024-08-18').toISOString(),
                uploadedBy: 'Dr. Maria Garcia',
                isReport: true
            }
        ],
        activities: [
            {
                id: 'activity-1',
                action: 'Enquiry Created',
                user: 'Dr. Sarah Johnson',
                timestamp: new Date('2024-08-15').toISOString(),
                details: 'Initial enquiry submitted with protein sequence data'
            },
            {
                id: 'activity-2',
                action: 'Assigned to Researcher',
                user: 'Lab Manager',
                timestamp: new Date('2024-08-16').toISOString(),
                details: 'Assigned to Dr. Maria Garcia for protein analysis'
            },
            {
                id: 'activity-3',
                action: 'Analysis Started',
                user: 'Dr. Maria Garcia',
                timestamp: new Date('2024-08-17').toISOString(),
                details: 'Began protein expression analysis using Western blot protocol'
            }
        ],
        comments: [
            {
                id: 'comment-1',
                user: 'Dr. Maria Garcia',
                userRole: 'Senior Researcher',
                content: 'Initial analysis shows promising results. The protein expression levels are within expected range.',
                timestamp: new Date('2024-08-18').toISOString()
            },
            {
                id: 'comment-2',
                user: 'Dr. Sarah Johnson',
                userRole: 'Client',
                content: 'Great to hear! When can we expect the final report?',
                timestamp: new Date('2024-08-19').toISOString()
            }
        ]
    },
    {
        id: 'PM123456',
        customerName: 'Prof. Michael Chen',
        email: 'mchen@university.edu',
        phone: '+1-555-0456',
        companyName: 'State University Research Lab',
        subject: 'Cell Culture Contamination Investigation',
        details: 'Our cell cultures have been showing signs of contamination. We need help identifying the source and implementing proper decontamination protocols. This is affecting multiple ongoing experiments.',
        priority: 'High',
        assignedTo: 'Lab Technician Mike',
        status: 'Completed',
        createdAt: new Date('2024-07-20').toISOString(),
        updatedAt: new Date('2024-08-05').toISOString(),
        progress: 100,
        documents: [
            {
                id: 'doc-3',
                name: 'Contamination_Photos.zip',
                type: 'application/zip',
                size: '15.2 MB',
                uploadedAt: new Date('2024-07-20').toISOString(),
                uploadedBy: 'Prof. Michael Chen',
                isReport: false
            },
            {
                id: 'doc-4',
                name: 'Decontamination_Protocol.pdf',
                type: 'application/pdf',
                size: '3.1 MB',
                uploadedAt: new Date('2024-08-05').toISOString(),
                uploadedBy: 'Lab Technician Mike',
                isReport: true
            }
        ],
        activities: [
            {
                id: 'activity-4',
                action: 'Enquiry Received',
                user: 'Prof. Michael Chen',
                timestamp: new Date('2024-07-20').toISOString(),
                details: 'Contamination issue reported with photographic evidence'
            },
            {
                id: 'activity-5',
                action: 'Investigation Completed',
                user: 'Lab Technician Mike',
                timestamp: new Date('2024-08-05').toISOString(),
                details: 'Contamination source identified and decontamination protocol provided'
            }
        ],
        comments: [
            {
                id: 'comment-3',
                user: 'Lab Technician Mike',
                userRole: 'Lab Technician',
                content: 'Investigation complete. The contamination appears to be bacterial, likely from improper sterile technique. Detailed protocol attached.',
                timestamp: new Date('2024-08-05').toISOString()
            }
        ]
    },
    {
        id: 'DE789012',
        customerName: 'Dr. Emily Rodriguez',
        email: 'emily.r@pharma.com',
        phone: '+1-555-0789',
        companyName: 'PharmaCorp Ltd.',
        subject: 'Drug Stability Testing Protocol',
        details: 'We require development of a comprehensive drug stability testing protocol for our new pharmaceutical compound. The testing should include various environmental conditions and analytical methods.',
        priority: 'Medium',
        assignedTo: 'Dr. James Rodriguez',
        status: 'Pending',
        createdAt: new Date('2024-08-25').toISOString(),
        updatedAt: new Date('2024-08-25').toISOString(),
        progress: 10,
        documents: [
            {
                id: 'doc-5',
                name: 'Compound_Specifications.docx',
                type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                size: '1.2 MB',
                uploadedAt: new Date('2024-08-25').toISOString(),
                uploadedBy: 'Dr. Emily Rodriguez',
                isReport: false
            }
        ],
        activities: [
            {
                id: 'activity-6',
                action: 'New Enquiry',
                user: 'Dr. Emily Rodriguez',
                timestamp: new Date('2024-08-25').toISOString(),
                details: 'Stability testing protocol request submitted'
            }
        ],
        comments: []
    },
    {
        id: 'DR345678',
        customerName: 'Dr. Robert Kim',
        email: 'rkim@research.org',
        phone: '+1-555-0321',
        companyName: 'Advanced Research Institute',
        subject: 'PCR Optimization for Rare Samples',
        details: 'We are working with very limited sample quantities and need help optimizing our PCR protocols for maximum sensitivity and specificity. The samples are from archaeological specimens with degraded DNA.',
        priority: 'Medium',
        assignedTo: 'Bioinformatics Specialist Anna',
        status: 'On Hold',
        createdAt: new Date('2024-08-10').toISOString(),
        updatedAt: new Date('2024-08-22').toISOString(),
        progress: 30,
        documents: [
            {
                id: 'doc-6',
                name: 'Sample_Information.xlsx',
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                size: '856 KB',
                uploadedAt: new Date('2024-08-10').toISOString(),
                uploadedBy: 'Dr. Robert Kim',
                isReport: false
            }
        ],
        activities: [
            {
                id: 'activity-7',
                action: 'Enquiry Submitted',
                user: 'Dr. Robert Kim',
                timestamp: new Date('2024-08-10').toISOString(),
                details: 'PCR optimization request for archaeological samples'
            },
            {
                id: 'activity-8',
                action: 'Status Changed to On Hold',
                user: 'Lab Manager',
                timestamp: new Date('2024-08-22').toISOString(),
                details: 'Waiting for additional sample information from client'
            }
        ],
        comments: [
            {
                id: 'comment-4',
                user: 'Bioinformatics Specialist Anna',
                userRole: 'Specialist',
                content: 'We need more information about the sample preservation conditions and estimated DNA concentration.',
                timestamp: new Date('2024-08-22').toISOString()
            }
        ]
    },
    {
        id: 'DL901234',
        customerName: 'Dr. Lisa Thompson',
        email: 'lisa.thompson@biolab.com',
        phone: '+1-555-0654',
        companyName: 'BioLab Diagnostics',
        subject: 'ELISA Assay Development',
        details: 'We need assistance developing a custom ELISA assay for detecting a novel biomarker in patient serum samples. The assay needs to be highly sensitive and specific for clinical use.',
        priority: 'Low',
        assignedTo: 'Research Assistant Lisa',
        status: 'Cancelled',
        createdAt: new Date('2024-07-05').toISOString(),
        updatedAt: new Date('2024-07-30').toISOString(),
        progress: 0,
        documents: [
            {
                id: 'doc-7',
                name: 'Biomarker_Literature_Review.pdf',
                type: 'application/pdf',
                size: '4.7 MB',
                uploadedAt: new Date('2024-07-05').toISOString(),
                uploadedBy: 'Dr. Lisa Thompson',
                isReport: false
            }
        ],
        activities: [
            {
                id: 'activity-9',
                action: 'Enquiry Created',
                user: 'Dr. Lisa Thompson',
                timestamp: new Date('2024-07-05').toISOString(),
                details: 'ELISA development request submitted'
            },
            {
                id: 'activity-10',
                action: 'Enquiry Cancelled',
                user: 'Dr. Lisa Thompson',
                timestamp: new Date('2024-07-30').toISOString(),
                details: 'Client decided to develop assay in-house'
            }
        ],
        comments: [
            {
                id: 'comment-5',
                user: 'Dr. Lisa Thompson',
                userRole: 'Client',
                content: 'Thank you for the initial consultation. We have decided to develop this assay internally.',
                timestamp: new Date('2024-07-30').toISOString()
            }
        ]
    }
];

// Sample Equipment Data
const sampleEquipments = [
    {
        id: 'EQ-001',
        name: 'Inverted Fluorescence Microscope',
        type: 'Microscopy',
        model: 'IX73-P2F',
        manufacturer: 'Olympus',
        serialNumber: 'OLY-2024-001',
        location: 'Lab Room A-101',
        status: 'Active',
        purchaseDate: '2023-03-15',
        lastMaintenanceDate: '2024-07-15',
        nextMaintenanceDate: '2024-10-15',
        assignedTo: 'Dr. Sarah Chen',
        notes: 'Primary microscope for cell imaging and fluorescence studies. Equipped with multiple filter sets.',
        files: [
            {
                name: 'User_Manual_IX73.pdf',
                size: 5242880,
                type: 'application/pdf',
                uploadedAt: '2023-03-15T10:00:00Z'
            },
            {
                name: 'Calibration_Certificate.pdf',
                size: 1048576,
                type: 'application/pdf',
                uploadedAt: '2024-07-15T14:30:00Z'
            }
        ],
        maintenanceHistory: [
            {
                id: 'maint-001',
                type: 'preventive',
                description: 'Quarterly cleaning and calibration of optical components',
                performedBy: 'TechService Inc.',
                performedDate: new Date('2024-07-15'),
                cost: 450,
                notes: 'All optical components cleaned, filters checked, lamp replaced',
                nextDueDate: new Date('2024-10-15'),
                status: 'completed',
                partsReplaced: ['Mercury lamp', 'Filter set cleaning'],
                downtime: 4
            },
            {
                id: 'maint-002',
                type: 'corrective',
                description: 'Fixed focusing mechanism issue',
                performedBy: 'Internal Maintenance',
                performedDate: new Date('2024-05-20'),
                cost: 120,
                notes: 'Lubricated focusing gears, adjusted tension',
                status: 'completed',
                partsReplaced: [],
                downtime: 2
            }
        ]
    },
    {
        id: 'EQ-002',
        name: 'High-Speed Centrifuge',
        type: 'Centrifugation',
        model: 'Avanti JXN-30',
        manufacturer: 'Beckman Coulter',
        serialNumber: 'BC-2023-045',
        location: 'Lab Room B-205',
        status: 'Active',
        purchaseDate: '2023-01-20',
        lastMaintenanceDate: '2024-08-01',
        nextMaintenanceDate: '2024-11-01',
        assignedTo: 'Lab Technician Mike',
        notes: 'High-capacity centrifuge for protein purification and cell separation. Maximum speed 30,000 RPM.',
        files: [
            {
                name: 'Operation_Manual_JXN30.pdf',
                size: 8388608,
                type: 'application/pdf',
                uploadedAt: '2023-01-20T09:00:00Z'
            }
        ],
        maintenanceHistory: [
            {
                id: 'maint-003',
                type: 'preventive',
                description: 'Rotor inspection and balancing check',
                performedBy: 'Beckman Service',
                performedDate: new Date('2024-08-01'),
                cost: 680,
                notes: 'All rotors inspected, bearings lubricated, safety systems tested',
                nextDueDate: new Date('2024-11-01'),
                status: 'completed',
                partsReplaced: ['Rotor seals'],
                downtime: 6
            }
        ]
    },
    {
        id: 'EQ-003',
        name: 'PCR Thermal Cycler',
        type: 'Molecular Biology',
        model: 'T100',
        manufacturer: 'Bio-Rad',
        serialNumber: 'BR-2024-012',
        location: 'Lab Room C-301',
        status: 'Active',
        purchaseDate: '2024-02-10',
        lastMaintenanceDate: '2024-08-10',
        nextMaintenanceDate: '2024-11-10',
        assignedTo: 'Bioinformatics Specialist Anna',
        notes: '96-well thermal cycler for PCR amplification. Gradient capability for primer optimization.',
        files: [
            {
                name: 'T100_User_Guide.pdf',
                size: 3145728,
                type: 'application/pdf',
                uploadedAt: '2024-02-10T11:00:00Z'
            },
            {
                name: 'Temperature_Calibration_Report.pdf',
                size: 524288,
                type: 'application/pdf',
                uploadedAt: '2024-08-10T16:00:00Z'
            }
        ],
        maintenanceHistory: [
            {
                id: 'maint-004',
                type: 'calibration',
                description: 'Temperature accuracy verification and calibration',
                performedBy: 'Bio-Rad Service',
                performedDate: new Date('2024-08-10'),
                cost: 320,
                notes: 'Temperature sensors calibrated, heating block cleaned',
                nextDueDate: new Date('2024-11-10'),
                status: 'completed',
                partsReplaced: [],
                downtime: 3
            }
        ]
    },
    {
        id: 'EQ-004',
        name: 'Spectrophotometer UV-Vis',
        type: 'Spectroscopy',
        model: 'Cary 60',
        manufacturer: 'Agilent',
        serialNumber: 'AG-2023-078',
        location: 'Lab Room A-102',
        status: 'Maintenance',
        purchaseDate: '2023-06-05',
        lastMaintenanceDate: '2024-08-25',
        nextMaintenanceDate: '2024-09-15',
        assignedTo: 'Dr. Maria Garcia',
        notes: 'UV-Visible spectrophotometer for protein and nucleic acid quantification. Currently under maintenance.',
        files: [
            {
                name: 'Cary60_Manual.pdf',
                size: 6291456,
                type: 'application/pdf',
                uploadedAt: '2023-06-05T13:00:00Z'
            }
        ],
        maintenanceHistory: [
            {
                id: 'maint-005',
                type: 'corrective',
                description: 'Lamp replacement and optical path cleaning',
                performedBy: 'Agilent Service',
                performedDate: new Date('2024-08-25'),
                cost: 890,
                notes: 'Deuterium lamp replaced, monochromator cleaned, wavelength accuracy verified',
                nextDueDate: new Date('2024-09-15'),
                status: 'scheduled',
                partsReplaced: ['Deuterium lamp', 'Tungsten lamp'],
                downtime: 8
            }
        ]
    },
    {
        id: 'EQ-005',
        name: 'Biosafety Cabinet Class II',
        type: 'Safety Equipment',
        model: 'LabGard ES NU-540',
        manufacturer: 'NuAire',
        serialNumber: 'NA-2023-156',
        location: 'Lab Room B-203',
        status: 'Active',
        purchaseDate: '2023-04-12',
        lastMaintenanceDate: '2024-07-20',
        nextMaintenanceDate: '2024-10-20',
        assignedTo: 'Research Assistant Lisa',
        notes: 'Class II Type A2 biosafety cabinet for cell culture work. HEPA filtered air circulation.',
        files: [
            {
                name: 'BSC_Certification.pdf',
                size: 2097152,
                type: 'application/pdf',
                uploadedAt: '2024-07-20T10:00:00Z'
            },
            {
                name: 'Installation_Manual.pdf',
                size: 4194304,
                type: 'application/pdf',
                uploadedAt: '2023-04-12T15:00:00Z'
            }
        ],
        maintenanceHistory: [
            {
                id: 'maint-006',
                type: 'preventive',
                description: 'Annual certification and HEPA filter testing',
                performedBy: 'BioSafety Services',
                performedDate: new Date('2024-07-20'),
                cost: 550,
                notes: 'Airflow patterns verified, HEPA filters tested, UV lamp checked',
                nextDueDate: new Date('2024-10-20'),
                status: 'completed',
                partsReplaced: ['UV lamp'],
                downtime: 5
            }
        ]
    },
    {
        id: 'EQ-006',
        name: 'Automated Liquid Handler',
        type: 'Automation',
        model: 'Freedom EVO 100',
        manufacturer: 'Tecan',
        serialNumber: 'TC-2024-003',
        location: 'Lab Room C-305',
        status: 'Out of Service',
        purchaseDate: '2024-01-15',
        lastMaintenanceDate: '2024-08-30',
        nextMaintenanceDate: '2024-09-30',
        assignedTo: 'Automation Specialist John',
        notes: 'Automated pipetting system for high-throughput assays. Currently out of service due to software issues.',
        files: [
            {
                name: 'EVO100_Software_Manual.pdf',
                size: 12582912,
                type: 'application/pdf',
                uploadedAt: '2024-01-15T08:00:00Z'
            },
            {
                name: 'Troubleshooting_Guide.pdf',
                size: 1572864,
                type: 'application/pdf',
                uploadedAt: '2024-08-30T12:00:00Z'
            }
        ],
        maintenanceHistory: [
            {
                id: 'maint-007',
                type: 'corrective',
                description: 'Software update and calibration issues',
                performedBy: 'Tecan Support',
                performedDate: new Date('2024-08-30'),
                cost: 1200,
                notes: 'Software updated, pipette calibration in progress, awaiting parts',
                nextDueDate: new Date('2024-09-30'),
                status: 'scheduled',
                partsReplaced: [],
                downtime: 72
            }
        ]
    }
];

async function seedData() {
    try {
        console.log('🌱 Starting to seed tasks, experiments, protocols, enquiries, and equipment data...');

        // Clear existing data
        await Task.deleteMany({});
        await Experiment.deleteMany({});
        await Protocol.deleteMany({});
        await Enquiry.deleteMany({});
        await Equipment.deleteMany({});
        console.log('🗑️  Cleared existing tasks, experiments, protocols, enquiries, and equipment');

        // Create or find a dummy user for experiments
        let dummyUser = await User.findOne({ email: 'yogesh.talekar@swaraj.com' });
        if (!dummyUser) {
            dummyUser = await User.create({
                name: 'Lab Manager',
                email: 'dummy@labtasker.com',
                password: 'hashedpassword123', // In real app, this would be properly hashed
                roles: ['Admin', 'Lab Manager'],
                department: 'Research',
                status: 'Active'
            });
            console.log('👤 Created dummy user for experiments');
        }

        // Insert sample tasks
        const insertedTasks = await Task.insertMany(sampleTasks);
        console.log(`✅ Inserted ${insertedTasks.length} sample tasks`);

        // Update experiments with the dummy user ID
        const experimentsWithUser = sampleExperiments.map(exp => ({
            ...exp,
            createdBy: dummyUser._id
        }));

        // Insert sample experiments
        const insertedExperiments = await Experiment.insertMany(experimentsWithUser);
        console.log(`✅ Inserted ${insertedExperiments.length} sample experiments`);

        // Update protocols with the dummy user ID
        const protocolsWithUser = sampleProtocols.map(protocol => ({
            ...protocol,
            createdBy: dummyUser._id
        }));

        // Insert sample protocols
        const insertedProtocols = await Protocol.insertMany(protocolsWithUser);
        console.log(`✅ Inserted ${insertedProtocols.length} sample protocols`);

        // Insert sample enquiries
        const insertedEnquiries = await Enquiry.insertMany(sampleEnquiries);
        console.log(`✅ Inserted ${insertedEnquiries.length} sample enquiries`);

        // Insert sample equipment
        const insertedEquipment = await Equipment.insertMany(sampleEquipments);
        console.log(`✅ Inserted ${insertedEquipment.length} sample equipment`);

        console.log('🎉 Successfully seeded tasks, experiments, protocols, enquiries, and equipment data!');
        console.log('\n📊 Summary:');
        console.log(`   Tasks: ${insertedTasks.length}`);
        console.log(`   Experiments: ${insertedExperiments.length}`);
        console.log(`   Protocols: ${insertedProtocols.length}`);
        console.log(`   Enquiries: ${insertedEnquiries.length}`);
        console.log(`   Equipment: ${insertedEquipment.length}`);

        // Display some sample data
        console.log('\n📋 Sample Tasks:');
        insertedTasks.slice(0, 3).forEach(task => {
            console.log(`   - ${task.customId}: ${task.title} (${task.status})`);
        });

        console.log('\n🧪 Sample Experiments:');
        insertedExperiments.slice(0, 3).forEach(exp => {
            console.log(`   - ${exp.title} (${exp.status})`);
        });

        console.log('\n📋 Sample Protocols:');
        insertedProtocols.slice(0, 3).forEach(protocol => {
            console.log(`   - ${protocol.name} v${protocol.version} (${protocol.status})`);
        });

        console.log('\n📞 Sample Enquiries:');
        insertedEnquiries.slice(0, 3).forEach(enquiry => {
            console.log(`   - ${enquiry.subject} from ${enquiry.customerName} (${enquiry.status})`);
        });

        console.log('\n🔬 Sample Equipment:');
        insertedEquipment.slice(0, 3).forEach(equipment => {
            console.log(`   - ${equipment.id}: ${equipment.name} (${equipment.status})`);
        });

    } catch (error) {
        console.error('❌ Error seeding data:', error);
    } finally {
        mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
}

// Run the seeding function
seedData();