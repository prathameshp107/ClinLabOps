const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {
    logUserCreation,
    logUserUpdate,
    logUserDeletion,
    logPasswordReset,
    logUserStatusChange,
    logUserInvitation
} = require('../middleware/userActivityLogger');
const { protect, authorize } = require('../middleware/authMiddleware');

// Get all users
router.get('/', protect, userController.getAllUsers);

// Get user statistics
router.get('/stats', protect, userController.getUserStats);

// Get user by ID
router.get('/:id', protect, userController.getUserById);

// Get user activity logs
router.get('/:id/activity', protect, userController.getUserActivityLogs);

// Create new user
router.post('/', protect, logUserCreation, userController.createUser);

// Update user
router.put('/:id', protect, logUserUpdate, userController.updateUser);

// Delete user
router.delete('/:id', protect, logUserDeletion, userController.deleteUser);

// User status management
router.patch('/:id/activate', protect, logUserStatusChange('activate'), userController.activateUser);
router.patch('/:id/deactivate', protect, logUserStatusChange('deactivate'), userController.deactivateUser);
router.patch('/:id/lock', protect, logUserStatusChange('lock'), userController.lockUser);
router.patch('/:id/unlock', protect, logUserStatusChange('unlock'), userController.unlockUser);

// Password management
router.patch('/:id/reset-password', protect, logPasswordReset, userController.resetUserPassword);


// User invitation routes
router.post('/invite', protect, authorize('admin'), userController.inviteUser);
router.post('/accept-invitation', userController.acceptInvitation);

// Account confirmation routes
router.post('/send-confirmation', protect, userController.sendConfirmationEmail);
router.post('/confirm-email', userController.confirmEmail);

module.exports = router;