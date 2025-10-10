const Project = require('../models/Project');
const mongoose = require('mongoose');
const { Parser } = require('json2csv');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const stream = require('stream');
const ActivityService = require('../services/activityService');

// Get all projects (optionally filter by createdBy)
exports.getAllProjects = async (req, res) => {
    try {
        const filter = {};
        if (req.query.createdBy) {
            filter.createdBy = req.query.createdBy;
        }

        const projects = await Project.find(filter);

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'projects_listed',
                description: `${req.user.name} viewed projects list`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'project',
                    projectCount: projects.length,
                    operation: 'list'
                }
            });
        }

        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get project by ID

exports.getProjectById = async (req, res) => {
    try {

        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ error: 'Project not found' });

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'project_viewed',
                description: `${req.user.name} viewed project "${project.name}"`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'project',
                    projectId: project._id,
                    projectName: project.name,
                    operation: 'view'
                }
            });
        }

        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create new project
exports.createProject = async (req, res) => {
    try {
        let projectCode;
        let isUnique = false;
        let attempts = 0;
        const maxAttempts = 10;

        // Generate a unique project code
        while (!isUnique && attempts < maxAttempts) {
            const count = await Project.countDocuments();
            projectCode = `PRJ-${String(count + 1 + attempts).padStart(5, '0')}`;

            // Check if this code already exists
            const existingProject = await Project.findOne({ projectCode });
            if (!existingProject) {
                isUnique = true;
            } else {
                attempts++;
            }
        }

        if (!isUnique) {
            // Fallback to timestamp-based code if we can't find a unique sequential one
            projectCode = `PRJ-${Date.now()}`;
        }

        // Ensure category is valid or default to 'miscellaneous'
        const category = req.body.category && ['research', 'regulatory', 'miscellaneous'].includes(req.body.category)
            ? req.body.category
            : 'miscellaneous';

        // Ensure projectType is valid for regulatory projects or default to empty string
        let projectType = '';
        if (category === 'regulatory' && req.body.projectType) {
            const validTypes = ['iso', 'oecd', 'fda', 'ema', 'ich', 'other'];
            projectType = validTypes.includes(req.body.projectType) ? req.body.projectType : '';
        }

        // Create the project with the generated code and set createdBy
        const projectData = {
            ...req.body,
            projectCode,
            category,
            projectType
        };

        // Set createdBy field if user is authenticated
        if (req.user) {
            projectData.createdBy = req.user._id || req.user.id;
        }

        const project = new Project(projectData);
        await project.save();

        // Log activity
        if (req.user) {
            await ActivityService.logProjectActivity('created', project, req.user);
        }

        res.status(201).json(project);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create project', error: err.message });
    }
};

// Update project
exports.updateProject = async (req, res) => {
    try {
        // Ensure category is valid if provided
        if (req.body.category && !['research', 'regulatory', 'miscellaneous'].includes(req.body.category)) {
            return res.status(400).json({ error: 'Invalid category value' });
        }

        // Ensure projectType is valid if provided
        if (req.body.projectType && !['iso', 'oecd', 'fda', 'ema', 'ich', 'other', ''].includes(req.body.projectType)) {
            return res.status(400).json({ error: 'Invalid projectType value' });
        }

        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!project) return res.status(404).json({ error: 'Project not found' });

        // Log activity
        if (req.user) {
            await ActivityService.logProjectActivity('updated', project, req.user);
        }

        res.json(project);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete project
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) return res.status(404).json({ error: 'Project not found' });

        // Log activity
        if (req.user) {
            await ActivityService.logProjectActivity('deleted', project, req.user);
        }

        res.json({ message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Export project data
exports.exportProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { format = 'json' } = req.query;
        const project = await Project.findById(id).lean();
        if (!project) return res.status(404).json({ error: 'Project not found' });

        // Remove MongoDB internal fields
        const exportData = { ...project };
        delete exportData.__v;
        delete exportData._id;

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'project_exported',
                description: `${req.user.name} exported project "${project.name}" as ${format}`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'project',
                    projectId: project._id,
                    projectName: project.name,
                    exportFormat: format,
                    operation: 'export'
                }
            });
        }

        if (format === 'csv') {
            const parser = new Parser();
            const csv = parser.parse(exportData);
            res.header('Content-Type', 'text/csv');
            res.attachment(`project_${id}.csv`);
            return res.send(csv);
        } else if (format === 'xlsx') {
            const workbook = new ExcelJS.Workbook();
            // Project Info Sheet
            const infoSheet = workbook.addWorksheet('Project Info');
            const infoFields = [
                'name', 'description', 'startDate', 'endDate', 'status', 'priority', 'progress', 'budget', 'confidential', 'complexity', 'department', 'projectCode', 'isFavorite'
            ];
            infoFields.forEach((key, i) => {
                infoSheet.getCell(`A${i + 1}`).value = key.charAt(0).toUpperCase() + key.slice(1);
                infoSheet.getCell(`B${i + 1}`).value = exportData[key] !== undefined ? String(exportData[key]) : '';
            });

            // Helper to add array as sheet
            const addArraySheet = (sheetName, arr, columns) => {
                if (arr && arr.length) {
                    const sheet = workbook.addWorksheet(sheetName);
                    sheet.columns = columns;
                    arr.forEach(item => {
                        sheet.addRow(item);
                    });
                }
            };

            // Team Sheet
            addArraySheet('Team', exportData.team, [
                { header: 'Name', key: 'name', width: 20 },
                { header: 'Role', key: 'role', width: 20 },
                { header: 'Email', key: 'email', width: 25 },
                { header: 'Department', key: 'department', width: 20 },
                { header: 'Status', key: 'status', width: 12 },
            ]);
            // Tags Sheet
            if (exportData.tags && exportData.tags.length) {
                const tagSheet = workbook.addWorksheet('Tags');
                tagSheet.columns = [{ header: 'Tag', key: 'tag', width: 30 }];
                exportData.tags.forEach(tag => tagSheet.addRow({ tag }));
            }
            // Dependencies Sheet
            addArraySheet('Dependencies', exportData.dependencies, [
                { header: 'Source', key: 'sourceName', width: 20 },
                { header: 'Target', key: 'targetName', width: 20 },
                { header: 'Type', key: 'type', width: 15 },
            ]);
            // Activity Log Sheet
            addArraySheet('Activity Log', exportData.activityLog, [
                { header: 'Action', key: 'action', width: 20 },
                { header: 'User', key: 'user', width: 20 },
                { header: 'Time', key: 'time', width: 20 },
                { header: 'Details', key: 'details', width: 40 },
                { header: 'Comment', key: 'comment', width: 40 },
            ]);
            // Tasks Sheet
            addArraySheet('Tasks', exportData.tasks, [
                { header: 'Name', key: 'name', width: 20 },
                { header: 'Status', key: 'status', width: 15 },
                { header: 'Priority', key: 'priority', width: 15 },
                { header: 'Assignee', key: 'assignee', width: 20 },
                { header: 'Due Date', key: 'dueDate', width: 20 },
                { header: 'Progress', key: 'progress', width: 10 },
            ]);
            // Documents Sheet
            addArraySheet('Documents', exportData.documents, [
                { header: 'Name', key: 'name', width: 25 },
                { header: 'Type', key: 'type', width: 15 },
                { header: 'Size', key: 'size', width: 10 },
                { header: 'Uploaded By', key: 'uploadedBy', width: 20 },
                { header: 'Uploaded At', key: 'uploadedAt', width: 20 },
                { header: 'Status', key: 'status', width: 15 },
            ]);
            // Milestones Sheet
            addArraySheet('Milestones', exportData.milestones, [
                { header: 'Title', key: 'title', width: 25 },
                { header: 'Due Date', key: 'dueDate', width: 20 },
                { header: 'Status', key: 'status', width: 15 },
            ]);

            res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.attachment(`project_${id}.xlsx`);
            await workbook.xlsx.write(res);
            res.end();
        } else if (format === 'pdf') {
            const doc = new PDFDocument({ margin: 40 });
            res.header('Content-Type', 'application/pdf');
            res.attachment(`project_${id}.pdf`);
            doc.pipe(res);
            doc.fontSize(20).text('Project Export', { underline: true, align: 'center' });
            doc.moveDown(1.5);

            // Project Info
            doc.fontSize(14).font('Helvetica-Bold').text('Project Information', { underline: true });
            doc.moveDown(0.5);
            const infoFields = [
                'name', 'description', 'startDate', 'endDate', 'status', 'priority', 'progress', 'budget', 'confidential', 'complexity', 'department', 'projectCode', 'isFavorite'
            ];
            infoFields.forEach(key => {
                if (exportData[key] !== undefined) {
                    doc.font('Helvetica-Bold').text(`${key.charAt(0).toUpperCase() + key.slice(1)}: `, { continued: true });
                    doc.font('Helvetica').text(String(exportData[key]));
                }
            });
            doc.moveDown();

            // Tags
            if (exportData.tags && exportData.tags.length) {
                doc.fontSize(14).font('Helvetica-Bold').text('Tags', { underline: true });
                doc.moveDown(0.2);
                doc.fontSize(12).font('Helvetica').list(exportData.tags);
                doc.moveDown();
            }

            // Helper to print array of objects as key-value blocks
            function printArrayBlocks(doc, arr, sectionTitle) {
                doc.fontSize(14).font('Helvetica-Bold').text(sectionTitle, { underline: true });
                doc.moveDown(0.2);
                arr.forEach((item, idx) => {
                    Object.entries(item).forEach(([k, v]) => {
                        if (v !== undefined && v !== null && v !== "") {
                            doc.font('Helvetica-Bold').text(`${k.charAt(0).toUpperCase() + k.slice(1)}: `, { continued: true });
                            doc.font('Helvetica').text(String(v));
                        }
                    });
                    doc.moveDown(0.5);
                });
                doc.moveDown();
            }

            // Team
            if (exportData.team && exportData.team.length) {
                printArrayBlocks(doc, exportData.team, 'Team');
            }
            // Dependencies
            if (exportData.dependencies && exportData.dependencies.length) {
                printArrayBlocks(doc, exportData.dependencies, 'Dependencies');
            }
            // Activity Log
            if (exportData.activityLog && exportData.activityLog.length) {
                printArrayBlocks(doc, exportData.activityLog, 'Activity Log');
            }
            // Tasks
            if (exportData.tasks && exportData.tasks.length) {
                printArrayBlocks(doc, exportData.tasks, 'Tasks');
            }
            // Documents
            if (exportData.documents && exportData.documents.length) {
                printArrayBlocks(doc, exportData.documents, 'Documents');
            }
            // Milestones
            if (exportData.milestones && exportData.milestones.length) {
                printArrayBlocks(doc, exportData.milestones, 'Milestones');
            }

            // Other fields (as fallback)
            const skip = new Set([...infoFields, 'tags', 'team', 'dependencies', 'activityLog', 'tasks', 'documents', 'milestones', '__v', '_id']);
            Object.entries(exportData).forEach(([key, value]) => {
                if (!skip.has(key) && value && typeof value !== 'object') {
                    doc.font('Helvetica-Bold').text(`${key.charAt(0).toUpperCase() + key.slice(1)}: `, { continued: true });
                    doc.font('Helvetica').text(String(value));
                }
            });

            doc.end();
        } else {
            // Default: JSON
            res.header('Content-Type', 'application/json');
            res.attachment(`project_${id}.json`);
            res.send(JSON.stringify(exportData, null, 2));
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add a new task to a project
exports.addProjectTask = async (req, res) => {
    try {
        const { id } = req.params;
        let taskData = req.body;
        // Accept both 'name' and 'title' for the task name
        if (!taskData.name && taskData.title) {
            taskData = { ...taskData, name: taskData.title };
        }
        if (!taskData || !taskData.name) {
            return res.status(400).json({ error: 'Task name is required' });
        }
        // Generate a unique task id
        const taskId = `task_${Date.now()}`;
        const newTask = { ...taskData, id: taskId };
        const project = await Project.findById(id);
        if (!project) return res.status(404).json({ error: 'Project not found' });
        project.tasks.push(newTask);
        await project.save();

        // Log activity
        if (req.user) {
            await ActivityService.logTaskActivity('created', newTask, req.user, project);

            // Additional activity log for project task addition
            await ActivityService.logActivity({
                type: 'project_task_added',
                description: `${req.user.name} added task "${newTask.name}" to project "${project.name}"`,
                userId: req.user._id || req.user.id,
                projectId: project._id,
                meta: {
                    category: 'project',
                    projectId: project._id,
                    projectName: project.name,
                    taskId: newTask.id,
                    taskName: newTask.name,
                    operation: 'add_task'
                }
            });
        }

        res.status(201).json(newTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add a new member to a project
exports.addProjectMember = async (req, res) => {
    try {
        const { id } = req.params;
        const memberData = req.body;
        if (!memberData || !memberData.name) {
            return res.status(400).json({ error: 'Member name is required' });
        }
        // Generate a unique member id if not provided
        const memberId = memberData.id || `TM${Date.now()}`;
        const newMember = { ...memberData, id: memberId };
        const project = await Project.findById(id);
        if (!project) return res.status(404).json({ error: 'Project not found' });
        project.team.push(newMember);
        await project.save();

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'project_member_added',
                description: `${req.user.name} added member "${newMember.name}" to project "${project.name}"`,
                userId: req.user._id || req.user.id,
                projectId: project._id,
                meta: {
                    category: 'project',
                    projectId: project._id,
                    projectName: project.name,
                    memberId: newMember.id,
                    memberName: newMember.name,
                    operation: 'add_member'
                }
            });
        }

        res.status(201).json(newMember);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Upload a document to a project
exports.uploadProjectDocument = async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const { originalname, mimetype, size, filename, path } = req.file;
        const { uploadedBy = 'Unknown', tags = [], status = 'active' } = req.body;
        const newDoc = {
            id: `DOC${Date.now()}`,
            name: originalname,
            type: mimetype.split('/')[1] || 'file',
            size,
            uploadedBy,
            uploadedAt: new Date().toISOString(),
            tags: Array.isArray(tags) ? tags : (tags ? [tags] : []),
            status,
            filePath: path,
            fileName: filename
        };
        const project = await Project.findById(id);
        if (!project) return res.status(404).json({ error: 'Project not found' });
        project.documents.push(newDoc);
        await project.save();

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'project_document_uploaded',
                description: `${req.user.name} uploaded document "${originalname}" to project "${project.name}"`,
                userId: req.user._id || req.user.id,
                projectId: project._id,
                meta: {
                    category: 'project',
                    projectId: project._id,
                    projectName: project.name,
                    documentName: originalname,
                    documentSize: size,
                    operation: 'upload_document'
                }
            });
        }

        res.status(201).json(newDoc);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a task from a project
exports.deleteProjectTask = async (req, res) => {
    try {
        const { id, taskId } = req.params;
        const project = await Project.findById(id);
        if (!project) return res.status(404).json({ error: 'Project not found' });
        const taskIndex = project.tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) return res.status(404).json({ error: 'Task not found' });
        const [deletedTask] = project.tasks.splice(taskIndex, 1);
        await project.save();

        // Log activity
        if (req.user) {
            await ActivityService.logTaskActivity('deleted', deletedTask, req.user, project);

            // Additional activity log for project task deletion
            await ActivityService.logActivity({
                type: 'project_task_deleted',
                description: `${req.user.name} deleted task "${deletedTask.name}" from project "${project.name}"`,
                userId: req.user._id || req.user.id,
                projectId: project._id,
                meta: {
                    category: 'project',
                    projectId: project._id,
                    projectName: project.name,
                    taskId: taskId,
                    taskName: deletedTask.name,
                    operation: 'delete_task'
                }
            });
        }

        res.json({ success: true, deletedTask });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a member from a project
exports.deleteProjectMember = async (req, res) => {
    try {
        const { id, memberId } = req.params;
        const project = await Project.findById(id);
        if (!project) return res.status(404).json({ error: 'Project not found' });
        const memberIndex = project.team.findIndex(m => m.id === memberId);
        if (memberIndex === -1) return res.status(404).json({ error: 'Member not found' });
        const [deletedMember] = project.team.splice(memberIndex, 1);
        await project.save();

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'project_member_deleted',
                description: `${req.user.name} removed member "${deletedMember.name}" from project "${project.name}"`,
                userId: req.user._id || req.user.id,
                projectId: project._id,
                meta: {
                    category: 'project',
                    projectId: project._id,
                    projectName: project.name,
                    memberId: memberId,
                    memberName: deletedMember.name,
                    operation: 'delete_member'
                }
            });
        }

        res.json({ success: true, deletedMember });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a document from a project
exports.deleteProjectDocument = async (req, res) => {
    try {
        const { id, docId } = req.params;
        const project = await Project.findById(id);
        if (!project) return res.status(404).json({ error: 'Project not found' });
        const docIndex = project.documents.findIndex(d => d.id === docId);
        if (docIndex === -1) return res.status(404).json({ error: 'Document not found' });
        const [deletedDoc] = project.documents.splice(docIndex, 1);
        await project.save();

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'project_document_deleted',
                description: `${req.user.name} deleted document "${deletedDoc.name}" from project "${project.name}"`,
                userId: req.user._id || req.user.id,
                projectId: project._id,
                meta: {
                    category: 'project',
                    projectId: project._id,
                    projectName: project.name,
                    documentId: docId,
                    documentName: deletedDoc.name,
                    operation: 'delete_document'
                }
            });
        }

        res.json({ success: true, deletedDoc });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get project statistics
exports.getProjectStats = async (req, res) => {
    try {
        const totalProjects = await Project.countDocuments();
        const activeProjects = await Project.countDocuments({ status: 'In Progress' });
        const completedProjects = await Project.countDocuments({ status: 'Completed' });
        const onHoldProjects = await Project.countDocuments({ status: 'On Hold' });

        const stats = {
            total: totalProjects,
            active: activeProjects,
            completed: completedProjects,
            onHold: onHoldProjects,
            completionRate: totalProjects > 0 ? ((completedProjects / totalProjects) * 100).toFixed(1) : 0
        };

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'project_stats_viewed',
                description: `${req.user.name} viewed project statistics`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'project',
                    operation: 'view_stats'
                }
            });
        }

        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Search projects
exports.searchProjects = async (req, res) => {
    try {
        const { searchTerm, category, status } = req.query;

        const filter = {};

        if (searchTerm) {
            filter.$or = [
                { name: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } },
                { projectCode: { $regex: searchTerm, $options: 'i' } }
            ];
        }

        if (category) {
            filter.category = category;
        }

        if (status) {
            filter.status = status;
        }

        const projects = await Project.find(filter);

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'projects_searched',
                description: `${req.user.name} searched projects with term "${searchTerm}"`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'project',
                    searchTerm: searchTerm,
                    categoryFilter: category,
                    statusFilter: status,
                    resultCount: projects.length,
                    operation: 'search'
                }
            });
        }

        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};