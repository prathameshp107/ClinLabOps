const Protocol = require('../models/Protocol');
const asyncHandler = require('express-async-handler');

// @desc    Get all protocols
// @route   GET /api/protocols
// @access  Public (with optional auth)
const getProtocols = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, category, search, isPublic } = req.query;
  const query = {};
  
  // Filter by category if provided
  if (category) {
    query.category = category;
  }
  
  // Handle public/private access
  if (req.user) {
    // For authenticated users, show their protocols + public ones
    query.$or = [
      { createdBy: req.user._id },
      { isPublic: true }
    ];
  } else {
    // For unauthenticated users, only show public protocols
    query.isPublic = true;
  }
  
  // Filter by isPublic if specified
  if (isPublic === 'true') {
    query.isPublic = true;
  } else if (isPublic === 'false' && req.user) {
    query.isPublic = false;
    query.createdBy = req.user._id; // Only show user's private protocols
  }
  
  // Search functionality
  if (search) {
    query.$text = { $search: search };
  }
  
  const protocols = await Protocol.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('createdBy', 'name email')
    .lean();
    
  const count = await Protocol.countDocuments(query);
  
  res.json({
    success: true,
    count: protocols.length,
    total: count,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page),
    data: protocols
  });
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
    if (!req.user || (protocol.createdBy._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')) {
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
  const { 
    name, 
    description, 
    category, 
    steps = [], 
    materials = [], 
    safetyNotes = '', 
    isPublic = false, 
    tags = [],
    version = '1.0',
    status = 'Draft'
  } = req.body;

  // Validate required fields
  if (!name || !category) {
    res.status(400);
    throw new Error('Please provide all required fields (name and category)');
  }

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
        duration: '',
        notes: ''
      }));
  } else if (Array.isArray(steps)) {
    formattedSteps = steps;
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
    formattedMaterials = materials;
  }

  // Create protocol
  const protocol = await Protocol.create({
    name,
    description,
    category,
    steps: formattedSteps,
    materials: formattedMaterials,
    safetyNotes,
    isPublic,
    tags,
    version,
    status,
    createdBy: req.user._id
  });
  
  res.status(201).json({
    success: true,
    data: protocol
  });
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
  const { name, description, category, steps, materials, safetyNotes, isPublic, tags } = req.body;
  
  if (name) protocol.name = name;
  if (description) protocol.description = description;
  if (category) protocol.category = category;
  if (steps) protocol.steps = steps;
  if (materials) protocol.materials = materials;
  if (safetyNotes) protocol.safetyNotes = safetyNotes;
  if (isPublic !== undefined) protocol.isPublic = isPublic;
  if (tags) protocol.tags = tags;
  
  const updatedProtocol = await protocol.save();
  
  res.json({
    success: true,
    data: updatedProtocol
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
  getProtocol,
  createProtocol,
  updateProtocol,
  deleteProtocol,
  archiveProtocol,
  restoreProtocol,
  duplicateProtocol
};
