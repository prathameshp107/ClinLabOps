require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');
const Project = require('../models/Project');

// Import the dummy data
const { allProjects } = require('../data/dummy-project-data.js');

// MongoDB connection string - uses environment variable
const MONGODB_URI = process.env.MONGODB_URI;

async function seedProjectData() {
    try {
        // Connect to MongoDB
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB successfully!');

        // Clear existing project data
        console.log('🧹 Clearing existing project data...');
        await Project.deleteMany({});
        console.log('✅ Existing project data cleared.');

        // Insert all projects
        console.log('📝 Inserting 5 laboratory projects...');
        const insertedProjects = await Project.insertMany(allProjects);
        console.log(`✅ Successfully inserted ${insertedProjects.length} projects!`);

        // Display summary of all projects
        console.log('\n📊 Projects Summary:');
        for (const project of insertedProjects) {
            console.log(`\n🔬 ${project.name} (${project.projectCode})`);
            console.log(`   Status: ${project.status} | Progress: ${project.progress}% | Priority: ${project.priority}`);
            console.log(`   Budget: ${project.budget} | Department: ${project.department}`);
            console.log(`   Team: ${project.team.length} members | Tasks: ${project.tasks.length} | Documents: ${project.documents.length}`);
            console.log(`   Start: ${project.startDate} | End: ${project.endDate}`);
        }

        // Overall statistics
        const totalTeamMembers = insertedProjects.reduce((sum, p) => sum + p.team.length, 0);
        const totalTasks = insertedProjects.reduce((sum, p) => sum + p.tasks.length, 0);
        const totalDocuments = insertedProjects.reduce((sum, p) => sum + p.documents.length, 0);
        const totalMilestones = insertedProjects.reduce((sum, p) => sum + p.milestones.length, 0);
        const totalBudget = insertedProjects.reduce((sum, p) => sum + parseFloat(p.budget.replace(/[$,]/g, '')), 0);

        console.log('\n📈 Overall Statistics:');
        console.log(`   Total Projects: ${insertedProjects.length}`);
        console.log(`   Total Team Members: ${totalTeamMembers}`);
        console.log(`   Total Tasks: ${totalTasks}`);
        console.log(`   Total Documents: ${totalDocuments}`);
        console.log(`   Total Milestones: ${totalMilestones}`);
        console.log(`   Combined Budget: $${totalBudget.toLocaleString()}`);

        console.log('\n🏢 Departments Covered:');
        const departments = [...new Set(insertedProjects.map(p => p.department))];
        departments.forEach(dept => console.log(`   • ${dept}`));

        console.log('\n🏷️  Project Types:');
        insertedProjects.forEach(p => {
            console.log(`   • ${p.name}: ${p.tags.slice(0, 3).join(', ')}${p.tags.length > 3 ? '...' : ''}`);
        });

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