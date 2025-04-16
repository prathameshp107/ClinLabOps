const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');
const User = require('../models/User');

const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Set a fallback MongoDB URI if environment variable is not set
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/labtasker';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected for user generation'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define departments and roles that match the User model enums
const departments = [
  'toxicology', 
  'pathology', 
  'bioanalysis', 
  'pharmacology', 
  'molecular_biology', 
  'histology', 
  'clinical_pathology'
];

const roles = [
  'admin', 
  'user', 
  'manager', 
  'researcher', 
  'lab_technician'
];

// Function to generate a random user
const generateUser = async () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName, provider: 'labmail.com' });

  return {
    fullName: `${firstName} ${lastName}`,
    email,
    password: 'Password123', // Will be hashed by the User model pre-save hook
    role: faker.helpers.arrayElement(roles),
    department: faker.helpers.arrayElement(departments),
    profileImage: faker.image.avatar(),
    isActive: true,
    lastLogin: faker.date.recent()
  };
};

// Generate and save users
const generateUsers = async (count) => {
  try {
    // Create admin user
    const adminUser = new User({
      fullName: 'Admin User',
      email: 'admin@labmail.com',
      password: 'Admin123', // Will be hashed by the User model pre-save hook
      role: 'admin', // Using 'admin' which is in the allowed enum values
      department: 'toxicology', // Using a valid department from the enum
      isActive: true,
      lastLogin: new Date()
    });

    await adminUser.save();
    console.log('Admin user created');
    
    // Generate random users
    for (let i = 0; i < count; i++) {
      const userData = await generateUser();
      const user = new User(userData);
      
      await user.save();
      console.log(`Created user ${i + 1}/${count}: ${userData.fullName}`);
    }
    
    console.log(`Successfully generated ${count} users`);
    mongoose.disconnect();
  } catch (error) {
    console.error('Error generating users:', error);
    mongoose.disconnect();
  }
};

// Generate 20 users
const userCount = process.argv[2] || 100;
generateUsers(parseInt(userCount));