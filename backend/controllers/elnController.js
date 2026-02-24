const ELNEntry = require('../models/ELNEntry');
const ELNComment = require('../models/ELNComment');
const ELNVersion = require('../models/ELNVersion');
const mongoose = require('mongoose');
const ActivityService = require('../services/activityService');
const elnService = require('../services/elnService');

// Get all ELN entries
const getELNEntries = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, projectId, experimentId, search } = req.query;

        const userId = req.user._id.toString();

        // Base query with permission check
        const query = {
            $and: [
                {
                    $or: [
                        { author: userId },
                        { 'collaborators': { $in: [userId] } }
                    ]
                }
            ]
        };

        // Add optional filters
        if (status) query.$and.push({ status });
        if (projectId) query.$and.push({ projectId });
        if (experimentId) query.$and.push({ experimentId });

        if (search) {
            query.$and.push({
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { content: { $regex: search, $options: 'i' } },
                    { tags: { $in: [new RegExp(search, 'i')] } }
                ]
            });
        }

        const elnEntries = await ELNEntry.find(query)
            .populate('author', 'name email avatar')
            .populate('collaborators', 'name email avatar')
            .populate('projectId', 'name')
            .populate('experimentId', 'title')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const total = await ELNEntry.countDocuments(query);

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'eln_entries_viewed',
                description: `${req.user.name} viewed ELN entries`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'eln',
                    operation: 'list',
                    count: elnEntries.length
                }
            });
        }

        res.status(200).json({
            success: true,
            data: elnEntries,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching ELN entries',
            error: error.message
        });
    }
};

// Get ELN entry by ID
const getELNEntryById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid ELN entry ID'
            });
        }

        const elnEntry = await ELNEntry.findById(id)
            .populate('author', 'name email avatar')
            .populate('collaborators', 'name email avatar')
            .populate('projectId', 'name')
            .populate('experimentId', 'title');

        if (!elnEntry) {
            return res.status(404).json({
                success: false,
                message: 'ELN entry not found'
            });
        }

        // Check permission - user must be author or collaborator
        const userId = req.user._id.toString();
        const authorId = elnEntry.author._id ? elnEntry.author._id.toString() : elnEntry.author.toString();
        const isAuthor = authorId === userId;

        const isCollaborator = elnEntry.collaborators.some(collab => {
            const collabId = collab._id ? collab._id.toString() : collab.toString();
            return collabId === userId;
        });

        if (!isAuthor && !isCollaborator) {
            console.log('Access denied for user:', userId);
            console.log('Entry author ID:', authorId);
            console.log('Entry collaborators IDs:', elnEntry.collaborators.map(c => c._id ? c._id.toString() : c.toString()));
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Fetch and structure comments
        const comments = await ELNComment.find({ elnEntryId: id })
            .populate('author', 'name email avatar')
            .sort({ createdAt: 1 });

        const commentMap = {};
        const roots = [];

        comments.forEach(comment => {
            const commentObj = comment.toObject();
            commentObj.replies = [];
            commentMap[commentObj._id.toString()] = commentObj;
        });

        comments.forEach(comment => {
            const commentObj = commentMap[comment._id.toString()];
            if (commentObj.parentCommentId) {
                const parent = commentMap[commentObj.parentCommentId.toString()];
                if (parent) {
                    parent.replies.push(commentObj);
                } else {
                    roots.push(commentObj);
                }
            } else {
                roots.push(commentObj);
            }
        });

        const elnEntryObj = elnEntry.toObject();
        elnEntryObj.comments = roots;

        res.status(200).json({ success: true, data: elnEntryObj });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching ELN entry',
            error: error.message
        });
    }
};

// Create ELN entry
const createELNEntry = async (req, res) => {
    try {
        const { title, content, projectId, experimentId, tags, status } = req.body;

        const sanitizedContent = elnService.sanitizeContent(content);

        const newELNEntry = new ELNEntry({
            title,
            content: sanitizedContent,
            author: req.user._id,
            projectId,
            experimentId,
            tags: tags || [],
            status: status || 'draft'
        });

        const savedEntry = await newELNEntry.save();

        // Create initial version
        const initialVersion = new ELNVersion({
            elnEntryId: savedEntry._id,
            versionNumber: 1,
            content: sanitizedContent,
            author: req.user._id,
            changes: 'Initial version'
        });
        await initialVersion.save();

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'eln_entry_created',
                description: `${req.user.name} created ELN entry: ${title}`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'eln',
                    operation: 'create',
                    elnEntryId: savedEntry._id
                }
            });
        }

        const populatedEntry = await savedEntry.populate('author', 'name email avatar');

        res.status(201).json({
            success: true,
            message: 'ELN entry created successfully',
            data: populatedEntry
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating ELN entry',
            error: error.message
        });
    }
};

// Update ELN entry
const updateELNEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, projectId, experimentId, tags, status, collaborators } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid ELN entry ID'
            });
        }

        const elnEntry = await ELNEntry.findById(id);
        if (!elnEntry) {
            return res.status(404).json({
                success: false,
                message: 'ELN entry not found'
            });
        }

        // Check permission - user must be author
        if (elnEntry.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Update fields
        if (title !== undefined) elnEntry.title = title;
        if (content !== undefined) elnEntry.content = elnService.sanitizeContent(content);
        if (projectId !== undefined) elnEntry.projectId = projectId;
        if (experimentId !== undefined) elnEntry.experimentId = experimentId;
        if (tags !== undefined) elnEntry.tags = tags;
        if (status !== undefined) elnEntry.status = status;
        if (collaborators !== undefined) elnEntry.collaborators = collaborators;

        const updatedEntry = await elnEntry.save();

        // Create new version
        const lastVersion = await ELNVersion.findOne({ elnEntryId: id }).sort({ versionNumber: -1 });
        const newVersionNumber = lastVersion ? lastVersion.versionNumber + 1 : 1;

        const versionChanges = `Updated fields: ${Object.keys(req.body).join(', ')}`;
        const newVersion = new ELNVersion({
            elnEntryId: updatedEntry._id,
            versionNumber: newVersionNumber,
            content: elnService.sanitizeContent(content || elnEntry.content),
            author: req.user._id,
            changes: versionChanges
        });
        await newVersion.save();

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'eln_entry_updated',
                description: `${req.user.name} updated ELN entry: ${title || elnEntry.title}`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'eln',
                    operation: 'update',
                    elnEntryId: updatedEntry._id
                }
            });
        }

        const populatedEntry = await updatedEntry.populate([
            { path: 'author', select: 'name email avatar' },
            { path: 'collaborators', select: 'name email avatar' }
        ]);

        res.status(200).json({
            success: true,
            message: 'ELN entry updated successfully',
            data: populatedEntry
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating ELN entry',
            error: error.message
        });
    }
};

// Delete ELN entry
const deleteELNEntry = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid ELN entry ID'
            });
        }

        const elnEntry = await ELNEntry.findById(id);
        if (!elnEntry) {
            return res.status(404).json({
                success: false,
                message: 'ELN entry not found'
            });
        }

        // Check permission - user must be author
        if (elnEntry.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Delete associated versions and comments
        await ELNVersion.deleteMany({ elnEntryId: id });
        await ELNComment.deleteMany({ elnEntryId: id });

        await ELNEntry.findByIdAndDelete(id);

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'eln_entry_deleted',
                description: `${req.user.name} deleted ELN entry: ${elnEntry.title}`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'eln',
                    operation: 'delete',
                    elnEntryId: id
                }
            });
        }

        res.status(200).json({
            success: true,
            message: 'ELN entry deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting ELN entry',
            error: error.message
        });
    }
};

// Get ELN entry versions
const getELNVersions = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid ELN entry ID'
            });
        }

        const elnEntry = await ELNEntry.findById(id);
        if (!elnEntry) {
            return res.status(404).json({
                success: false,
                message: 'ELN entry not found'
            });
        }

        // Check permission - user must be author or collaborator
        const userId = req.user._id.toString();
        const authorId = elnEntry.author._id ? elnEntry.author._id.toString() : elnEntry.author.toString();
        const isAuthor = authorId === userId;

        const isCollaborator = elnEntry.collaborators.some(collab => {
            const collabId = collab._id ? collab._id.toString() : collab.toString();
            return collabId === userId;
        });

        if (!isAuthor && !isCollaborator) {
            console.log('Access denied for user:', userId);
            console.log('Entry author ID:', authorId);
            console.log('Entry collaborators IDs:', elnEntry.collaborators.map(c => c._id ? c._id.toString() : c.toString()));
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        const versions = await ELNVersion.find({ elnEntryId: id })
            .populate('author', 'name email avatar')
            .sort({ versionNumber: -1 });

        res.status(200).json({ success: true, data: versions });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching ELN versions',
            error: error.message
        });
    }
};

// Add collaborator to ELN entry
const addCollaborator = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid ELN entry ID'
            });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID'
            });
        }

        const elnEntry = await ELNEntry.findById(id);
        if (!elnEntry) {
            return res.status(404).json({
                success: false,
                message: 'ELN entry not found'
            });
        }

        // Check permission - user must be author
        if (elnEntry.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Add collaborator if not already added
        if (!elnEntry.collaborators.includes(userId)) {
            elnEntry.collaborators.push(userId);
            await elnEntry.save();
        }

        const populatedEntry = await elnEntry.populate([
            { path: 'author', select: 'name email avatar' },
            { path: 'collaborators', select: 'name email avatar' }
        ]);

        res.status(200).json({
            success: true,
            message: 'Collaborator added successfully',
            data: populatedEntry
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding collaborator',
            error: error.message
        });
    }
};

// Remove collaborator from ELN entry
const removeCollaborator = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid ELN entry ID'
            });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID'
            });
        }

        const elnEntry = await ELNEntry.findById(id);
        if (!elnEntry) {
            return res.status(404).json({
                success: false,
                message: 'ELN entry not found'
            });
        }

        // Check permission - user must be author
        if (elnEntry.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Remove collaborator
        elnEntry.collaborators = elnEntry.collaborators.filter(
            collab => collab.toString() !== userId
        );
        await elnEntry.save();

        const populatedEntry = await elnEntry.populate([
            { path: 'author', select: 'name email avatar' },
            { path: 'collaborators', select: 'name email avatar' }
        ]);

        res.status(200).json({
            success: true,
            message: 'Collaborator removed successfully',
            data: populatedEntry
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error removing collaborator',
            error: error.message
        });
    }
};

// Add comment to ELN entry
const addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content, parentCommentId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid ELN entry ID'
            });
        }

        const elnEntry = await ELNEntry.findById(id);
        if (!elnEntry) {
            return res.status(404).json({
                success: false,
                message: 'ELN entry not found'
            });
        }

        // Check permission - user must be author or collaborator
        const userId = req.user._id.toString();
        const authorId = elnEntry.author._id ? elnEntry.author._id.toString() : elnEntry.author.toString();
        const isAuthor = authorId === userId;

        const isCollaborator = elnEntry.collaborators.some(collab => {
            const collabId = collab._id ? collab._id.toString() : collab.toString();
            return collabId === userId;
        });

        if (!isAuthor && !isCollaborator) {
            console.log('Access denied for user:', userId);
            console.log('Entry author ID:', authorId);
            console.log('Entry collaborators IDs:', elnEntry.collaborators.map(c => c._id ? c._id.toString() : c.toString()));
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        const newComment = new ELNComment({
            elnEntryId: id,
            author: req.user._id,
            content,
            parentCommentId: parentCommentId || null
        });

        const savedComment = await newComment.save();

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'eln_comment_added',
                description: `${req.user.name} added comment to ELN entry: ${elnEntry.title}`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'eln',
                    operation: 'comment',
                    elnEntryId: id,
                    commentId: savedComment._id
                }
            });
        }

        res.status(201).json({
            success: true,
            message: 'Comment added successfully',
            data: await savedComment.populate('author', 'name email avatar')
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding comment',
            error: error.message
        });
    }
};

/**
 * Delete a comment from an ELN entry
 */
const deleteComment = async (req, res) => {
    try {
        const { id, commentId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid comment ID'
            });
        }

        const comment = await ELNComment.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        const elnEntry = await ELNEntry.findById(id);
        if (!elnEntry) {
            return res.status(404).json({
                success: false,
                message: 'ELN entry not found'
            });
        }

        // Check if user is author of comment OR author of ELN entry
        const userId = req.user._id.toString();
        const commentAuthorId = comment.author.toString();
        const elnAuthorId = elnEntry.author.toString();

        if (userId !== commentAuthorId && userId !== elnAuthorId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Delete the comment and its replies
        await ELNComment.deleteMany({ parentCommentId: commentId });
        await ELNComment.findByIdAndDelete(commentId);

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'eln_comment_deleted',
                description: `${req.user.name} deleted a comment from ELN entry: ${elnEntry.title}`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'eln',
                    elnId: id,
                    commentId: commentId
                }
            });
        }

        res.status(200).json({
            success: true,
            message: 'Comment deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Search ELN entries
const searchELNEntries = async (req, res) => {
    try {
        const { q, page = 1, limit = 10 } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const userId = req.user._id.toString();
        const query = {
            $and: [
                {
                    $or: [
                        { author: userId },
                        { 'collaborators': { $in: [userId] } }
                    ]
                },
                {
                    $or: [
                        { title: { $regex: q, $options: 'i' } },
                        { content: { $regex: q, $options: 'i' } },
                        { tags: { $in: [new RegExp(q, 'i')] } }
                    ]
                }
            ]
        };

        const elnEntries = await ELNEntry.find(query)
            .populate('author', 'name email avatar')
            .populate('collaborators', 'name email avatar')
            .populate('projectId', 'name')
            .populate('experimentId', 'title')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const total = await ELNEntry.countDocuments(query);

        res.status(200).json({
            success: true,
            data: elnEntries,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching ELN entries',
            error: error.message
        });
    }
};

module.exports = {
    getELNEntries,
    getELNEntryById,
    createELNEntry,
    updateELNEntry,
    deleteELNEntry,
    getELNVersions,
    addCollaborator,
    removeCollaborator,
    addComment,
    deleteComment,
    searchELNEntries
};