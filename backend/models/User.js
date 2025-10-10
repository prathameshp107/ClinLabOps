const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    roles: {
        type: [String],
        default: ['User'],
    },
    department: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Locked', 'Invited'],
        default: 'Active',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    lastLogin: {
        type: Date,
    },
    avatar: {
        type: String,
    },
    bio: {
        type: String,
        trim: true,
    },
    location: {
        type: String,
        trim: true,
    },
    tempPassword: {
        type: Boolean,
        default: false,
    },
    twoFactorEnabled: {
        type: Boolean,
        default: false,
    },
    isPowerUser: {
        type: Boolean,
        default: false,
    },
    preferences: {
        theme: {
            type: String,
            enum: ['light', 'dark', 'system'],
            default: 'system',
        },
        notifications: {
            email: { type: Boolean, default: true },
            push: { type: Boolean, default: true },
            sms: { type: Boolean, default: false },
        },
        language: {
            type: String,
            default: 'en',
        },
    },
}, { timestamps: true });

// Index for efficient queries
userSchema.index({ email: 1 });
userSchema.index({ status: 1 });
userSchema.index({ department: 1 });

// Update lastLogin on successful login
userSchema.methods.updateLastLogin = function () {
    this.lastLogin = new Date();
    return this.save();
};

module.exports = mongoose.model('User', userSchema); 