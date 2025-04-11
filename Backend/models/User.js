const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: ['researcher', 'lab_technician', 'manager', 'pathologist', 'toxicologist', 'admin']
  },
  department: {
    type: String,
    enum: ['toxicology', 'pathology', 'bioanalysis', 'pharmacology', 'molecular_biology', 'histology', 'clinical_pathology', ''],
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },

  // Email verification fields
  verificationToken: String,

  verificationExpires: Date,
  isVerified: {
    type: Boolean,
    default: false
  },

  // Password reset fields
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;