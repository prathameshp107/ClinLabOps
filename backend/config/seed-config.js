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

// Validate required seeding environment variables
const requiredSeedEnvVars = [
    'TEST_ADMIN_EMAIL',
    'TEST_SCIENTIST_EMAIL',
    'TEST_TECHNICIAN_EMAIL',
    'TEST_REVIEWER_EMAIL',
    'TEST_USER_PASSWORD',
    'STORAGE_MANAGER_EMAIL',
    'CHEMICAL_MANAGER_EMAIL'
];

const missingSeedEnvVars = requiredSeedEnvVars.filter(envVar => !process.env[envVar]);

if (missingSeedEnvVars.length > 0) {
    console.error('❌ Missing required seeding environment variables:', missingSeedEnvVars.join(', '));
    console.error('Please check your .env file and ensure all seeding variables are set.');
    process.exit(1);
}

const seedConfig = {
    // Test User Configuration (for seeding only)
    testUsers: {
        admin: {
            name: 'John Admin',
            email: process.env.TEST_ADMIN_EMAIL,
            password: process.env.TEST_USER_PASSWORD,
            roles: ['Admin', 'User'],
            department: 'Administration',
            status: 'Active',
            phone: '+1-555-0101'
        },
        scientist: {
            name: 'Jane Scientist',
            email: process.env.TEST_SCIENTIST_EMAIL,
            password: process.env.TEST_USER_PASSWORD,
            roles: ['Scientist', 'User'],
            department: 'Research',
            status: 'Active',
            phone: '+1-555-0102'
        },
        technician: {
            name: 'Bob Technician',
            email: process.env.TEST_TECHNICIAN_EMAIL,
            password: process.env.TEST_USER_PASSWORD,
            roles: ['Technician', 'User'],
            department: 'Laboratory',
            status: 'Active',
            phone: '+1-555-0103'
        },
        reviewer: {
            name: 'Alice Reviewer',
            email: process.env.TEST_REVIEWER_EMAIL,
            password: process.env.TEST_USER_PASSWORD,
            roles: ['Reviewer', 'User'],
            department: 'Quality Assurance',
            status: 'Active',
            phone: '+1-555-0104'
        }
    },

    // Storage Configuration (for seeding only)
    storage: {
        managerEmail: process.env.STORAGE_MANAGER_EMAIL,
        chemicalManagerEmail: process.env.CHEMICAL_MANAGER_EMAIL
    }
};

module.exports = seedConfig;