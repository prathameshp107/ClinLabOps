const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// Create default admin user if none exists
const createDefaultUser = async () => {
    try {
        const userCount = await User.countDocuments();
        console.log('Current user count in database:', userCount);
        if (userCount === 0) {
            console.log('No users found, creating default admin user...');
            const hashedPassword = await bcrypt.hash('password123', 10);
            const defaultUser = new User({
                name: 'Admin User',
                email: 'admin@labtasker.com',
                password: hashedPassword,
                roles: ['Admin', 'User'],
                department: 'Administration',
                status: 'Active'
            });
            await defaultUser.save();
            console.log('Default admin user created successfully:', defaultUser._id);
            console.log('Email: admin@labtasker.com / Password: password123');
        } else {
            console.log('Users exist in database, skipping default user creation');
            // Verify the admin user exists
            const adminUser = await User.findOne({ email: 'admin@labtasker.com' });
            if (adminUser) {
                console.log('Admin user found with ID:', adminUser._id);
            } else {
                console.log('Warning: Admin user not found in database!');
            }
        }
    } catch (error) {
        console.error('Error creating default user:', error);
    }
};

// Initialize default user
createDefaultUser();

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            console.log('Received token:', token.substring(0, 20) + '...');
            const decoded = jwt.verify(token, JWT_SECRET);
            console.log('Token decoded successfully for user:', decoded.userId);
            req.user = await User.findById(decoded.userId).select('-password');
            if (!req.user) {
                console.log('User not found for ID:', decoded.userId);
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }
            console.log('User authenticated:', req.user.email);
            return next();
        } catch (error) {
            console.log('Token verification failed:', error.message);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        console.log('No authorization header found, using default user for development');
        // For development, create a default user context
        try {
            const defaultUser = await User.findOne({ email: 'admin@labtasker.com' });
            if (defaultUser) {
                req.user = defaultUser;
                console.log('Using default user:', defaultUser.email, 'ID:', defaultUser._id);
                return next();
            } else {
                console.log('Default user not found, cannot proceed');
                return res.status(401).json({ message: 'Not authorized, no authentication provided' });
            }
        } catch (error) {
            console.error('Error finding default user:', error);
            return res.status(500).json({ message: 'Internal server error during authentication' });
        }
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.some(role => req.user.roles.includes(role))) {
            return res.status(403).json({ message: 'User role not authorized' });
        }
        next();
    };
}; 