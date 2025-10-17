require('dotenv').config();
const mongoose = require('mongoose');
const Notification = require('../models/Notification');

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/labtasker';
mongoose.connect(mongoURI, {
});

const checkDeadlineNotifications = async () => {
    try {
        console.log('Checking for deadline notifications...');
        
        // Find notifications with deadline metadata
        const deadlineNotifications = await Notification.find({
            'metadata.deadlineType': { $exists: true }
        }).sort({ createdAt: -1 }).limit(10);
        
        console.log(`Found ${deadlineNotifications.length} deadline notifications:`);
        
        deadlineNotifications.forEach((notification, index) => {
            console.log(`${index + 1}. ${notification.title}: ${notification.message}`);
            console.log(`   Type: ${notification.type}, Category: ${notification.category}`);
            console.log(`   Recipient: ${notification.recipient}`);
            console.log(`   Metadata:`, notification.metadata);
            console.log('---');
        });
        
        // Count total deadline notifications
        const totalDeadlineNotifications = await Notification.countDocuments({
            'metadata.deadlineType': { $exists: true }
        });
        
        console.log(`Total deadline notifications in database: ${totalDeadlineNotifications}`);
        
        process.exit(0);
    } catch (error) {
        console.error('Check failed:', error);
        process.exit(1);
    }
};

checkDeadlineNotifications();