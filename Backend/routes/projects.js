const express = require('express');
const router = express.Router();
const { 
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addTeamMember,
  removeTeamMember,
  addProjectNote,
  getProjectStats
} = require('../controllers/projectController');
const { protect } = require('../middlewares/authMiddleware');

// All routes are protected and require authentication
router.route('/getAllProjects').get(protect, getProjects);

router.route('/')
  .post(protect, createProject)
  .get(protect, getProjects);

router.route('/stats')
  .get(protect, getProjectStats);

router.route('/:id')
  .get(protect, getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

router.route('/:id/team')
  .post(protect, addTeamMember);

router.route('/:id/team/:userId')
  .delete(protect, removeTeamMember);

router.route('/:id/notes')
  .post(protect, addProjectNote);

module.exports = router;