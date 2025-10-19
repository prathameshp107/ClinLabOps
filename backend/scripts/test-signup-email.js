require('dotenv').config();
const emailService = require('../services/emailService');
const config = require('../config/config');

async function testSignupEmail() {
    try {
        console.log('Testing signup/welcome email...');

        // Initialize email service
        await emailService.initialize(config.email);

        console.log('Email service initialized successfully');

        // Send welcome email
        await emailService.sendWelcomeEmail({
            name: 'Test User',
            email: testEmail,
            data: {
                appName: process.env.APP_NAME
            }
        });

        console.log('✅ Welcome email sent successfully');
    } catch (error) {
        console.error('❌ Failed to send welcome email:', error.message);
        process.exit(1);
    }
}

testSignupEmail();