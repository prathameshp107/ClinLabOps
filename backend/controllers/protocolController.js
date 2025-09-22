const Protocol = require('../models/Protocol');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const ActivityService = require('../services/activityService');

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

    // Log activity
    if (req.user) {
      await ActivityService.logActivity({
        type: 'user_protocols_listed',
        description: `${req.user.name} viewed their protocols list`,
        userId: req.user._id || req.user.id,
        meta: {
          category: 'protocol',
          protocolCount: protocols.length,
          filters: { category, search, status },
          operation: 'list_user_protocols'
        }
      });
    }

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
  const { page = 1, limit = 10, category, search, isPublic, status, excludeInReview } = req.query;
  let query = { isDeleted: { $ne: true } }; // Exclude deleted protocols

  // Filter by category if provided
  if (category && category !== 'all') {
    query.category = category;
  }

  // Filter by status if provided
  if (status && status !== 'all') {
    query.status = status;
  } else if (excludeInReview === 'true') {
    // Exclude "In Review" protocols when no specific status filter is applied
    query.status = { $ne: 'In Review' };
  }

  // Filter by isPublic if specified
  if (isPublic === 'true') {
    // All Protocols section: Show all protocols with isPublic: true, irrespective of user
    query.isPublic = true;
  } else if (isPublic === 'false') {
    // Protocols on Review section: Show all protocols with isPublic: false, irrespective of user
    query.isPublic = false;
  }
  // If isPublic is not specified, show all protocols (both public and private)

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
        searchQuery
      ]
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

    // Log activity
    if (req.user) {
      await ActivityService.logActivity({
        type: 'protocols_listed',
        description: `${req.user.name} viewed protocols list`,
        userId: req.user._id || req.user.id,
        meta: {
          category: 'protocol',
          protocolCount: protocols.length,
          filters: { category, search, isPublic, status },
          operation: 'list_protocols'
        }
      });
    }

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
    const userIsAdmin = req.user && (req.user.roles && req.user.roles.includes('Admin'));
    // Check if protocol is public
    const isPublicProtocol = protocol.isPublic;

    if (!userOwnsProtocol && !userIsAdmin && !isPublicProtocol) {
      res.status(403);
      throw new Error('Not authorized to view this protocol');
    }
  }

  // Log activity
  if (req.user) {
    await ActivityService.logActivity({
      type: 'protocol_viewed',
      description: `${req.user.name} viewed protocol "${protocol.name}"`,
      userId: req.user._id || req.user.id,
      meta: {
        category: 'protocol',
        protocolId: protocol._id,
        protocolName: protocol.name,
        operation: 'view_protocol'
      }
    });
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
  const { name, description, category, steps, isPublic = false, tags = [] } = req.body;

  // Validate required fields
  if (!name) {
    res.status(400);
    throw new Error('Protocol name is required');
  }

  // Validate steps array
  if (!Array.isArray(steps) || steps.length === 0) {
    res.status(400);
    throw new Error('Protocol must have at least one step');
  }

  // Validate each step
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    if (!step.title || !step.instructions) {
      res.status(400);
      throw new Error(`Step ${i + 1} must have both title and instructions`);
    }
  }

  // Create protocol
  const protocol = await Protocol.create({
    name,
    description,
    category,
    steps,
    isPublic,
    tags,
    createdBy: req.user._id
  });

  await protocol.populate('createdBy', 'name email');

  // Log activity
  if (req.user) {
    await ActivityService.logActivity({
      type: 'protocol_created',
      description: `${req.user.name} created protocol "${protocol.name}"`,
      userId: req.user._id || req.user.id,
      meta: {
        category: 'protocol',
        protocolId: protocol._id,
        protocolName: protocol.name,
        operation: 'create_protocol'
      }
    });
  }

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

  // Check if user owns the protocol or is admin
  const userOwnsProtocol = protocol.createdBy.toString() === req.user._id.toString();
  const userIsAdmin = req.user.roles && req.user.roles.includes('Admin');

  if (!userOwnsProtocol && !userIsAdmin) {
    res.status(403);
    throw new Error('Not authorized to update this protocol');
  }

  // Prevent updating deleted protocols
  if (protocol.isDeleted) {
    res.status(400);
    throw new Error('Cannot update a deleted protocol');
  }

  const { name, description, category, steps, isPublic, tags, status } = req.body;

  // Validate steps if provided
  if (steps && (!Array.isArray(steps) || steps.length === 0)) {
    res.status(400);
    throw new Error('Protocol must have at least one step');
  }

  // Validate each step if provided
  if (steps) {
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      if (!step.title || !step.instructions) {
        res.status(400);
        throw new Error(`Step ${i + 1} must have both title and instructions`);
      }
    }
  }

  // Update protocol
  protocol = await Protocol.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      category,
      steps,
      isPublic,
      tags,
      status,
      updatedBy: req.user._id
    },
    {
      new: true,
      runValidators: true
    }
  );

  await protocol.populate('createdBy', 'name email');
  await protocol.populate('updatedBy', 'name email');

  // Log activity
  if (req.user) {
    await ActivityService.logActivity({
      type: 'protocol_updated',
      description: `${req.user.name} updated protocol "${protocol.name}"`,
      userId: req.user._id || req.user.id,
      meta: {
        category: 'protocol',
        protocolId: protocol._id,
        protocolName: protocol.name,
        operation: 'update_protocol'
      }
    });
  }

  res.json({
    success: true,
    data: protocol
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

  // Check if user owns the protocol or is admin
  const userOwnsProtocol = protocol.createdBy.toString() === req.user._id.toString();
  const userIsAdmin = req.user.roles && req.user.roles.includes('Admin');

  if (!userOwnsProtocol && !userIsAdmin) {
    res.status(403);
    throw new Error('Not authorized to delete this protocol');
  }

  // Instead of hard delete, mark as deleted
  protocol.isDeleted = true;
  protocol.deletedAt = Date.now();
  protocol.deletedBy = req.user._id;
  await protocol.save();

  // Log activity
  if (req.user) {
    await ActivityService.logActivity({
      type: 'protocol_deleted',
      description: `${req.user.name} deleted protocol "${protocol.name}"`,
      userId: req.user._id || req.user.id,
      meta: {
        category: 'protocol',
        protocolName: protocol.name,
        operation: 'delete_protocol'
      }
    });
  }

  res.json({
    success: true,
    message: 'Protocol deleted successfully'
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

  // Check if user owns the protocol or is admin
  const userOwnsProtocol = protocol.createdBy.toString() === req.user._id.toString();
  const userIsAdmin = req.user.roles && req.user.roles.includes('Admin');

  if (!userOwnsProtocol && !userIsAdmin) {
    res.status(403);
    throw new Error('Not authorized to archive this protocol');
  }

  // Prevent archiving deleted protocols
  if (protocol.isDeleted) {
    res.status(400);
    throw new Error('Cannot archive a deleted protocol');
  }

  // Update protocol to archived status
  protocol.status = 'Archived';
  protocol.archivedAt = Date.now();
  protocol.archivedBy = req.user._id;
  await protocol.save();

  await protocol.populate('createdBy', 'name email');
  await protocol.populate('archivedBy', 'name email');

  // Log activity
  if (req.user) {
    await ActivityService.logActivity({
      type: 'protocol_archived',
      description: `${req.user.name} archived protocol "${protocol.name}"`,
      userId: req.user._id || req.user.id,
      meta: {
        category: 'protocol',
        protocolId: protocol._id,
        protocolName: protocol.name,
        operation: 'archive_protocol'
      }
    });
  }

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

  // Check if user owns the protocol or is admin
  const userOwnsProtocol = protocol.createdBy.toString() === req.user._id.toString();
  const userIsAdmin = req.user.roles && req.user.roles.includes('Admin');

  if (!userOwnsProtocol && !userIsAdmin) {
    res.status(403);
    throw new Error('Not authorized to restore this protocol');
  }

  // Prevent restoring non-archived protocols
  if (protocol.status !== 'Archived') {
    res.status(400);
    throw new Error('Protocol is not archived');
  }

  // Update protocol to draft status (or previous status)
  protocol.status = 'Draft'; // Or you could restore the previous status
  protocol.archivedAt = undefined;
  protocol.archivedBy = undefined;
  await protocol.save();

  await protocol.populate('createdBy', 'name email');

  // Log activity
  if (req.user) {
    await ActivityService.logActivity({
      type: 'protocol_restored',
      description: `${req.user.name} restored protocol "${protocol.name}"`,
      userId: req.user._id || req.user.id,
      meta: {
        category: 'protocol',
        protocolId: protocol._id,
        protocolName: protocol.name,
        operation: 'restore_protocol'
      }
    });
  }

  res.json({
    success: true,
    data: protocol
  });
});

// @desc    Duplicate protocol
// @route   POST /api/protocols/:id/duplicate
// @access  Private
const duplicateProtocol = asyncHandler(async (req, res) => {
  const originalProtocol = await Protocol.findById(req.params.id);

  if (!originalProtocol) {
    res.status(404);
    throw new Error('Protocol not found');
  }

  // Check access to the original protocol
  if (!originalProtocol.isPublic) {
    const userOwnsProtocol = req.user && (originalProtocol.createdBy.toString() === req.user._id.toString());
    const userIsAdmin = req.user && (req.user.roles && req.user.roles.includes('Admin'));

    if (!userOwnsProtocol && !userIsAdmin) {
      res.status(403);
      throw new Error('Not authorized to duplicate this protocol');
    }
  }

  // Create a copy of the protocol with "Copy" appended to the name
  const duplicatedProtocol = await Protocol.create({
    name: `${originalProtocol.name} (Copy)`,
    description: originalProtocol.description,
    category: originalProtocol.category,
    steps: originalProtocol.steps,
    isPublic: false, // Duplicated protocols are private by default
    tags: originalProtocol.tags,
    createdBy: req.user._id
  });

  await duplicatedProtocol.populate('createdBy', 'name email');

  // Log activity
  if (req.user) {
    await ActivityService.logActivity({
      type: 'protocol_duplicated',
      description: `${req.user.name} duplicated protocol "${originalProtocol.name}"`,
      userId: req.user._id || req.user.id,
      meta: {
        category: 'protocol',
        originalProtocolId: originalProtocol._id,
        duplicatedProtocolId: duplicatedProtocol._id,
        originalProtocolName: originalProtocol.name,
        duplicatedProtocolName: duplicatedProtocol.name,
        operation: 'duplicate_protocol'
      }
    });
  }

  res.status(201).json({
    success: true,
    data: duplicatedProtocol
  });
});

// @desc    Add review to protocol
// @route   POST /api/protocols/:id/reviews
// @access  Private
const addProtocolReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const protocol = await Protocol.findById(req.params.id);

  if (!protocol) {
    res.status(404);
    throw new Error('Protocol not found');
  }

  // Check if user can review (must be different from creator)
  if (protocol.createdBy.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('Cannot review your own protocol');
  }

  // Check if user already reviewed
  const alreadyReviewed = protocol.reviews.find(
    review => review.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Protocol already reviewed');
  }

  const review = {
    user: req.user._id,
    rating: Number(rating),
    comment
  };

  protocol.reviews.push(review);
  protocol.averageRating = protocol.reviews.reduce((acc, review) => acc + review.rating, 0) / protocol.reviews.length;

  await protocol.save();
  await protocol.populate('reviews.user', 'name email');

  // Log activity
  if (req.user) {
    await ActivityService.logActivity({
      type: 'protocol_review_added',
      description: `${req.user.name} reviewed protocol "${protocol.name}" with rating ${rating}`,
      userId: req.user._id || req.user.id,
      meta: {
        category: 'protocol',
        protocolId: protocol._id,
        protocolName: protocol.name,
        rating: rating,
        operation: 'add_review'
      }
    });
  }

  res.status(201).json({
    success: true,
    data: protocol
  });
});

// @desc    Get protocol reviews
// @route   GET /api/protocols/:id/reviews
// @access  Public
const getProtocolReviews = asyncHandler(async (req, res) => {
  const protocol = await Protocol.findById(req.params.id).populate('reviews.user', 'name email');

  if (!protocol) {
    res.status(404);
    throw new Error('Protocol not found');
  }

  // Log activity
  if (req.user) {
    await ActivityService.logActivity({
      type: 'protocol_reviews_viewed',
      description: `${req.user.name} viewed reviews for protocol "${protocol.name}"`,
      userId: req.user._id || req.user.id,
      meta: {
        category: 'protocol',
        protocolId: protocol._id,
        protocolName: protocol.name,
        operation: 'view_reviews'
      }
    });
  }

  res.json({
    success: true,
    count: protocol.reviews.length,
    data: protocol.reviews
  });
});

// @desc    Export protocol
// @route   GET /api/protocols/:id/export
// @access  Public (with optional auth)
const exportProtocol = asyncHandler(async (req, res) => {
  const protocol = await Protocol.findById(req.params.id)
    .populate('createdBy', 'name email')
    .lean();

  if (!protocol) {
    res.status(404);
    throw new Error('Protocol not found');
  }

  // Check access
  if (!protocol.isPublic) {
    if (!req.user) {
      res.status(401);
      throw new Error('Please log in to access this protocol');
    }
    const userOwnsProtocol = protocol.createdBy._id.toString() === req.user._id.toString();
    const userIsAdmin = req.user.roles && req.user.roles.includes('Admin');
    if (!userOwnsProtocol && !userIsAdmin) {
      res.status(403);
      throw new Error('Not authorized to access this protocol');
    }
  }

  const { format = 'json' } = req.query;

  // Log activity
  if (req.user) {
    await ActivityService.logActivity({
      type: 'protocol_exported',
      description: `${req.user.name} exported protocol "${protocol.name}" as ${format}`,
      userId: req.user._id || req.user.id,
      meta: {
        category: 'protocol',
        protocolId: protocol._id,
        protocolName: protocol.name,
        exportFormat: format,
        operation: 'export_protocol'
      }
    });
  }

  // Prepare data for export
  const exportData = {
    name: protocol.name,
    description: protocol.description,
    category: protocol.category,
    steps: protocol.steps,
    tags: protocol.tags,
    createdBy: protocol.createdBy.name,
    createdAt: protocol.createdAt,
    averageRating: protocol.averageRating,
    reviewCount: protocol.reviews.length
  };

  if (format === 'pdf') {
    // PDF export implementation would go here
    res.json({
      success: true,
      message: 'PDF export functionality would be implemented here',
      data: exportData
    });
  } else if (format === 'docx') {
    // DOCX export implementation would go here
    res.json({
      success: true,
      message: 'DOCX export functionality would be implemented here',
      data: exportData
    });
  } else {
    // Default JSON export
    res.header('Content-Type', 'application/json');
    res.attachment(`protocol_${protocol._id}.json`);
    res.json(exportData);
  }
});

module.exports = {
  getMyProtocols,
  getProtocols,
  getProtocol,
  createProtocol,
  updateProtocol,
  deleteProtocol,
  archiveProtocol,
  restoreProtocol,
  duplicateProtocol,
  addProtocolReview,
  getProtocolReviews,
  exportProtocol
};


