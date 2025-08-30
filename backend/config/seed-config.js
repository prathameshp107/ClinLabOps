require('dotenv').config();

/**
 * Seeding Configuration
 * This file contains configuration specifically for seeding/testing purposes.
 * It should NOT be used in production environments.
 */

if (process.env.NODE_ENV === 'production') {
    console.error('❌ Seeding configuration should not be loaded in production!');
    process.exit(1);
}

const seedConfig = {
    // Test User Configuration (for seeding only)
    testUsers: {
        admin: {
            name: 'John Admin',
            email: process.env.TEST_ADMIN_EMAIL || 'admin@labtasker.com',
            password: process.env.TEST_USER_PASSWORD || 'password123',
            roles: ['Admin', 'User'],
            department: 'Administration',
            status: 'Active',
            phone: '+1-555-0101'
        },
        scientist: {
            name: 'Jane Scientist',
            email: process.env.TEST_SCIENTIST_EMAIL || 'scientist@labtasker.com',
            password: process.env.TEST_USER_PASSWORD || 'password123',
            roles: ['Scientist', 'User'],
            department: 'Research',
            status: 'Active',
            phone: '+1-555-0102'
        },
        technician: {
            name: 'Bob Technician',
            email: process.env.TEST_TECHNICIAN_EMAIL || 'technician@labtasker.com',
            password: process.env.TEST_USER_PASSWORD || 'password123',
            roles: ['Technician', 'User'],
            department: 'Laboratory',
            status: 'Active',
            phone: '+1-555-0103'
        },
        reviewer: {
            name: 'Alice Reviewer',
            email: process.env.TEST_REVIEWER_EMAIL || 'reviewer@labtasker.com',
            password: process.env.TEST_USER_PASSWORD || 'password123',
            roles: ['Reviewer', 'User'],
            department: 'Quality Assurance',
            status: 'Active',
            phone: '+1-555-0104'
        }
    },

    // Storage Configuration (for seeding only)
    storage: {
        managerEmail: process.env.STORAGE_MANAGER_EMAIL || 'storage@labtasker.com',
        chemicalManagerEmail: process.env.CHEMICAL_MANAGER_EMAIL || 'chemical@labtasker.com'
    }
};

module.exports = seedConfig;