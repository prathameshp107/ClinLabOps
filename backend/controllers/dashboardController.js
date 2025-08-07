const Project = require('../models/Project');
const Task = require('../models/Task');
const Experiment = require('../models/Experiment');
const { InventoryItem } = require('../models/Inventory');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Get dashboard overview stats
exports.getDashboardStats = async (req, res) => {
    try {
        // Basic counts
        const totalProjects = await Project.countDocuments();
        const activeProjects = await Project.countDocuments({ status: 'In Progress' });
        const totalTasks = await Task.countDocuments();
        const completedTasks = await Task.countDocuments({ status: 'done' });
        const totalExperiments = await Experiment.countDocuments();
        const activeExperiments = await Experiment.countDocuments({ status: 'in-progress' });
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ status: 'Active' });

        // Inventory stats
        const totalInventoryItems = await InventoryItem.countDocuments();
        const lowStockItems = await InventoryItem.countDocuments({
            $expr: { $lte: ['$currentStock', '$minStock'] }
        });

        // Recent activity counts
        const recentProjects = await Project.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        });
        const recentTasks = await Task.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        });

        res.json({
            projects: {
                total: totalProjects,
                active: activeProjects,
                recent: recentProjects,
                completionRate: totalProjects > 0 ? ((totalProjects - activeProjects) / totalProjects * 100).toFixed(1) : 0
            },
            tasks: {
                total: totalTasks,
                completed: completedTasks,
                recent: recentTasks,
                completionRate: totalTasks > 0 ? (completedTasks / totalTasks * 100).toFixed(1) : 0
            },
            experiments: {
                total: totalExperiments,
                active: activeExperiments,
                completionRate: totalExperiments > 0 ? ((totalExperiments - activeExperiments) / totalExperiments * 100).toFixed(1) : 0
            },
            users: {
                total: totalUsers,
                active: activeUsers
            },
            inventory: {
                total: totalInventoryItems,
                lowStock: lowStockItems,
                stockAlert: lowStockItems > 0
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get task distribution data
exports.getTaskDistribution = async (req, res) => {
    try {
        const tasksByStatus = await Task.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const tasksByPriority = await Task.aggregate([
            { $group: { _id: '$priority', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.json({
            byStatus: tasksByStatus,
            byPriority: tasksByPriority
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get recent activities
exports.getRecentActivities = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        // Get recent projects
        const recentProjects = await Project.find()
            .sort({ updatedAt: -1 })
            .limit(5)
            .select('name status updatedAt');

        // Get recent tasks
        const recentTasks = await Task.find()
            .sort({ updatedAt: -1 })
            .limit(5)
            .select('title status updatedAt assignee');

        // Get recent experiments
        const recentExperiments = await Experiment.find()
            .sort({ updatedAt: -1 })
            .limit(5)
            .select('title status updatedAt');

        // Combine and format activities
        const activities = [];

        recentProjects.forEach(project => {
            activities.push({
                id: project._id,
                type: 'project',
                title: `Project "${project.name}" updated`,
                description: `Status: ${project.status}`,
                timestamp: project.updatedAt,
                icon: 'folder'
            });
        });

        recentTasks.forEach(task => {
            activities.push({
                id: task._id,
                type: 'task',
                title: `Task "${task.title}" updated`,
                description: `Status: ${task.status}${task.assignee ? ` | Assigned to: ${task.assignee}` : ''}`,
                timestamp: task.updatedAt,
                icon: 'check-square'
            });
        });

        recentExperiments.forEach(experiment => {
            activities.push({
                id: experiment._id,
                type: 'experiment',
                title: `Experiment "${experiment.title}" updated`,
                description: `Status: ${experiment.status}`,
                timestamp: experiment.updatedAt,
                icon: 'flask'
            });
        });

        // Sort by timestamp and limit
        activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        res.json(activities.slice(0, limit));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get team performance data
exports.getTeamPerformance = async (req, res) => {
    try {
        // Get task completion by assignee
        const taskPerformance = await Task.aggregate([
            { $match: { assignee: { $ne: null, $ne: '' } } },
            {
                $group: {
                    _id: '$assignee',
                    totalTasks: { $sum: 1 },
                    completedTasks: {
                        $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] }
                    }
                }
            },
            {
                $project: {
                    assignee: '$_id',
                    totalTasks: 1,
                    completedTasks: 1,
                    completionRate: {
                        $multiply: [
                            { $divide: ['$completedTasks', '$totalTasks'] },
                            100
                        ]
                    }
                }
            },
            { $sort: { completionRate: -1 } },
            { $limit: 10 }
        ]);

        res.json(taskPerformance);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get project health data
exports.getProjectHealth = async (req, res) => {
    try {
        const projects = await Project.find()
            .select('name status progress startDate endDate priority')
            .sort({ updatedAt: -1 });

        const projectHealth = projects.map(project => {
            const now = new Date();
            const endDate = new Date(project.endDate);
            const startDate = new Date(project.startDate);
            const totalDuration = endDate - startDate;
            const elapsed = now - startDate;
            const timeProgress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

            let health = 'good';
            if (project.progress < timeProgress - 20) {
                health = 'poor';
            } else if (project.progress < timeProgress - 10) {
                health = 'warning';
            }

            return {
                id: project._id,
                name: project.name,
                status: project.status,
                progress: project.progress || 0,
                timeProgress: Math.round(timeProgress),
                priority: project.priority,
                health,
                daysRemaining: Math.ceil((endDate - now) / (1000 * 60 * 60 * 24))
            };
        });

        res.json(projectHealth);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get experiment progress data
exports.getExperimentProgress = async (req, res) => {
    try {
        const experiments = await Experiment.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        const totalExperiments = await Experiment.countDocuments();

        const progressData = experiments.map(exp => ({
            status: exp._id,
            count: exp.count,
            percentage: totalExperiments > 0 ? ((exp.count / totalExperiments) * 100).toFixed(1) : 0
        }));

        res.json(progressData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get user activity data
exports.getUserActivity = async (req, res) => {
    try {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        // Get daily user registrations for the last 30 days
        const userActivity = await User.aggregate([
            { $match: { createdAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                        day: { $dayOfMonth: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
        ]);

        // Format data for charts
        const formattedData = userActivity.map(item => ({
            date: `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`,
            users: item.count
        }));

        res.json(formattedData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get compliance alerts
exports.getComplianceAlerts = async (req, res) => {
    try {
        const alerts = [];

        // Check for expiring inventory items
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        const expiringItems = await InventoryItem.find({
            expiryDate: { $lte: thirtyDaysFromNow, $gte: new Date() }
        }).limit(5);

        expiringItems.forEach(item => {
            alerts.push({
                id: `exp-${item._id}`,
                type: 'warning',
                title: 'Item Expiring Soon',
                message: `${item.name} expires on ${item.expiryDate.toDateString()}`,
                category: 'inventory',
                priority: 'medium',
                createdAt: new Date()
            });
        });

        // Check for overdue tasks
        const overdueTasks = await Task.find({
            dueDate: { $lt: new Date() },
            status: { $ne: 'done' }
        }).limit(5);

        overdueTasks.forEach(task => {
            alerts.push({
                id: `task-${task._id}`,
                type: 'error',
                title: 'Overdue Task',
                message: `Task "${task.title}" is overdue`,
                category: 'task',
                priority: 'high',
                createdAt: new Date()
            });
        });

        // Check for low stock items
        const lowStockItems = await InventoryItem.find({
            $expr: { $lte: ['$currentStock', '$minStock'] }
        }).limit(5);

        lowStockItems.forEach(item => {
            alerts.push({
                id: `stock-${item._id}`,
                type: 'warning',
                title: 'Low Stock Alert',
                message: `${item.name} is running low (${item.currentStock} ${item.unit} remaining)`,
                category: 'inventory',
                priority: 'medium',
                createdAt: new Date()
            });
        });

        // Sort by priority and date
        alerts.sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            }
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        res.json(alerts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get system logs (mock data for now)
exports.getSystemLogs = async (req, res) => {
    try {
        const { page = 1, limit = 20, level } = req.query;

        // This would typically come from a proper logging system
        // For now, return mock data based on recent database activities
        const logs = [
            {
                id: '1',
                timestamp: new Date(),
                level: 'info',
                message: 'System startup completed',
                source: 'system',
                details: 'All services initialized successfully'
            },
            {
                id: '2',
                timestamp: new Date(Date.now() - 60000),
                level: 'info',
                message: 'Database connection established',
                source: 'database',
                details: 'Connected to MongoDB successfully'
            }
        ];

        res.json({
            logs,
            totalPages: 1,
            currentPage: parseInt(page),
            total: logs.length
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get task heatmap data
exports.getTaskHeatmap = async (req, res) => {
    try {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const taskActivity = await Task.aggregate([
            { $match: { createdAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                        day: { $dayOfMonth: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
        ]);

        // Format data for heatmap
        const heatmapData = taskActivity.map(item => ({
            date: `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`,
            count: item.count
        }));

        res.json(heatmapData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};