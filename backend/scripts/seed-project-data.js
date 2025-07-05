const mongoose = require('mongoose');
const Project = require('../models/Project');

// Import the dummy data
const { dummyProjectData } = require('../data/dummy-project-data.js');

// MongoDB connection string - update this with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/labtasker';

async function seedProjectData() {
    try {
        // Connect to MongoDB
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB successfully!');

        // Check if project already exists
        const existingProject = await Project.findOne({ projectCode: dummyProjectData.projectCode });

        if (existingProject) {
            console.log('⚠️  Project with this code already exists. Updating...');
            await Project.findOneAndUpdate(
                { projectCode: dummyProjectData.projectCode },
                dummyProjectData,
                { new: true, runValidators: true }
            );
            console.log('✅ Project data updated successfully!');
        } else {
            // Clear existing project data (optional - remove if you want to keep existing data)
            console.log('🧹 Clearing existing project data...');
            await Project.deleteMany({});
            console.log('✅ Existing project data cleared.');

            // Create the project document
            console.log('📝 Inserting dummy project data...');
            const project = new Project(dummyProjectData);
            await project.save();

            console.log('✅ Dummy project data inserted successfully!');
        }

        // Fetch the project to display details
        const project = await Project.findOne({ projectCode: dummyProjectData.projectCode });

        console.log('\n📊 Project Details:');
        console.log(`   Project ID: ${project._id}`);
        console.log(`   Project Code: ${project.projectCode}`);
        console.log(`   Project Name: ${project.name}`);
        console.log(`   Status: ${project.status}`);
        console.log(`   Progress: ${project.progress}%`);
        console.log(`   Budget: ${project.budget}`);
        console.log(`   Start Date: ${project.startDate}`);
        console.log(`   End Date: ${project.endDate}`);

        console.log('\n👥 Team Information:');
        console.log(`   Total Team Members: ${project.team.length}`);
        console.log(`   Online Members: ${project.team.filter(m => m.status === 'online').length}`);
        console.log(`   Away Members: ${project.team.filter(m => m.status === 'away').length}`);
        console.log(`   Busy Members: ${project.team.filter(m => m.status === 'busy').length}`);

        console.log('\n📋 Task Information:');
        console.log(`   Total Tasks: ${project.tasks.length}`);
        console.log(`   Completed Tasks: ${project.tasks.filter(t => t.status === 'Completed').length}`);
        console.log(`   In Progress Tasks: ${project.tasks.filter(t => t.status === 'In Progress').length}`);
        console.log(`   Not Started Tasks: ${project.tasks.filter(t => t.status === 'Not Started').length}`);

        console.log('\n📄 Document Information:');
        console.log(`   Total Documents: ${project.documents.length}`);
        console.log(`   Active Documents: ${project.documents.filter(d => d.status === 'active').length}`);
        console.log(`   Under Review: ${project.documents.filter(d => d.status === 'review').length}`);
        console.log(`   Archived: ${project.documents.filter(d => d.status === 'archived').length}`);

        console.log('\n🎯 Milestone Information:');
        console.log(`   Total Milestones: ${project.milestones.length}`);
        console.log(`   Completed Milestones: ${project.milestones.filter(m => m.status === 'Completed').length}`);
        console.log(`   In Progress Milestones: ${project.milestones.filter(m => m.status === 'In Progress').length}`);
        console.log(`   Not Started Milestones: ${project.milestones.filter(m => m.status === 'Not Started').length}`);

        console.log('\n🔗 Dependencies:');
        console.log(`   Total Dependencies: ${project.dependencies.length}`);

        console.log('\n📝 Activity Logs:');
        console.log(`   Total Activity Logs: ${project.activityLog.length}`);

        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB.');
        console.log('\n🎉 Seeding completed successfully!');

    } catch (error) {
        console.error('❌ Error seeding project data:', error);

        // Provide helpful error messages
        if (error.name === 'ValidationError') {
            console.error('📝 Validation errors:');
            Object.keys(error.errors).forEach(key => {
                console.error(`   ${key}: ${error.errors[key].message}`);
            });
        } else if (error.name === 'MongoServerError') {
            console.error('🗄️  MongoDB error:', error.message);
        } else {
            console.error('💥 Unexpected error:', error.message);
        }

        process.exit(1);
    }
}

// Handle process termination
process.on('SIGINT', async () => {
    console.log('\n🛑 Received SIGINT. Disconnecting from MongoDB...');
    await mongoose.disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Received SIGTERM. Disconnecting from MongoDB...');
    await mongoose.disconnect();
    process.exit(0);
});

// Run the seeding function
console.log('🚀 Starting project data seeding...\n');
seedProjectData(); 