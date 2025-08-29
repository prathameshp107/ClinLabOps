const Protocol = require('../models/Protocol');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

// @desc    Get user's own protocols (both public and private)
// @route   GET /api/protocols/my-protocols
// @access  Private
const getMyProtocols = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error('User not authenticated');
  }

  const { page = 1, limit = 10, category, search, status } = req.query;
  let query = {
    isDeleted: { $ne: true },
    createdBy: req.user._id // Only protocols created by current user
  };

  // Filter by category if provided
  if (category && category !== 'all') {
    query.category = category;
  }

  // Filter by status if provided
  if (status && status !== 'all') {
    query.status = status;
  }

  // Build search query
  if (search) {
    query.$and = query.$and || [];
    query.$and.push({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'steps.instructions': { $regex: search, $options: 'i' } }
      ]
    });
  }

  try {
    const protocols = await Protocol.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('createdBy', 'name email')
      .lean();

    const count = await Protocol.countDocuments(query);

    console.log(`Found ${protocols.length} user protocols for query:`, query);

    res.json({
      success: true,
      count: protocols.length,
      total: count,
      pagination: {
        total: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit)
      },
      data: protocols
    });
  } catch (error) {
    console.error('Error fetching user protocols:', error);
    res.status(500);
    throw new Error('Failed to fetch user protocols');
  }
});

// @desc    Get all protocols
// @route   GET /api/protocols
// @access  Public (with optional auth)
const getProtocols = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, category, search, isPublic, status } = req.query;
  let query = { isDeleted: { $ne: true } }; // Exclude deleted protocols

  // Filter by category if provided
  if (category && category !== 'all') {
    query.category = category;
  }

  // Filter by status if provided
  if (status && status !== 'all') {
    query.status = status;
  }

  // Build access control query
  let accessQuery = {};
  if (req.user) {
    // For authenticated users, show their protocols + public ones
    accessQuery = {
      $or: [
        { createdBy: req.user._id },
        { isPublic: true }
      ]
    };
  } else {
    // For unauthenticated users, show protocols created by default admin + public protocols
    // This ensures consistency with protocol creation behavior
    accessQuery = {
      $or: [
        { isPublic: true },
        { createdBy: new mongoose.Types.ObjectId('689243ab93cfdddb6059757b') } // Default admin user ID
      ]
    };
  }

  // Filter by isPublic if specified (overrides default access logic)
  if (isPublic === 'true') {
    accessQuery = { isPublic: true };
  } else if (isPublic === 'false' && req.user) {
    accessQuery = {
      isPublic: false,
      createdBy: req.user._id // Only show user's private protocols
    };
  }

  // Build search query
  let searchQuery = {};
  if (search) {
    searchQuery = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'steps.instructions': { $regex: search, $options: 'i' } }
      ]
    };
  }

  // Combine all query conditions
  if (Object.keys(searchQuery).length > 0) {
    query = {
      ...query,
      $and: [
        accessQuery,
        searchQuery
      ]
    };
  } else {
    query = {
      ...query,
      ...accessQuery
    };
  }

  try {
    const protocols = await Protocol.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('createdBy', 'name email')
      .lean();

    const count = await Protocol.countDocuments(query);

    console.log(`Found ${protocols.length} protocols for query:`, query);

    res.json({
      success: true,
      count: protocols.length,
      total: count,
      pagination: {
        total: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit)
      },
      data: protocols
    });
  } catch (error) {
    console.error('Error fetching protocols:', error);
    res.status(500);
    throw new Error('Failed to fetch protocols');
  }
});

// @desc    Get single protocol
// @route   GET /api/protocols/:id
// @access  Public (with optional auth)
const getProtocol = asyncHandler(async (req, res) => {
  const protocol = await Protocol.findById(req.params.id)
    .populate('createdBy', 'name email')
    .lean();

  if (!protocol) {
    res.status(404);
    throw new Error('Protocol not found');
  }

  // Check if user has access to the protocol
  if (!protocol.isPublic) {
    // Check if user is authenticated and owns the protocol
    const userOwnsProtocol = req.user && (protocol.createdBy._id.toString() === req.user._id.toString());
    // Check if user is admin
    const userIsAdmin = req.user && req.user.role === 'admin';
    // Check if protocol was created by default admin (for unauthenticated access)
    const isDefaultAdminProtocol = protocol.createdBy._id.toString() === '689243ab93cfdddb6059757b';

    if (!userOwnsProtocol && !userIsAdmin && !isDefaultAdminProtocol) {
      res.status(403);
      throw new Error('Not authorized to access this protocol');
    }
  }

  res.json({
    success: true,
    data: protocol
  });
});

// @desc    Create new protocol
// @route   POST /api/protocols
// @access  Private
const createProtocol = asyncHandler(async (req, res) => {
  console.log('=== CREATE PROTOCOL REQUEST ===');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  console.log('Request user:', req.user ? { id: req.user._id, email: req.user.email } : 'NO USER');
  console.log('Authorization header:', req.headers.authorization ? 'Present' : 'Missing');

  const {
    name,
    description,
    category,
    version = '1.0',
    status = 'Draft',
    steps = [],
    materials = [],
    safetyNotes = '',
    references = [],
    files = [],
    isPublic = false,
    tags = []
  } = req.body;

  // Validate required fields
  if (!name || !category) {
    res.status(400);
    throw new Error('Please provide all required fields (name and category)');
  }

  // Ensure user is authenticated
  if (!req.user) {
    console.log('No user found in request');
    res.status(401);
    throw new Error('User not authenticated - please log in');
  }

  if (!req.user._id) {
    console.log('User object exists but _id is missing:', req.user);
    res.status(401);
    throw new Error('Invalid user session - please log in again');
  }

  console.log('Creating protocol for user:', req.user._id);

  // Format steps if it's a string (from textarea)
  let formattedSteps = [];
  if (typeof steps === 'string') {
    formattedSteps = steps
      .split('\n')
      .filter(step => step.trim() !== '')
      .map((step, index) => ({
        number: index + 1,
        title: `Step ${index + 1}`,
        instructions: step.trim(),
        stepNumber: index + 1,
        description: step.trim(),
        duration: '',
        notes: ''
      }));
  } else if (Array.isArray(steps)) {
    formattedSteps = steps.map((step, index) => ({
      ...step,
      number: step.number || index + 1,
      stepNumber: step.stepNumber || index + 1
    }));
  }

  // Format materials if it's a string (from textarea)
  let formattedMaterials = [];
  if (typeof materials === 'string') {
    formattedMaterials = materials
      .split('\n')
      .filter(item => item.trim() !== '')
      .map(item => ({
        name: item.trim(),
        quantity: '',
        notes: ''
      }));
  } else if (Array.isArray(materials)) {
    formattedMaterials = materials.map(material => {
      if (typeof material === 'string') {
        return {
          name: material.trim(),
          quantity: '',
          notes: ''
        };
      }
      return material;
    });
  }

  // Format references
  let formattedReferences = [];
  if (typeof references === 'string') {
    formattedReferences = references
      .split('\n')
      .filter(ref => ref.trim() !== '')
      .map(ref => ref.trim());
  } else if (Array.isArray(references)) {
    formattedReferences = references.filter(ref => ref && ref.trim() !== '');
  }

  try {
    // Create protocol
    const protocol = await Protocol.create({
      name,
      description,
      category,
      version,
      status,
      steps: formattedSteps,
      materials: formattedMaterials,
      safetyNotes,
      references: formattedReferences,
      files: files || [],
      isPublic,
      tags,
      createdBy: req.user._id
    });

    console.log('Protocol created successfully:', protocol._id);

    // Populate the created protocol with user details
    const populatedProtocol = await Protocol.findById(protocol._id)
      .populate('createdBy', 'name email')
      .lean();

    res.status(201).json({
      success: true,
      data: populatedProtocol
    });
  } catch (error) {
    console.error('Error creating protocol:', error);
    res.status(500);
    throw new Error(`Failed to create protocol: ${error.message}`);
  }
});

// @desc    Update protocol
// @route   PUT /api/protocols/:id
// @access  Private
const updateProtocol = asyncHandler(async (req, res) => {
  let protocol = await Protocol.findById(req.params.id);

  if (!protocol) {
    res.status(404);
    throw new Error('Protocol not found');
  }

  // Check if user is the owner or admin
  if (protocol.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this protocol');
  }

  // Update fields
  const {
    name,
    description,
    category,
    version,
    status,
    steps,
    materials,
    safetyNotes,
    references,
    files,
    isPublic,
    tags
  } = req.body;

  if (name) protocol.name = name;
  if (description) protocol.description = description;
  if (category) protocol.category = category;
  if (version) protocol.version = version;
  if (status) protocol.status = status;
  if (steps) protocol.steps = steps;
  if (materials) protocol.materials = materials;
  if (safetyNotes) protocol.safetyNotes = safetyNotes;
  if (references) protocol.references = references;
  if (files) protocol.files = files;
  if (isPublic !== undefined) protocol.isPublic = isPublic;
  if (tags) protocol.tags = tags;

  const updatedProtocol = await protocol.save();

  // Populate the updated protocol with user details
  const populatedProtocol = await Protocol.findById(updatedProtocol._id)
    .populate('createdBy', 'name email')
    .lean();

  res.json({
    success: true,
    data: populatedProtocol
  });
});

// @desc    Delete protocol
// @route   DELETE /api/protocols/:id
// @access  Private
const deleteProtocol = asyncHandler(async (req, res) => {
  const protocol = await Protocol.findById(req.params.id);

  if (!protocol) {
    res.status(404);
    throw new Error('Protocol not found');
  }

  // Check if user is the owner or admin
  if (protocol.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this protocol');
  }

  // Soft delete by setting isDeleted flag
  protocol.isDeleted = true;
  protocol.deletedAt = Date.now();
  await protocol.save();

  res.json({
    success: true,
    data: { id: protocol._id }
  });
});

// @desc    Archive protocol
// @route   PUT /api/protocols/:id/archive
// @access  Private
const archiveProtocol = asyncHandler(async (req, res) => {
  const protocol = await Protocol.findById(req.params.id);

  if (!protocol) {
    res.status(404);
    throw new Error('Protocol not found');
  }

  if (protocol.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to archive this protocol');
  }

  protocol.isArchived = true;
  protocol.archivedAt = Date.now();
  await protocol.save();

  res.json({
    success: true,
    data: protocol
  });
});

// @desc    Restore protocol
// @route   PUT /api/protocols/:id/restore
// @access  Private
const restoreProtocol = asyncHandler(async (req, res) => {
  const protocol = await Protocol.findById(req.params.id);

  if (!protocol) {
    res.status(404);
    throw new Error('Protocol not found');
  }

  if (protocol.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to restore this protocol');
  }

  protocol.isArchived = false;
  protocol.archivedAt = null;
  await protocol.save();

  res.json({
    success: true,
    data: protocol
  });
});

// @desc    Duplicate protocol
// @route   POST /api/protocols/:id/duplicate
// @access  Private
const duplicateProtocol = asyncHandler(async (req, res) => {
  const protocol = await Protocol.findById(req.params.id);

  if (!protocol) {
    res.status(404);
    throw new Error('Protocol not found');
  }

  // Check if user has access to the protocol
  if (!protocol.isPublic && protocol.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to duplicate this protocol');
  }

  // Create a new protocol based on the existing one
  const newProtocol = new Protocol({
    ...protocol.toObject(),
    _id: undefined, // Let MongoDB generate a new _id
    name: `${protocol.name} (Copy)`,
    version: '1.0',
    isPublic: false, // Default to private when duplicating
    createdBy: req.user._id,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isArchived: false,
    archivedAt: null,
    isDeleted: false,
    deletedAt: null
  });

  await newProtocol.save();

  res.status(201).json({
    success: true,
    data: newProtocol
  });
});

module.exports = {
  getProtocols,
  getMyProtocols,
  getProtocol,
  createProtocol,
  updateProtocol,
  deleteProtocol,
  archiveProtocol,
  restoreProtocol,
  duplicateProtocol
};
