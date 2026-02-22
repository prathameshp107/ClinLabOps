const ELNEntry = require('../models/ELNEntry');
const ELNComment = require('../models/ELNComment');
const ELNVersion = require('../models/ELNVersion');
const sanitizeHtml = require('sanitize-html');
const xss = require('xss');

/**
 * Sanitize rich text content to prevent XSS attacks
 */
const sanitizeContent = (content) => {
    if (!content || typeof content !== 'string') {
        return content;
    }

    // Using sanitize-html for rich text content
    return sanitizeHtml(content, {
        allowedTags: [
            'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'ol', 'ul', 'li', 'blockquote', 'pre', 'code', 'hr', 'div',
            'table', 'thead', 'tbody', 'tr', 'th', 'td', 'caption',
            'span', 'a', 'img', 'figure', 'figcaption',
            'sup', 'sub', 'strike', 'del', 'ins', 'mark'
        ],
        allowedAttributes: {
            '*': ['style', 'class', 'id'],
            'a': ['href', 'target', 'rel'],
            'img': ['src', 'alt', 'width', 'height', 'title'],
            'span': ['style', 'class', 'id'],
            'p': ['style', 'class', 'id'],
            'div': ['style', 'class', 'id'],
            'table': ['style', 'class', 'id'],
            'td': ['style', 'class', 'id', 'colspan', 'rowspan'],
            'th': ['style', 'class', 'id', 'colspan', 'rowspan']
        },
        allowedSchemes: ['http', 'https', 'mailto', 'ftp'],
        allowedSchemesByTag: {},
        allowedClasses: {
            '*': ['*']
        },
        parser: {
            decodeEntities: true
        }
    });
};

/**
 * Validate ELN entry data
 */
const validateELNEntry = (entryData) => {
    const errors = [];

    if (!entryData.title || entryData.title.trim().length === 0) {
        errors.push('Title is required');
    }

    if (entryData.title && entryData.title.length > 200) {
        errors.push('Title cannot exceed 200 characters');
    }

    if (!entryData.content || entryData.content.trim().length === 0) {
        errors.push('Content is required');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Create a new version when content is updated
 */
const createVersion = async (elnEntryId, content, authorId, changes) => {
    try {
        const lastVersion = await ELNVersion.findOne({ elnEntryId })
            .sort({ versionNumber: -1 });

        const newVersionNumber = lastVersion ? lastVersion.versionNumber + 1 : 1;

        const newVersion = new ELNVersion({
            elnEntryId,
            versionNumber: newVersionNumber,
            content: sanitizeContent(content),
            author: authorId,
            changes: changes || 'Content updated'
        });

        return await newVersion.save();
    } catch (error) {
        throw new Error(`Failed to create version: ${error.message}`);
    }
};

/**
 * Check if user has access to an ELN entry
 */
const hasAccess = async (elnEntryId, userId) => {
    try {
        const elnEntry = await ELNEntry.findById(elnEntryId);
        if (!elnEntry) {
            return false;
        }

        const userIdStr = userId.toString();
        const authorIdStr = elnEntry.author.toString();

        // Author has access
        if (authorIdStr === userIdStr) {
            return true;
        }

        // Check if user is a collaborator
        return elnEntry.collaborators.some(
            collab => collab.toString() === userIdStr
        );
    } catch (error) {
        console.error('Error checking ELN access:', error);
        return false;
    }
};

/**
 * Get ELN entries with advanced filtering
 */
const getFilteredEntries = async (filters, options = {}) => {
    try {
        const {
            userId,
            status,
            projectId,
            experimentId,
            search,
            page = 1,
            limit = 10
        } = filters;

        const query = {};

        // Add permission filter
        if (userId) {
            query.$or = [
                { author: userId },
                { 'collaborators': { $in: [userId] } }
            ];
        }

        // Add other filters
        if (status) query.status = status;
        if (projectId) query.projectId = projectId;
        if (experimentId) query.experimentId = experimentId;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        const populateOptions = options.populate || [
            { path: 'author', select: 'name email' },
            { path: 'collaborators', select: 'name email' },
            { path: 'projectId', select: 'name' },
            { path: 'experimentId', select: 'title' }
        ];

        const elnEntries = await ELNEntry.find(query)
            .populate(populateOptions)
            .sort(options.sort || { createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const total = await ELNEntry.countDocuments(query);

        return {
            data: elnEntries,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        };
    } catch (error) {
        throw new Error(`Failed to get filtered entries: ${error.message}`);
    }
};

/**
 * Get ELN entry statistics
 */
const getELNStatistics = async (userId) => {
    try {
        const baseQuery = userId ? {
            $or: [
                { author: userId },
                { 'collaborators': { $in: [userId] } }
            ]
        } : {};

        const stats = await ELNEntry.aggregate([
            {
                $match: baseQuery
            },
            {
                $facet: {
                    totalEntries: [
                        { $count: 'count' }
                    ],
                    byStatus: [
                        { $group: { _id: '$status', count: { $sum: 1 } } }
                    ],
                    byMonth: [
                        { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } },
                        { $sort: { _id: 1 } }
                    ],
                    recentEntries: [
                        { $sort: { createdAt: -1 } },
                        { $limit: 5 },
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'author',
                                foreignField: '_id',
                                as: 'authorInfo'
                            }
                        },
                        {
                            $project: {
                                title: 1,
                                createdAt: 1,
                                author: { $arrayElemAt: ['$authorInfo.name', 0] }
                            }
                        }
                    ]
                }
            }
        ]);

        return {
            totalEntries: stats[0].totalEntries[0]?.count || 0,
            byStatus: stats[0].byStatus,
            byMonth: stats[0].byMonth,
            recentEntries: stats[0].recentEntries
        };
    } catch (error) {
        throw new Error(`Failed to get ELN statistics: ${error.message}`);
    }
};

/**
 * Update ELN entry with version control
 */
const updateELNEntryWithVersion = async (elnEntryId, updateData, userId, changes) => {
    try {
        const elnEntry = await ELNEntry.findById(elnEntryId);
        if (!elnEntry) {
            throw new Error('ELN entry not found');
        }

        // Check if content is being updated to create a version
        let needsVersion = false;
        let versionChanges = changes || 'Fields updated';

        if (updateData.content && updateData.content !== elnEntry.content) {
            needsVersion = true;
            versionChanges = 'Content updated';
        }

        // Sanitize content if present
        if (updateData.content) {
            updateData.content = sanitizeContent(updateData.content);
        }

        // Update the entry
        Object.assign(elnEntry, updateData);
        const updatedEntry = await elnEntry.save();

        // Create version if content was updated
        if (needsVersion) {
            await createVersion(elnEntryId, updateData.content, userId, versionChanges);
        }

        return updatedEntry;
    } catch (error) {
        throw new Error(`Failed to update ELN entry: ${error.message}`);
    }
};

module.exports = {
    sanitizeContent,
    validateELNEntry,
    createVersion,
    hasAccess,
    getFilteredEntries,
    getELNStatistics,
    updateELNEntryWithVersion
};