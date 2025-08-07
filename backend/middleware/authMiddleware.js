const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = await User.findById(decoded.userId).select('-password');
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
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