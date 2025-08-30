const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

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
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
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