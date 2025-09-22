const Experiment = require('../models/Experiment');
const { validationResult } = require('express-validator');
const { Parser } = require('json2csv');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const stream = require('stream');
const ActivityService = require('../services/activityService');

/**
 * @desc    Get all experiments with optional filtering and sorting
 * @route   GET /api/experiments
 * @access  Private
 */
exports.getExperiments = async (req, res) => {
  try {
    const { status, search, sortBy = 'updatedAt', sortOrder = 'desc' } = req.query;

    // Build query object
    const query = {};
    if (req.user) {
      query.createdBy = req.user._id || req.user.id;
    }

    // Add status filter if provided
    if (status) {
      query.status = status;
    }

    // Add text search if provided
    if (search) {
      query.$text = { $search: search };
    }

    const experiments = await Experiment.find(query)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .select('-__v')
      .populate('projectId', 'name description'); // Populate project details

    // Log activity
    if (req.user) {
      await ActivityService.logActivity({
        type: 'experiments_listed',
        description: `${req.user.name} viewed experiments list`,
        userId: req.user._id || req.user.id,
        meta: {
          category: 'experiment',
          experimentCount: experiments.length,
          filters: { status, search },
          operation: 'list'
        }
      });
    }

    res.json(experiments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * @desc    Get experiment statistics
 * @route   GET /api/experiments/stats
 * @access  Private
 */
exports.getExperimentStats = async (req, res) => {
  try {
    const stats = await Experiment.getStats();

    // Log activity
    if (req.user) {
      await ActivityService.logActivity({
        type: 'experiment_stats_viewed',
        description: `${req.user.name} viewed experiment statistics`,
        userId: req.user._id || req.user.id,
        meta: {
          category: 'experiment',
          operation: 'view_stats'
        }
      });
    }

    res.json(stats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * @desc    Create a new experiment
 * @route   POST /api/experiments
 * @access  Private
 */
exports.createExperiment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      title,
      description,
      protocol,
      status = 'planning',
      priority = 'medium',
      startDate,
      endDate,
      teamMembers = [],
      projectId // Add projectId
    } = req.body;

    // Ensure we have a user context
    if (!req.user) {
      return res.status(401).json({ message: 'User context not found' });
    }

    // Create new experiment
    const newExperiment = new Experiment({
      title,
      description,
      protocol,
      status,
      priority,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      teamMembers,
      projectId: projectId || undefined, // Only set if provided
      createdBy: req.user._id || req.user.id,
      updatedBy: req.user._id || req.user.id
    });

    const experiment = await newExperiment.save();

    // Log activity
    if (req.user) {
      await ActivityService.logActivity({
        type: 'experiment_created',
        description: `${req.user.name} created experiment "${experiment.title}"`,
        userId: req.user._id || req.user.id,
        meta: {
          category: 'experiment',
          experimentId: experiment._id,
          experimentTitle: experiment.title,
          operation: 'create'
        }
      });
    }

    res.status(201).json(experiment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * @desc    Get experiment by ID
 * @route   GET /api/experiments/:id
 * @access  Private
 */
exports.getExperimentById = async (req, res) => {
  try {
    const query = { _id: req.params.id };
    if (req.user) {
      query.createdBy = req.user._id || req.user.id;
    }
    const experiment = await Experiment.findOne(query).populate('projectId', 'name description');

    if (!experiment) {
      return res.status(404).json({ msg: 'Experiment not found' });
    }

    // Log activity
    if (req.user) {
      await ActivityService.logActivity({
        type: 'experiment_viewed',
        description: `${req.user.name} viewed experiment "${experiment.title}"`,
        userId: req.user._id || req.user.id,
        meta: {
          category: 'experiment',
          experimentId: experiment._id,
          experimentTitle: experiment.title,
          operation: 'view'
        }
      });
    }

    res.json(experiment);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Experiment not found' });
    }
    res.status(500).send('Server Error');
  }
};

/**
 * @desc    Update experiment
 * @route   PUT /api/experiments/:id
 * @access  Private
 */
exports.updateExperiment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      title,
      description,
      protocol,
      status,
      priority,
      startDate,
      endDate,
      teamMembers,
      projectId, // Add projectId
      updateNotes
    } = req.body;

    // Build experiment object
    const experimentFields = {
      title,
      description,
      protocol,
      status,
      priority,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      teamMembers,
      projectId: projectId || undefined, // Only set if provided
      updatedBy: req.user ? (req.user._id || req.user.id) : null,
      _updateDescription: updateNotes || 'Document updated'
    };

    let experiment = await Experiment.findById(req.params.id);

    if (!experiment) {
      return res.status(404).json({ msg: 'Experiment not found' });
    }

    // Make sure user owns experiment
    if (experiment.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    experiment = await Experiment.findByIdAndUpdate(
      req.params.id,
      { $set: experimentFields },
      { new: true }
    ).populate('projectId', 'name description');

    // Log activity
    if (req.user) {
      await ActivityService.logActivity({
        type: 'experiment_updated',
        description: `${req.user.name} updated experiment "${experiment.title}"`,
        userId: req.user._id || req.user.id,
        meta: {
          category: 'experiment',
          experimentId: experiment._id,
          experimentTitle: experiment.title,
          operation: 'update'
        }
      });
    }

    res.json(experiment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * @desc    Delete experiment
 * @route   DELETE /api/experiments/:id
 * @access  Private
 */
exports.deleteExperiment = async (req, res) => {
  try {
    const experiment = await Experiment.findById(req.params.id);

    if (!experiment) {
      return res.status(404).json({ msg: 'Experiment not found' });
    }

    // Make sure user owns experiment
    if (experiment.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await experiment.remove();

    // Log activity
    if (req.user) {
      await ActivityService.logActivity({
        type: 'experiment_deleted',
        description: `${req.user.name} deleted experiment "${experiment.title}"`,
        userId: req.user._id || req.user.id,
        meta: {
          category: 'experiment',
          experimentTitle: experiment.title,
          operation: 'delete'
        }
      });
    }

    res.json({ msg: 'Experiment removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * @desc    Add note to experiment
 * @route   POST /api/experiments/:id/notes
 * @access  Private
 */
exports.addNoteToExperiment = async (req, res) => {
  try {
    const { content } = req.body;
    const experiment = await Experiment.findById(req.params.id);

    if (!experiment) {
      return res.status(404).json({ msg: 'Experiment not found' });
    }

    const newNote = {
      content,
      author: req.user.name,
      date: new Date()
    };

    experiment.notes.unshift(newNote);
    await experiment.save();

    // Log activity
    if (req.user) {
      await ActivityService.logActivity({
        type: 'experiment_note_added',
        description: `${req.user.name} added note to experiment "${experiment.title}"`,
        userId: req.user._id || req.user.id,
        meta: {
          category: 'experiment',
          experimentId: experiment._id,
          experimentTitle: experiment.title,
          operation: 'add_note'
        }
      });
    }

    res.json(experiment.notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * @desc    Delete note from experiment
 * @route   DELETE /api/experiments/:id/notes/:note_id
 * @access  Private
 */
exports.deleteNoteFromExperiment = async (req, res) => {
  try {
    const experiment = await Experiment.findById(req.params.id);

    if (!experiment) {
      return res.status(404).json({ msg: 'Experiment not found' });
    }

    // Pull out note
    const note = experiment.notes.find(note => note.id === req.params.note_id);

    // Make sure note exists
    if (!note) {
      return res.status(404).json({ msg: 'Note does not exist' });
    }

    // Check user
    if (note.author.toString() !== req.user.name) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    experiment.notes = experiment.notes.filter(
      note => note.id !== req.params.note_id
    );

    await experiment.save();

    // Log activity
    if (req.user) {
      await ActivityService.logActivity({
        type: 'experiment_note_deleted',
        description: `${req.user.name} deleted note from experiment "${experiment.title}"`,
        userId: req.user._id || req.user.id,
        meta: {
          category: 'experiment',
          experimentId: experiment._id,
          experimentTitle: experiment.title,
          operation: 'delete_note'
        }
      });
    }

    res.json(experiment.notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * @desc    Add comment to experiment
 * @route   POST /api/experiments/:id/comments
 * @access  Private
 */
exports.addCommentToExperiment = async (req, res) => {
  try {
    const { text } = req.body;
    const experiment = await Experiment.findById(req.params.id);

    if (!experiment) {
      return res.status(404).json({ msg: 'Experiment not found' });
    }

    const newComment = {
      author: req.user.name,
      text,
      date: new Date()
    };

    experiment.comments.push(newComment);
    await experiment.save();

    // Log activity
    if (req.user) {
      await ActivityService.logActivity({
        type: 'experiment_comment_added',
        description: `${req.user.name} added comment to experiment "${experiment.title}"`,
        userId: req.user._id || req.user.id,
        meta: {
          category: 'experiment',
          experimentId: experiment._id,
          experimentTitle: experiment.title,
          operation: 'add_comment'
        }
      });
    }

    res.json(experiment.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * @desc    Add reply to comment in experiment
 * @route   POST /api/experiments/:id/comments/:comment_id/replies
 * @access  Private
 */
exports.addReplyToComment = async (req, res) => {
  try {
    const { text, replyToReplyId } = req.body;
    const experiment = await Experiment.findById(req.params.id);

    if (!experiment) {
      return res.status(404).json({ msg: 'Experiment not found' });
    }

    const newReply = {
      author: req.user.name,
      text,
      date: new Date()
    };

    // Helper function to find and add reply to a comment or nested reply
    const addReply = (comments) => {
      for (let i = 0; i < comments.length; i++) {
        const comment = comments[i];

        // If this is the target comment
        if (comment._id.toString() === req.params.comment_id && !replyToReplyId) {
          comment.replies.push(newReply);
          return true;
        }

        // If we're replying to a nested reply, find it
        if (replyToReplyId) {
          if (findAndAddReply(comment.replies, replyToReplyId, newReply)) {
            return true;
          }
        }
      }
      return false;
    };

    // Helper function to recursively find and add reply to nested replies
    const findAndAddReply = (replies, targetId, reply) => {
      for (let i = 0; i < replies.length; i++) {
        const currentReply = replies[i];

        // If this is the reply we're replying to
        if (currentReply._id.toString() === targetId) {
          currentReply.replies.push(reply);
          return true;
        }

        // Check nested replies
        if (currentReply.replies && currentReply.replies.length > 0) {
          if (findAndAddReply(currentReply.replies, targetId, reply)) {
            return true;
          }
        }
      }
      return false;
    };

    // Add the reply
    if (!addReply(experiment.comments)) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    await experiment.save();

    // Log activity
    if (req.user) {
      await ActivityService.logActivity({
        type: 'experiment_reply_added',
        description: `${req.user.name} replied to comment in experiment "${experiment.title}"`,
        userId: req.user._id || req.user.id,
        meta: {
          category: 'experiment',
          experimentId: experiment._id,
          experimentTitle: experiment.title,
          operation: 'add_reply'
        }
      });
    }

    res.json(experiment.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * @desc    Delete comment from experiment
 * @route   DELETE /api/experiments/:id/comments/:comment_id
 * @access  Private
 */
exports.deleteCommentFromExperiment = async (req, res) => {
  try {
    const experiment = await Experiment.findById(req.params.id);

    if (!experiment) {
      return res.status(404).json({ msg: 'Experiment not found' });
    }

    // Pull out comment
    const comment = experiment.comments.find(comment => comment.id === req.params.comment_id);

    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }

    // Check user - for now allow any user to delete (you may want to restrict this)
    // if (comment.author.toString() !== req.user.name) {
    //   return res.status(401).json({ msg: 'User not authorized' });
    // }

    experiment.comments = experiment.comments.filter(
      comment => comment.id !== req.params.comment_id
    );

    await experiment.save();

    // Log activity
    if (req.user) {
      await ActivityService.logActivity({
        type: 'experiment_comment_deleted',
        description: `${req.user.name} deleted comment from experiment "${experiment.title}"`,
        userId: req.user._id || req.user.id,
        meta: {
          category: 'experiment',
          experimentId: experiment._id,
          experimentTitle: experiment.title,
          operation: 'delete_comment'
        }
      });
    }

    res.json(experiment.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * @desc    Delete reply from comment in experiment
 * @route   DELETE /api/experiments/:id/comments/:comment_id/replies/:reply_id
 * @access  Private
 */
exports.deleteReplyFromComment = async (req, res) => {
  try {
    const experiment = await Experiment.findById(req.params.id);

    if (!experiment) {
      return res.status(404).json({ msg: 'Experiment not found' });
    }

    // Helper function to find and remove reply
    const removeReply = (comments) => {
      for (let i = 0; i < comments.length; i++) {
        const comment = comments[i];

        // Check top-level replies
        comment.replies = comment.replies.filter(reply => reply._id.toString() !== req.params.reply_id);

        // Check nested replies
        removeReplyFromNested(comment.replies);
      }
      return comments;
    };

    // Helper function to recursively remove reply from nested replies
    const removeReplyFromNested = (replies) => {
      for (let i = 0; i < replies.length; i++) {
        const reply = replies[i];

        // Remove matching reply
        if (reply._id.toString() === req.params.reply_id) {
          replies.splice(i, 1);
          i--; // Adjust index after removal
          continue;
        }

        // Check nested replies
        if (reply.replies && reply.replies.length > 0) {
          reply.replies = reply.replies.filter(nestedReply => nestedReply._id.toString() !== req.params.reply_id);
          removeReplyFromNested(reply.replies);
        }
      }
    };

    // Remove the reply
    removeReply(experiment.comments);
    await experiment.save();

    // Log activity
    if (req.user) {
      await ActivityService.logActivity({
        type: 'experiment_reply_deleted',
        description: `${req.user.name} deleted reply from comment in experiment "${experiment.title}"`,
        userId: req.user._id || req.user.id,
        meta: {
          category: 'experiment',
          experimentId: experiment._id,
          experimentTitle: experiment.title,
          operation: 'delete_reply'
        }
      });
    }

    res.json(experiment.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * @desc    Export experiment data
 * @route   GET /api/experiments/:id/export
 * @access  Private
 */
exports.exportExperiment = async (req, res) => {
  try {
    const { id } = req.params;
    const { format = 'json' } = req.query;
    const experiment = await Experiment.findById(id).lean();
    if (!experiment) return res.status(404).json({ error: 'Experiment not found' });

    // Remove MongoDB internal fields
    const exportData = { ...experiment };
    delete exportData.__v;
    delete exportData._id;

    // Log activity
    if (req.user) {
      await ActivityService.logActivity({
        type: 'experiment_exported',
        description: `${req.user.name} exported experiment "${experiment.title}" as ${format}`,
        userId: req.user._id || req.user.id,
        meta: {
          category: 'experiment',
          experimentId: experiment._id,
          experimentTitle: experiment.title,
          exportFormat: format,
          operation: 'export'
        }
      });
    }

    if (format === 'csv') {
      const parser = new Parser();
      const csv = parser.parse(exportData);
      res.header('Content-Type', 'text/csv');
      res.attachment(`experiment_${id}.csv`);
      return res.send(csv);
    } else if (format === 'xlsx') {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Experiment Data');

      // Add data to worksheet
      Object.entries(exportData).forEach(([key, value], index) => {
        worksheet.getCell(`A${index + 1}`).value = key;
        worksheet.getCell(`B${index + 1}`).value = typeof value === 'object' ? JSON.stringify(value) : value;
      });

      res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.attachment(`experiment_${id}.xlsx`);
      await workbook.xlsx.write(res);
      res.end();
    } else if (format === 'pdf') {
      const doc = new PDFDocument();
      res.header('Content-Type', 'application/pdf');
      res.attachment(`experiment_${id}.pdf`);
      doc.pipe(res);

      doc.fontSize(16).text(`Experiment: ${exportData.title}`, { underline: true });
      doc.moveDown();

      Object.entries(exportData).forEach(([key, value]) => {
        doc.fontSize(12).text(`${key}: ${typeof value === 'object' ? JSON.stringify(value, null, 2) : value}`);
        doc.moveDown();
      });

      doc.end();
    } else {
      // Default: JSON
      res.header('Content-Type', 'application/json');
      res.attachment(`experiment_${id}.json`);
      res.send(JSON.stringify(exportData, null, 2));
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};