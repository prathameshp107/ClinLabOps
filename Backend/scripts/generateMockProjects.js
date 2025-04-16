const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Project = require('../models/Project');
const User = require('../models/User');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Set a fallback MongoDB URI if environment variable is not set
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/labtasker';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected for project generation'))
  .catch(err => console.error('MongoDB connection error:', err));

// Project status options that match the enum in the model
const projectStatuses = ['pending', 'Draft', 'In Progress', 'On Hold', 'Completed', 'cancelled'];

// Project priority options
const priorityLevels = ['low', 'medium', 'high', 'urgent'];

// Department options
const departments = [
  'toxicology', 
  'pathology', 
  'bioanalysis', 
  'pharmacology', 
  'molecular_biology', 
  'histology', 
  'clinical_pathology'
];

// Generate a random date between start and end
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Generate a random project
const generateProject = async (users) => {
  if (users.length === 0) {
    throw new Error('No users found in the database. Please generate users first.');
  }
  
  // Select random team members
  const teamSize = faker.number.int({ min: 1, max: Math.min(5, users.length) });
  const teamMembers = faker.helpers.arrayElements(users, teamSize).map(user => user._id);
  
  // Select a project creator from users
  const createdBy = faker.helpers.arrayElement(users)._id;
  
  // Generate start and end dates
  const startDate = faker.date.past({ years: 1 });
  const endDate = randomDate(startDate, faker.date.future({ years: 1, refDate: startDate }));
  
  // Generate tags
  const tagCount = faker.number.int({ min: 1, max: 5 });
  const tags = Array.from({ length: tagCount }, () => faker.lorem.word());
  
  // Generate attachments
  const attachmentCount = faker.number.int({ min: 0, max: 3 });
  const attachments = Array.from({ length: attachmentCount }, () => ({
    name: `${faker.system.fileName()}.${faker.system.fileExt()}`,
    fileUrl: faker.image.url(),
    uploadedAt: faker.date.recent(),
    uploadedBy: faker.helpers.arrayElement(users)._id
  }));
  
  // Generate notes
  const noteCount = faker.number.int({ min: 0, max: 5 });
  const notes = Array.from({ length: noteCount }, () => ({
    content: faker.lorem.paragraph(),
    createdAt: faker.date.recent(),
    createdBy: faker.helpers.arrayElement(users)._id
  }));
  
  // Generate project
  return {
    title: faker.lorem.words({ min: 3, max: 6 }),
    description: faker.lorem.paragraphs(2),
    status: faker.helpers.arrayElement(projectStatuses),
    priority: faker.helpers.arrayElement(priorityLevels),
    startDate,
    endDate,
    createdBy, // Required field
    department: faker.helpers.arrayElement(departments),
    teamMembers,
    tags,
    budget: faker.number.int({ min: 5000, max: 500000 }), // Simple number, not an object
    progress: faker.number.int({ min: 0, max: 100 }),
    attachments,
    notes
  };
};

// Generate and save projects
const generateProjects = async (count) => {
  try {
    // Get all users from the database
    const users = await User.find({});
    
    if (users.length === 0) {
      throw new Error('No users found in the database. Please generate users first.');
    }
    
    for (let i = 0; i < count; i++) {
      const projectData = await generateProject(users);
      const project = new Project(projectData);
      await project.save();
      console.log(`Created project ${i+1}/${count}: ${projectData.title}`);
    }
    
    console.log(`Successfully generated ${count} projects`);
    mongoose.disconnect();
  } catch (error) {
    console.error('Error generating projects:', error);
    mongoose.disconnect();
  }
};

// Generate projects
const projectCount = process.argv[2] || 100;
generateProjects(parseInt(projectCount));