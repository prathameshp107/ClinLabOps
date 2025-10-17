require('dotenv').config();
const emailService = require('../services/emailService');
const config = require('../config/config');

async function testSignupEmail() {
    try {
        console.log('Testing signup/welcome email...');

        // Initialize email service
        await emailService.initialize(config.email);

        console.log('Email service initialized successfully');

        // Send a welcome email (simulating user signup)
        console.log('Sending welcome email to prathameshp1209@gmail.com...');
        await emailService.sendNotification({
            to: 'prathameshp1209@gmail.com',
            subject: 'Welcome to LabTasker!',
            template: 'notification',
            data: {
                userName: 'Test User',
                subject: 'Welcome to LabTasker!',
                message: 'Thank you for registering with LabTasker. Your account has been successfully created.',
                appName: process.env.APP_NAME || 'LabTasker'
            },
            priority: 'normal'
        });

        console.log('✅ Welcome email sent successfully!');
        console.log('Please check your inbox at prathameshp1209@gmail.com');

        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to send welcome email:', error.message);
        process.exit(1);
    }
}

testSignupEmail();