const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const {
    logUserCreation,
    logUserUpdate,
    logUserDeletion,
    logPasswordReset,
    logUserStatusChange,
    logUserInvitation
} = require('../middleware/userActivityLogger');

// Get all users
router.get('/', auth.protect, userController.getAllUsers);

// Get user statistics
router.get('/stats', auth.protect, userController.getUserStats);

// Get user by ID
router.get('/:id', auth.protect, userController.getUserById);

// Get user activity logs
router.get('/:id/activity', auth.protect, userController.getUserActivityLogs);

// Create new user
router.post('/', auth.protect, logUserCreation, userController.createUser);

// Update user
router.put('/:id', auth.protect, logUserUpdate, userController.updateUser);

// Delete user
router.delete('/:id', auth.protect, logUserDeletion, userController.deleteUser);

// User status management
router.patch('/:id/activate', auth.protect, logUserStatusChange('activate'), userController.activateUser);
router.patch('/:id/deactivate', auth.protect, logUserStatusChange('deactivate'), userController.deactivateUser);
router.patch('/:id/lock', auth.protect, logUserStatusChange('lock'), userController.lockUser);
router.patch('/:id/unlock', auth.protect, logUserStatusChange('unlock'), userController.unlockUser);

// Password management
router.patch('/:id/reset-password', auth.protect, logPasswordReset, userController.resetUserPassword);

// Invite user
router.post('/invite', auth.protect, logUserInvitation, userController.inviteUser);

module.exports = router;