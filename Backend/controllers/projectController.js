const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      startDate,
      endDate,
      department,
      teamMembers,
      tags,
      budget
    } = req.body;

    // Create new project with the user as creator
    const project = await Project.create({
      title,
      description,
      status,
      priority,
      startDate,
      endDate,
      createdBy: req.user._id,
      department,
      teamMembers: teamMembers || [],
      tags: tags || [],
      budget: budget || 0
    });

    // Populate creator and team members
    const populatedProject = await Project.findById(project._id)
      .populate('createdBy', 'fullName email')
      .populate('teamMembers', 'fullName email role');

    res.status(201).json(populatedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    // Get all projects and populate references
    const projects = await Project.find()
      .populate('createdBy', 'fullName email')
      .populate('teamMembers', 'fullName email role')
      .sort({ updatedAt: -1 });

    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'fullName email')
      .populate('teamMembers', 'fullName email role department')
      .populate({
        path: 'notes',
        populate: {
          path: 'createdBy',
          select: 'fullName email'
        }
      })
      .populate({
        path: 'attachments',
        populate: {
          path: 'uploadedBy',
          select: 'fullName email'
        }
      });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user has access to this project
    const isTeamMember = project.teamMembers.some(member =>
      member._id.toString() === req.user._id.toString()
    );
    const isCreator = project.createdBy._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isTeamMember && !isCreator && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }

    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is authorized to update the project
    const isCreator = project.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCreator && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    // Update project fields
    const {
      title,
      description,
      status,
      priority,
      startDate,
      endDate,
      department,
      teamMembers,
      tags,
      budget,
      progress
    } = req.body;

    if (title) project.title = title;
    if (description) project.description = description;
    if (status) project.status = status;
    if (priority) project.priority = priority;
    if (startDate) project.startDate = startDate;
    if (endDate) project.endDate = endDate;
    if (department) project.department = department;
    if (teamMembers) project.teamMembers = teamMembers;
    if (tags) project.tags = tags;
    if (budget !== undefined) project.budget = budget;
    if (progress !== undefined) project.progress = progress;

    const updatedProject = await project.save();

    // Populate references before sending response
    const populatedProject = await Project.findById(updatedProject._id)
      .populate('createdBy', 'fullName email')
      .populate('teamMembers', 'fullName email role');

    res.json(populatedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is authorized to delete the project
    const isCreator = project.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCreator && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    await project.deleteOne();
    res.json({ message: 'Project removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add team member to project
// @route   POST /api/projects/:id/team
// @access  Private
const addTeamMember = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is authorized to add team members
    const isCreator = project.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCreator && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to modify this project' });
    }

    // Check if user is already a team member
    if (project.teamMembers.includes(userId)) {
      return res.status(400).json({ message: 'User is already a team member' });
    }

    // Add user to team members
    project.teamMembers.push(userId);
    await project.save();

    // Populate team members before sending response
    const updatedProject = await Project.findById(project._id)
      .populate('createdBy', 'fullName email')
      .populate('teamMembers', 'fullName email role');

    res.json(updatedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Remove team member from project
// @route   DELETE /api/projects/:id/team/:userId
// @access  Private
const removeTeamMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is authorized to remove team members
    const isCreator = project.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCreator && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to modify this project' });
    }

    // Remove user from team members
    project.teamMembers = project.teamMembers.filter(
      member => member.toString() !== req.params.userId
    );

    await project.save();

    // Populate team members before sending response
    const updatedProject = await Project.findById(project._id)
      .populate('createdBy', 'fullName email')
      .populate('teamMembers', 'fullName email role');

    res.json(updatedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add note to project
// @route   POST /api/projects/:id/notes
// @access  Private
const addProjectNote = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Note content is required' });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user has access to this project
    const isTeamMember = project.teamMembers.some(member =>
      member.toString() === req.user._id.toString()
    );
    const isCreator = project.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isTeamMember && !isCreator && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to modify this project' });
    }

    // Add note
    project.notes.push({
      content,
      createdBy: req.user._id
    });

    await project.save();

    // Get the newly added note
    const newNote = project.notes[project.notes.length - 1];

    // Populate the note creator
    const populatedProject = await Project.findById(project._id)
      .populate({
        path: 'notes',
        populate: {
          path: 'createdBy',
          select: 'fullName email'
        }
      });

    const populatedNote = populatedProject.notes.id(newNote._id);

    res.status(201).json(populatedNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get project statistics
// @route   GET /api/projects/stats
// @access  Private
const getProjectStats = async (req, res) => {
  try {
    // Get counts by status
    const statusCounts = await Project.aggregate([
      {
        $match: req.user.role !== 'admin'
          ? {
            $or: [
              { createdBy: req.user._id },
              { teamMembers: req.user._id }
            ]
          }
          : {}
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get counts by priority
    const priorityCounts = await Project.aggregate([
      {
        $match: req.user.role !== 'admin'
          ? {
            $or: [
              { createdBy: req.user._id },
              { teamMembers: req.user._id }
            ]
          }
          : {}
      },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get counts by department
    const departmentCounts = await Project.aggregate([
      {
        $match: req.user.role !== 'admin'
          ? {
            $or: [
              { createdBy: req.user._id },
              { teamMembers: req.user._id }
            ]
          }
          : {}
      },
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get total projects count
    const totalProjects = await Project.countDocuments(
      req.user.role !== 'admin'
        ? {
          $or: [
            { createdBy: req.user._id },
            { teamMembers: req.user._id }
          ]
        }
        : {}
    );

    // Get recently updated projects
    const recentProjects = await Project.find(
      req.user.role !== 'admin'
        ? {
          $or: [
            { createdBy: req.user._id },
            { teamMembers: req.user._id }
          ]
        }
        : {}
    )
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate('createdBy', 'fullName')
      .select('title status priority progress updatedAt');

    res.json({
      totalProjects,
      statusCounts,
      priorityCounts,
      departmentCounts,
      recentProjects
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addTeamMember,
  removeTeamMember,
  addProjectNote,
  getProjectStats
};