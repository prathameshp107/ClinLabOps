const Experiment = require('../models/Experiment');
const { validationResult } = require('express-validator');
const { Parser } = require('json2csv');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const stream = require('stream');

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

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const experiments = await Experiment.find(query)
      .sort(sort)
      .select('-__v');

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
      teamMembers = []
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
      createdBy: req.user._id || req.user.id,
      updatedBy: req.user._id || req.user.id
    });

    const experiment = await newExperiment.save();
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
    const experiment = await Experiment.findOne(query);

    if (!experiment) {
      return res.status(404).json({ msg: 'Experiment not found' });
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
      updatedBy: req.user ? (req.user._id || req.user.id) : null,
      _updateDescription: updateNotes || 'Document updated'
    };

    let experiment = await Experiment.findById(req.params.id);

    if (!experiment) {
      return res.status(404).json({ msg: 'Experiment not found' });
    }

    // Make sure user owns experiment (skip check in development)
    if (req.user && experiment.createdBy && experiment.createdBy.toString() !== (req.user._id || req.user.id).toString()) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    experiment = await Experiment.findByIdAndUpdate(
      req.params.id,
      { $set: experimentFields },
      { new: true, runValidators: true }
    );

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

    // Make sure user owns experiment (skip check in development)
    if (req.user && experiment.createdBy && experiment.createdBy.toString() !== (req.user._id || req.user.id).toString()) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await experiment.remove();

    res.json({ msg: 'Experiment removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Experiment not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Export experiment data
// @route   GET /api/experiments/:id/export
// @access  Private
exports.exportExperiment = async (req, res) => {
  try {
    const { id } = req.params;
    const { format = 'json' } = req.query;

    const experiment = await Experiment.findById(id).lean();
    if (!experiment) {
      return res.status(404).json({ error: 'Experiment not found' });
    }

    // Remove MongoDB internal fields
    const exportData = { ...experiment };
    delete exportData.__v;
    delete exportData._id;

    if (format === 'csv') {
      const parser = new Parser();
      const csv = parser.parse(exportData);
      res.header('Content-Type', 'text/csv');
      res.attachment(`experiment_${id}.csv`);
      return res.send(csv);
    } else if (format === 'xlsx') {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Experiment');

      // Add headers
      const headers = Object.keys(exportData);
      worksheet.addRow(headers);

      // Add data
      const row = headers.map(header => exportData[header]);
      worksheet.addRow(row);

      // Set response headers
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=experiment_${id}.xlsx`
      );

      // Write to response
      await workbook.xlsx.write(res);
      return res.end();
    } else if (format === 'pdf') {
      const doc = new PDFDocument();
      const filename = `experiment_${id}.pdf`;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      doc.pipe(res);

      // Add content to PDF
      doc.fontSize(20).text('Experiment Details', { align: 'center' });
      doc.moveDown();

      // Add experiment details
      for (const [key, value] of Object.entries(exportData)) {
        doc.fontSize(12).text(`${key}: ${JSON.stringify(value)}`);
        doc.moveDown();
      }

      doc.end();
    } else {
      // Default to JSON
      res.json(exportData);
    }
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export experiment data' });
  }
};
