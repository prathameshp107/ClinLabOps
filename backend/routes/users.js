const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

// Get all users
router.get('/', userController.getAllUsers);

// Get user statistics
router.get('/stats', userController.getUserStats);

// Get user by ID
router.get('/:id', userController.getUserById);

// Get user activity logs
router.get('/:id/activity', userController.getUserActivityLogs);

// Create new user
router.post('/', userController.createUser);

// Update user
router.put('/:id', userController.updateUser);

// Delete user
router.delete('/:id', userController.deleteUser);

// User status management
router.patch('/:id/activate', userController.activateUser);
router.patch('/:id/deactivate', userController.deactivateUser);
router.patch('/:id/lock', userController.lockUser);
router.patch('/:id/unlock', userController.unlockUser);

// Password management
router.patch('/:id/reset-password', userController.resetUserPassword);

// Invite user
router.post('/invite', userController.inviteUser);

module.exports = router;