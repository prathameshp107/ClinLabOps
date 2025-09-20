const Project = require('../models/Project');
const Task = require('../models/Task');
const Experiment = require('../models/Experiment');
const { InventoryItem } = require('../models/Inventory');
const User = require('../models/User');
const { ComplianceItem, Audit } = require('../models/Compliance');
const { Parser } = require('json2csv');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const ActivityService = require('../services/activityService');

// Generate project report
exports.generateProjectReport = async (req, res) => {
    try {
        const { format = 'json', startDate, endDate, status, department } = req.query;

        const filter = {};
        if (startDate) filter.createdAt = { $gte: new Date(startDate) };
        if (endDate) filter.createdAt = { ...filter.createdAt, $lte: new Date(endDate) };
        if (status) filter.status = status;
        if (department) filter.department = department;

        const projects = await Project.find(filter).lean();

        const reportData = {
            title: 'Project Report',
            generatedAt: new Date(),
            filters: { startDate, endDate, status, department },
            summary: {
                totalProjects: projects.length,
                byStatus: projects.reduce((acc, p) => {
                    acc[p.status] = (acc[p.status] || 0) + 1;
                    return acc;
                }, {}),
                byPriority: projects.reduce((acc, p) => {
                    acc[p.priority] = (acc[p.priority] || 0) + 1;
                    return acc;
                }, {}),
                averageProgress: projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length || 0
            },
            projects
        };

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'report_generated',
                description: `${req.user.name} generated project report`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'report',
                    reportType: 'project',
                    format: format,
                    filters: { startDate, endDate, status, department },
                    operation: 'generate'
                }
            });
        }

        await generateReport(res, reportData, format, 'project_report');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Generate task report
exports.generateTaskReport = async (req, res) => {
    try {
        const { format = 'json', startDate, endDate, status, priority, assignee } = req.query;

        const filter = {};
        if (startDate) filter.createdAt = { $gte: new Date(startDate) };
        if (endDate) filter.createdAt = { ...filter.createdAt, $lte: new Date(endDate) };
        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (assignee) filter.assignee = assignee;

        const tasks = await Task.find(filter).lean();

        const reportData = {
            title: 'Task Report',
            generatedAt: new Date(),
            filters: { startDate, endDate, status, priority, assignee },
            summary: {
                totalTasks: tasks.length,
                byStatus: tasks.reduce((acc, t) => {
                    acc[t.status] = (acc[t.status] || 0) + 1;
                    return acc;
                }, {}),
                byPriority: tasks.reduce((acc, t) => {
                    acc[t.priority] = (acc[t.priority] || 0) + 1;
                    return acc;
                }, {}),
                byAssignee: tasks.reduce((acc, t) => {
                    if (t.assignee) acc[t.assignee] = (acc[t.assignee] || 0) + 1;
                    return acc;
                }, {})
            },
            tasks
        };

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'report_generated',
                description: `${req.user.name} generated task report`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'report',
                    reportType: 'task',
                    format: format,
                    filters: { startDate, endDate, status, priority, assignee },
                    operation: 'generate'
                }
            });
        }

        await generateReport(res, reportData, format, 'task_report');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Generate inventory report
exports.generateInventoryReport = async (req, res) => {
    try {
        const { format = 'json', category, status, location } = req.query;

        const filter = {};
        if (category) filter.category = category;
        if (status) filter.status = status;
        if (location) filter.location = location;

        const items = await InventoryItem.find(filter).lean();

        const reportData = {
            title: 'Inventory Report',
            generatedAt: new Date(),
            filters: { category, status, location },
            summary: {
                totalItems: items.length,
                totalValue: items.reduce((sum, item) => sum + (item.currentStock * item.cost || 0), 0),
                byCategory: items.reduce((acc, item) => {
                    acc[item.category] = (acc[item.category] || 0) + 1;
                    return acc;
                }, {}),
                byStatus: items.reduce((acc, item) => {
                    acc[item.status] = (acc[item.status] || 0) + 1;
                    return acc;
                }, {}),
                lowStockItems: items.filter(item => item.currentStock <= item.minStock).length
            },
            items
        };

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'report_generated',
                description: `${req.user.name} generated inventory report`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'report',
                    reportType: 'inventory',
                    format: format,
                    filters: { category, status, location },
                    operation: 'generate'
                }
            });
        }

        await generateReport(res, reportData, format, 'inventory_report');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Generate user report
exports.generateUserReport = async (req, res) => {
    try {
        const { format = 'json', department, status, role } = req.query;

        const filter = {};
        if (department) filter.department = department;
        if (status) filter.status = status;
        if (role) filter.roles = { $in: [role] };

        const users = await User.find(filter).select('-password').lean();

        const reportData = {
            title: 'User Report',
            generatedAt: new Date(),
            filters: { department, status, role },
            summary: {
                totalUsers: users.length,
                byStatus: users.reduce((acc, user) => {
                    acc[user.status] = (acc[user.status] || 0) + 1;
                    return acc;
                }, {}),
                byDepartment: users.reduce((acc, user) => {
                    if (user.department) acc[user.department] = (acc[user.department] || 0) + 1;
                    return acc;
                }, {}),
                byRole: users.reduce((acc, user) => {
                    if (user.roles) {
                        user.roles.forEach(role => {
                            acc[role] = (acc[role] || 0) + 1;
                        });
                    }
                    return acc;
                }, {})
            },
            users
        };

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'report_generated',
                description: `${req.user.name} generated user report`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'report',
                    reportType: 'user',
                    format: format,
                    filters: { department, status, role },
                    operation: 'generate'
                }
            });
        }

        await generateReport(res, reportData, format, 'user_report');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Generate compliance report
exports.generateComplianceReport = async (req, res) => {
    try {
        const { format = 'json', status, category, dueDate } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (category) filter.category = category;
        if (dueDate) filter.dueDate = { $lte: new Date(dueDate) };

        const complianceItems = await ComplianceItem.find(filter).lean();

        const reportData = {
            title: 'Compliance Report',
            generatedAt: new Date(),
            filters: { status, category, dueDate },
            summary: {
                totalItems: complianceItems.length,
                byStatus: complianceItems.reduce((acc, item) => {
                    acc[item.status] = (acc[item.status] || 0) + 1;
                    return acc;
                }, {}),
                byCategory: complianceItems.reduce((acc, item) => {
                    acc[item.category] = (acc[item.category] || 0) + 1;
                    return acc;
                }, {}),
                overdueItems: complianceItems.filter(item =>
                    item.status !== 'Completed' && new Date(item.dueDate) < new Date()
                ).length
            },
            complianceItems
        };

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'report_generated',
                description: `${req.user.name} generated compliance report`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'report',
                    reportType: 'compliance',
                    format: format,
                    filters: { status, category, dueDate },
                    operation: 'generate'
                }
            });
        }

        await generateReport(res, reportData, format, 'compliance_report');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Generate audit report (was experiments)
exports.generateAuditReport = async (req, res) => {
    try {
        const { format = 'json', status, auditor, startDate, endDate } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (auditor) filter.auditor = auditor;
        if (startDate) filter.scheduledDate = { $gte: new Date(startDate) };
        if (endDate) filter.scheduledDate = { ...filter.scheduledDate, $lte: new Date(endDate) };

        const audits = await Audit.find(filter).lean();

        const reportData = {
            title: 'Audit Report',
            generatedAt: new Date(),
            filters: { status, auditor, startDate, endDate },
            summary: {
                totalAudits: audits.length,
                byStatus: audits.reduce((acc, audit) => {
                    acc[audit.status] = (acc[audit.status] || 0) + 1;
                    return acc;
                }, {}),
                byAuditor: audits.reduce((acc, audit) => {
                    if (audit.auditor) acc[audit.auditor] = (acc[audit.auditor] || 0) + 1;
                    return acc;
                }, {}),
                upcomingAudits: audits.filter(audit =>
                    audit.status === 'Scheduled' && new Date(audit.scheduledDate) >= new Date()
                ).length
            },
            audits
        };

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'report_generated',
                description: `${req.user.name} generated audit report`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'report',
                    reportType: 'audit',
                    format: format,
                    filters: { status, auditor, startDate, endDate },
                    operation: 'generate'
                }
            });
        }

        await generateReport(res, reportData, format, 'audit_report');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Generate experiment report (was dashboard)
exports.generateExperimentReport = async (req, res) => {
    try {
        const { format = 'json', status, researcher, startDate, endDate } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (researcher) filter.researcher = researcher;
        if (startDate) filter.createdAt = { $gte: new Date(startDate) };
        if (endDate) filter.createdAt = { ...filter.createdAt, $lte: new Date(endDate) };

        const experiments = await Experiment.find(filter).lean();

        const reportData = {
            title: 'Experiment Report',
            generatedAt: new Date(),
            filters: { status, researcher, startDate, endDate },
            summary: {
                totalExperiments: experiments.length,
                byStatus: experiments.reduce((acc, exp) => {
                    acc[exp.status] = (acc[exp.status] || 0) + 1;
                    return acc;
                }, {}),
                byResearcher: experiments.reduce((acc, exp) => {
                    if (exp.researcher) acc[exp.researcher] = (acc[exp.researcher] || 0) + 1;
                    return acc;
                }, {}),
                averageDuration: experiments.length > 0 ?
                    experiments.reduce((sum, exp) => sum + (exp.duration || 0), 0) / experiments.length : 0
            },
            experiments
        };

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'report_generated',
                description: `${req.user.name} generated experiment report`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'report',
                    reportType: 'experiment',
                    format: format,
                    filters: { status, researcher, startDate, endDate },
                    operation: 'generate'
                }
            });
        }

        await generateReport(res, reportData, format, 'experiment_report');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Generic report generation function
async function generateReport(res, reportData, format, filename) {
    try {
        if (format === 'csv') {
            const parser = new Parser();
            const csv = parser.parse(reportData);
            res.header('Content-Type', 'text/csv');
            res.attachment(`${filename}.csv`);
            return res.send(csv);
        } else if (format === 'xlsx') {
            const workbook = new ExcelJS.Workbook();
            // Report Info Sheet
            const infoSheet = workbook.addWorksheet('Report Info');
            infoSheet.getCell('A1').value = 'Title';
            infoSheet.getCell('B1').value = reportData.title;
            infoSheet.getCell('A2').value = 'Generated At';
            infoSheet.getCell('B2').value = reportData.generatedAt.toISOString();

            // Summary Sheet
            const summarySheet = workbook.addWorksheet('Summary');
            let row = 1;
            for (const [key, value] of Object.entries(reportData.summary)) {
                summarySheet.getCell(`A${row}`).value = key;
                summarySheet.getCell(`B${row}`).value = typeof value === 'object' ? JSON.stringify(value) : value;
                row++;
            }

            // Data Sheet
            if (reportData.projects) {
                const dataSheet = workbook.addWorksheet('Projects');
                if (reportData.projects.length > 0) {
                    const headers = Object.keys(reportData.projects[0]);
                    dataSheet.addRow(headers);
                    reportData.projects.forEach(project => {
                        const row = headers.map(header => project[header]);
                        dataSheet.addRow(row);
                    });
                }
            } else if (reportData.tasks) {
                const dataSheet = workbook.addWorksheet('Tasks');
                if (reportData.tasks.length > 0) {
                    const headers = Object.keys(reportData.tasks[0]);
                    dataSheet.addRow(headers);
                    reportData.tasks.forEach(task => {
                        const row = headers.map(header => task[header]);
                        dataSheet.addRow(row);
                    });
                }
            } else if (reportData.items) {
                const dataSheet = workbook.addWorksheet('Items');
                if (reportData.items.length > 0) {
                    const headers = Object.keys(reportData.items[0]);
                    dataSheet.addRow(headers);
                    reportData.items.forEach(item => {
                        const row = headers.map(header => item[header]);
                        dataSheet.addRow(row);
                    });
                }
            } else if (reportData.users) {
                const dataSheet = workbook.addWorksheet('Users');
                if (reportData.users.length > 0) {
                    const headers = Object.keys(reportData.users[0]);
                    dataSheet.addRow(headers);
                    reportData.users.forEach(user => {
                        const row = headers.map(header => user[header]);
                        dataSheet.addRow(row);
                    });
                }
            } else if (reportData.audits) {
                const dataSheet = workbook.addWorksheet('Audits');
                if (reportData.audits.length > 0) {
                    const headers = Object.keys(reportData.audits[0]);
                    dataSheet.addRow(headers);
                    reportData.audits.forEach(audit => {
                        const row = headers.map(header => audit[header]);
                        dataSheet.addRow(row);
                    });
                }
            } else if (reportData.experiments) {
                const dataSheet = workbook.addWorksheet('Experiments');
                if (reportData.experiments.length > 0) {
                    const headers = Object.keys(reportData.experiments[0]);
                    dataSheet.addRow(headers);
                    reportData.experiments.forEach(experiment => {
                        const row = headers.map(header => experiment[header]);
                        dataSheet.addRow(row);
                    });
                }
            }

            res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.attachment(`${filename}.xlsx`);
            await workbook.xlsx.write(res);
            res.end();
        } else if (format === 'pdf') {
            const doc = new PDFDocument({ margin: 50 });
            res.header('Content-Type', 'application/pdf');
            res.attachment(`${filename}.pdf`);
            doc.pipe(res);

            // Title
            doc.fontSize(20).text(reportData.title, { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).text(`Generated: ${reportData.generatedAt.toISOString()}`, { align: 'center' });
            doc.moveDown(2);

            // Summary
            doc.fontSize(16).text('Summary', { underline: true });
            doc.moveDown();
            for (const [key, value] of Object.entries(reportData.summary)) {
                doc.fontSize(12).text(`${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`);
                doc.moveDown();
            }
            doc.moveDown(2);

            // Data
            if (reportData.projects) {
                doc.fontSize(16).text('Projects', { underline: true });
                doc.moveDown();
                reportData.projects.forEach((project, index) => {
                    doc.fontSize(12).text(`${index + 1}. ${project.name || project.title || 'Untitled'}`);
                    doc.fontSize(10).text(`   Status: ${project.status}, Priority: ${project.priority}`);
                    doc.moveDown();
                });
            } else if (reportData.tasks) {
                doc.fontSize(16).text('Tasks', { underline: true });
                doc.moveDown();
                reportData.tasks.forEach((task, index) => {
                    doc.fontSize(12).text(`${index + 1}. ${task.title || task.name || 'Untitled'}`);
                    doc.fontSize(10).text(`   Status: ${task.status}, Priority: ${task.priority}`);
                    doc.moveDown();
                });
            }

            doc.end();
        } else {
            // Default: JSON
            res.header('Content-Type', 'application/json');
            res.attachment(`${filename}.json`);
            res.send(JSON.stringify(reportData, null, 2));
        }
    } catch (err) {
        throw new Error(`Failed to generate ${format} report: ${err.message}`);
    }
}