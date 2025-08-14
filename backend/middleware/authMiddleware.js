const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// Create default admin user if none exists
const createDefaultUser = async () => {
    try {
        const userCount = await User.countDocuments();
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
            console.log('Default admin user created: admin@labtasker.com / password123');
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
            next();
        } catch (error) {
            console.log('Token verification failed:', error.message);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        console.log('No authorization header found, allowing request for development');
        // For development, allow requests without authentication
        // In production, uncomment the line below
        // return res.status(401).json({ message: 'Not authorized, no token' });
        next();
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