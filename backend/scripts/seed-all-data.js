require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Import models
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Experiment = require('../models/Experiment');
const Equipment = require('../models/Equipment');
const Protocol = require('../models/Protocol');
const Enquiry = require('../models/Enquiry');
const { InventoryItem, Supplier, Warehouse, Order } = require('../models/Inventory');
const { ComplianceItem, Audit, TrainingRecord } = require('../models/Compliance');
const Notification = require('../models/Notification');

// Connect to MongoDB
// Connect to MongoDB
if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is required');
    process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Sample data
// Load seeding configuration
const seedConfig = require('../config/seed-config');

const sampleUsers = [
    seedConfig.testUsers.admin,
    {
        name: 'Jane Scientist',
        email: seedConfig.testUsers.scientist.email,
        password: seedConfig.testUsers.scientist.password,
        roles: ['Scientist', 'User'],
        department: 'Research',
        status: 'Active',
        phone: '+1-555-0102'
    },
    seedConfig.testUsers.technician,
    seedConfig.testUsers.reviewer
];

const sampleInventoryItems = [
    {
        name: 'Sodium Chloride',
        category: 'Chemicals',
        type: 'Reagent',
        currentStock: 500,
        minStock: 100,
        maxStock: 1000,
        unit: 'g',
        location: 'Chemical Storage A',
        supplier: 'ChemCorp',
        cost: 25.50,
        expiryDate: new Date('2025-12-31'),
        batchNumber: 'NaCl-2024-001',
        status: 'In Stock'
    },
    {
        name: 'Petri Dishes',
        category: 'Consumables',
        type: 'Labware',
        currentStock: 200,
        minStock: 50,
        maxStock: 500,
        unit: 'pieces',
        location: 'Storage Room B',
        supplier: 'LabSupply Inc',
        cost: 0.75,
        status: 'In Stock'
    },
    {
        name: 'pH Buffer Solution',
        category: 'Chemicals',
        type: 'Buffer',
        currentStock: 25,
        minStock: 50,
        maxStock: 200,
        unit: 'ml',
        location: 'Chemical Storage A',
        supplier: 'ChemCorp',
        cost: 15.00,
        expiryDate: new Date('2024-06-30'),
        batchNumber: 'pH-2024-002',
        status: 'Low Stock'
    }
];

const sampleSuppliers = [
    {
        name: 'ChemCorp',
        contactPerson: 'Michael Chen',
        email: 'orders@chemcorp.com',
        phone: '+1-800-CHEM-001',
        address: '123 Chemical Ave, Science City, SC 12345',
        rating: 4,
        status: 'Active',
        paymentTerms: 'Net 30',
        deliveryTime: '3-5 business days'
    },
    {
        name: 'LabSupply Inc',
        contactPerson: 'Sarah Johnson',
        email: 'sales@labsupply.com',
        phone: '+1-800-LAB-SUPP',
        address: '456 Laboratory Blvd, Research Town, RT 67890',
        rating: 5,
        status: 'Active',
        paymentTerms: 'Net 15',
        deliveryTime: '1-3 business days'
    }
];

const sampleWarehouses = [
    {
        name: 'Main Storage',
        location: 'Building A, Floor 1',
        capacity: 1000,
        currentUtilization: 65,
        manager: 'Storage Manager',
        contact: seedConfig.storage.managerEmail,
        status: 'Active',
        temperature: '20-25°C',
        humidity: '40-60%',
        securityLevel: 'Medium'
    },
    {
        name: 'Chemical Storage',
        location: 'Building B, Floor 2',
        capacity: 500,
        currentUtilization: 80,
        manager: 'Chemical Safety Officer',
        contact: config.development?.storage?.chemicalManagerEmail || 'chemical@labtasker.com',
        status: 'Active',
        temperature: '18-22°C',
        humidity: '30-50%',
        securityLevel: 'High'
    }
];

const sampleComplianceItems = [
    {
        title: 'Annual Safety Training',
        description: 'Mandatory safety training for all laboratory personnel',
        category: 'Safety',
        priority: 'High',
        status: 'Action Required',
        dueDate: new Date('2024-12-31'),
        department: 'All Departments',
        regulatoryBody: 'OSHA',
        requirements: ['Complete 8-hour safety course', 'Pass safety exam', 'Submit certificate'],
        riskLevel: 'High',
        reviewFrequency: 'Annual',
        tags: ['training', 'safety', 'mandatory']
    },
    {
        title: 'Equipment Calibration Records',
        description: 'Maintain calibration records for all precision instruments',
        category: 'Quality',
        priority: 'Medium',
        status: 'Compliant',
        dueDate: new Date('2024-06-30'),
        department: 'Laboratory',
        regulatoryBody: 'ISO 17025',
        requirements: ['Monthly calibration checks', 'Annual professional calibration', 'Maintain records'],
        riskLevel: 'Medium',
        reviewFrequency: 'Quarterly',
        tags: ['calibration', 'quality', 'iso']
    }
];

const sampleAudits = [
    {
        title: 'Q1 2024 Internal Audit',
        description: 'Quarterly internal audit of laboratory procedures',
        type: 'Internal',
        status: 'Completed',
        auditor: 'Internal Audit Team',
        auditDate: new Date('2024-03-15'),
        completedDate: new Date('2024-03-20'),
        scope: 'Laboratory procedures and documentation',
        department: 'Laboratory',
        overallRating: 'Good',
        findings: [
            {
                title: 'Documentation Gap',
                description: 'Some procedures lack proper documentation',
                severity: 'Medium',
                category: 'Documentation',
                recommendation: 'Update procedure documentation',
                status: 'Resolved',
                resolvedDate: new Date('2024-04-01')
            }
        ]
    }
];

const sampleTrainingRecords = [
    {
        title: 'Laboratory Safety Fundamentals',
        description: 'Basic safety training for new laboratory personnel',
        category: 'Safety',
        mandatory: true,
        duration: 8,
        validityPeriod: 12,
        instructor: 'Safety Officer',
        trainingDate: new Date('2024-01-15'),
        expiryDate: new Date('2025-01-15'),
        attendees: []
    }
];

async function seedDatabase() {
    try {
        console.log('Starting database seeding...');

        // Clear existing data
        await Promise.all([
            User.deleteMany({}),
            Project.deleteMany({}),
            Task.deleteMany({}),
            Experiment.deleteMany({}),
            Equipment.deleteMany({}),
            Protocol.deleteMany({}),
            Enquiry.deleteMany({}),
            InventoryItem.deleteMany({}),
            Supplier.deleteMany({}),
            Warehouse.deleteMany({}),
            Order.deleteMany({}),
            ComplianceItem.deleteMany({}),
            Audit.deleteMany({}),
            TrainingRecord.deleteMany({}),
            Notification.deleteMany({})
        ]);

        console.log('Cleared existing data');

        // Hash passwords for users
        const hashedUsers = await Promise.all(
            sampleUsers.map(async (user) => ({
                ...user,
                password: await bcrypt.hash(user.password, 10)
            }))
        );

        // Create users
        const createdUsers = await User.insertMany(hashedUsers);
        console.log(`Created ${createdUsers.length} users`);

        // Create suppliers
        const createdSuppliers = await Supplier.insertMany(sampleSuppliers);
        console.log(`Created ${createdSuppliers.length} suppliers`);

        // Create warehouses
        const createdWarehouses = await Warehouse.insertMany(sampleWarehouses);
        console.log(`Created ${createdWarehouses.length} warehouses`);

        // Create inventory items
        const createdInventoryItems = await InventoryItem.insertMany(sampleInventoryItems);
        console.log(`Created ${createdInventoryItems.length} inventory items`);

        // Create compliance items with user references
        const complianceItemsWithUsers = sampleComplianceItems.map(item => ({
            ...item,
            createdBy: createdUsers[0]._id,
            assignedTo: createdUsers[1]._id
        }));
        const createdComplianceItems = await ComplianceItem.insertMany(complianceItemsWithUsers);
        console.log(`Created ${createdComplianceItems.length} compliance items`);

        // Create audits with user references
        const auditsWithUsers = sampleAudits.map(audit => ({
            ...audit,
            createdBy: createdUsers[0]._id
        }));
        const createdAudits = await Audit.insertMany(auditsWithUsers);
        console.log(`Created ${createdAudits.length} audits`);

        // Create training records with user references
        const trainingWithUsers = sampleTrainingRecords.map(training => ({
            ...training,
            createdBy: createdUsers[0]._id,
            attendees: createdUsers.slice(1).map(user => ({
                user: user._id,
                status: 'Completed',
                score: Math.floor(Math.random() * 20) + 80, // Random score between 80-100
                completedAt: new Date()
            }))
        }));
        const createdTrainingRecords = await TrainingRecord.insertMany(trainingWithUsers);
        console.log(`Created ${createdTrainingRecords.length} training records`);

        // Create sample notifications
        const sampleNotifications = [
            {
                title: 'Welcome to LabTasker',
                message: 'Welcome to the LabTasker system! Please complete your profile setup.',
                type: 'info',
                priority: 'medium',
                recipient: createdUsers[1]._id,
                sender: createdUsers[0]._id,
                category: 'system'
            },
            {
                title: 'Low Stock Alert',
                message: 'pH Buffer Solution is running low. Current stock: 25ml',
                type: 'warning',
                priority: 'medium',
                recipient: createdUsers[2]._id,
                category: 'inventory',
                relatedEntity: {
                    entityType: 'InventoryItem',
                    entityId: createdInventoryItems[2]._id
                }
            }
        ];
        const createdNotifications = await Notification.insertMany(sampleNotifications);
        console.log(`Created ${createdNotifications.length} notifications`);

        console.log('Database seeding completed successfully!');
        console.log('\nSample login credentials:');
        console.log(`Admin: ${config.development?.testUsers?.admin?.email || 'admin@labtasker.com'} / ${config.development?.testUsers?.admin?.password || 'password123'}`);
        console.log(`Scientist: ${config.development?.testUsers?.scientist?.email || 'scientist@labtasker.com'} / ${config.development?.testUsers?.scientist?.password || 'password123'}`);
        console.log(`Technician: ${config.development?.testUsers?.technician?.email || 'technician@labtasker.com'} / ${config.development?.testUsers?.technician?.password || 'password123'}`);
        console.log(`Reviewer: ${config.development?.testUsers?.reviewer?.email || 'reviewer@labtasker.com'} / ${config.development?.testUsers?.reviewer?.password || 'password123'}`);

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        mongoose.connection.close();
    }
}

// Run the seeding
seedDatabase();