const Project = require('../models/Project');
const Task = require('../models/Task');
const Experiment = require('../models/Experiment');
const { InventoryItem } = require('../models/Inventory');
const User = require('../models/User');
const { ComplianceItem, Audit } = require('../models/Compliance');
const { Parser } = require('json2csv');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

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
                    user.roles?.forEach(role => {
                        acc[role] = (acc[role] || 0) + 1;
                    });
                    return acc;
                }, {})
            },
            users
        };

        await generateReport(res, reportData, format, 'user_report');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Generate compliance report
exports.generateComplianceReport = async (req, res) => {
    try {
        const { format = 'json', category, status, priority } = req.query;

        const filter = {};
        if (category) filter.category = category;
        if (status) filter.status = status;
        if (priority) filter.priority = priority;

        const items = await ComplianceItem.find(filter)
            .populate('assignedTo', 'name email')
            .lean();

        const audits = await Audit.find({}).lean();

        const reportData = {
            title: 'Compliance Report',
            generatedAt: new Date(),
            filters: { category, status, priority },
            summary: {
                totalItems: items.length,
                byStatus: items.reduce((acc, item) => {
                    acc[item.status] = (acc[item.status] || 0) + 1;
                    return acc;
                }, {}),
                byCategory: items.reduce((acc, item) => {
                    acc[item.category] = (acc[item.category] || 0) + 1;
                    return acc;
                }, {}),
                byPriority: items.reduce((acc, item) => {
                    acc[item.priority] = (acc[item.priority] || 0) + 1;
                    return acc;
                }, {}),
                totalAudits: audits.length,
                complianceRate: items.length > 0 ?
                    ((items.filter(item => item.status === 'Compliant').length / items.length) * 100).toFixed(1) : 0
            },
            items,
            audits
        };

        await generateReport(res, reportData, format, 'compliance_report');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Generate experiment report
exports.generateExperimentReport = async (req, res) => {
    try {
        const { format = 'json', startDate, endDate, status, priority } = req.query;

        const filter = {};
        if (startDate) filter.startDate = { $gte: new Date(startDate) };
        if (endDate) filter.endDate = { ...filter.endDate, $lte: new Date(endDate) };
        if (status) filter.status = status;
        if (priority) filter.priority = priority;

        const experiments = await Experiment.find(filter)
            .populate('createdBy', 'name email')
            .lean();

        const reportData = {
            title: 'Experiment Report',
            generatedAt: new Date(),
            filters: { startDate, endDate, status, priority },
            summary: {
                totalExperiments: experiments.length,
                byStatus: experiments.reduce((acc, exp) => {
                    acc[exp.status] = (acc[exp.status] || 0) + 1;
                    return acc;
                }, {}),
                byPriority: experiments.reduce((acc, exp) => {
                    acc[exp.priority] = (acc[exp.priority] || 0) + 1;
                    return acc;
                }, {}),
                completionRate: experiments.length > 0 ?
                    ((experiments.filter(exp => exp.status === 'completed').length / experiments.length) * 100).toFixed(1) : 0
            },
            experiments
        };

        await generateReport(res, reportData, format, 'experiment_report');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Generate dashboard summary report
exports.generateDashboardReport = async (req, res) => {
    try {
        const { format = 'json' } = req.query;

        const [
            totalProjects,
            totalTasks,
            totalExperiments,
            totalUsers,
            totalInventoryItems,
            totalComplianceItems
        ] = await Promise.all([
            Project.countDocuments(),
            Task.countDocuments(),
            Experiment.countDocuments(),
            User.countDocuments(),
            InventoryItem.countDocuments(),
            ComplianceItem.countDocuments()
        ]);

        const [
            activeProjects,
            completedTasks,
            activeExperiments,
            activeUsers,
            lowStockItems,
            compliantItems
        ] = await Promise.all([
            Project.countDocuments({ status: 'In Progress' }),
            Task.countDocuments({ status: 'done' }),
            Experiment.countDocuments({ status: 'in-progress' }),
            User.countDocuments({ status: 'Active' }),
            InventoryItem.countDocuments({ $expr: { $lte: ['$currentStock', '$minStock'] } }),
            ComplianceItem.countDocuments({ status: 'Compliant' })
        ]);

        const reportData = {
            title: 'Dashboard Summary Report',
            generatedAt: new Date(),
            summary: {
                projects: {
                    total: totalProjects,
                    active: activeProjects,
                    completionRate: totalProjects > 0 ? (((totalProjects - activeProjects) / totalProjects) * 100).toFixed(1) : 0
                },
                tasks: {
                    total: totalTasks,
                    completed: completedTasks,
                    completionRate: totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0
                },
                experiments: {
                    total: totalExperiments,
                    active: activeExperiments,
                    completionRate: totalExperiments > 0 ? (((totalExperiments - activeExperiments) / totalExperiments) * 100).toFixed(1) : 0
                },
                users: {
                    total: totalUsers,
                    active: activeUsers,
                    activeRate: totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(1) : 0
                },
                inventory: {
                    total: totalInventoryItems,
                    lowStock: lowStockItems,
                    stockHealthRate: totalInventoryItems > 0 ? (((totalInventoryItems - lowStockItems) / totalInventoryItems) * 100).toFixed(1) : 0
                },
                compliance: {
                    total: totalComplianceItems,
                    compliant: compliantItems,
                    complianceRate: totalComplianceItems > 0 ? ((compliantItems / totalComplianceItems) * 100).toFixed(1) : 0
                }
            }
        };

        await generateReport(res, reportData, format, 'dashboard_summary');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Helper function to generate reports in different formats
async function generateReport(res, data, format, filename) {
    if (format === 'csv') {
        const parser = new Parser();
        const csv = parser.parse(data);
        res.header('Content-Type', 'text/csv');
        res.attachment(`${filename}.csv`);
        return res.send(csv);
    } else if (format === 'xlsx') {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Report');

        // Add title
        worksheet.addRow([data.title]);
        worksheet.addRow([`Generated: ${data.generatedAt}`]);
        worksheet.addRow([]);

        // Add summary
        if (data.summary) {
            worksheet.addRow(['Summary']);
            Object.entries(data.summary).forEach(([key, value]) => {
                if (typeof value === 'object') {
                    worksheet.addRow([key]);
                    Object.entries(value).forEach(([subKey, subValue]) => {
                        worksheet.addRow([`  ${subKey}`, subValue]);
                    });
                } else {
                    worksheet.addRow([key, value]);
                }
            });
            worksheet.addRow([]);
        }

        // Add data
        const dataKey = Object.keys(data).find(key =>
            Array.isArray(data[key]) && key !== 'filters'
        );

        if (dataKey && data[dataKey].length > 0) {
            const headers = Object.keys(data[dataKey][0]);
            worksheet.addRow(headers);

            data[dataKey].forEach(item => {
                const row = headers.map(header => {
                    const value = item[header];
                    return typeof value === 'object' ? JSON.stringify(value) : value;
                });
                worksheet.addRow(row);
            });
        }

        res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.attachment(`${filename}.xlsx`);
        await workbook.xlsx.write(res);
        return res.end();
    } else if (format === 'pdf') {
        const doc = new PDFDocument({ margin: 40 });
        res.header('Content-Type', 'application/pdf');
        res.attachment(`${filename}.pdf`);
        doc.pipe(res);

        // Add title
        doc.fontSize(20).text(data.title, { align: 'center' });
        doc.fontSize(12).text(`Generated: ${data.generatedAt}`, { align: 'center' });
        doc.moveDown(2);

        // Add summary
        if (data.summary) {
            doc.fontSize(16).text('Summary', { underline: true });
            doc.moveDown(0.5);

            Object.entries(data.summary).forEach(([key, value]) => {
                if (typeof value === 'object') {
                    doc.fontSize(14).text(key, { underline: true });
                    Object.entries(value).forEach(([subKey, subValue]) => {
                        doc.fontSize(12).text(`${subKey}: ${subValue}`);
                    });
                    doc.moveDown(0.5);
                } else {
                    doc.fontSize(12).text(`${key}: ${value}`);
                }
            });
        }

        doc.end();
    } else {
        // Default to JSON
        res.json(data);
    }
}