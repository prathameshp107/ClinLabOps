const Project = require('../models/Project');
const Task = require('../models/Task');
const Experiment = require('../models/Experiment');
const { InventoryItem } = require('../models/Inventory');
const User = require('../models/User');
const Notification = require('../models/Notification');
const ActivityService = require('../services/activityService');

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

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'dashboard_viewed',
                description: `${req.user.name} viewed dashboard`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'system',
                    operation: 'view_dashboard'
                }
            });
        }

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

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'task_distribution_viewed',
                description: `${req.user.name} viewed task distribution`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'system',
                    operation: 'view_task_distribution'
                }
            });
        }

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

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'recent_activities_viewed',
                description: `${req.user.name} viewed recent activities`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'system',
                    operation: 'view_recent_activities'
                }
            });
        }

        res.json(activities.slice(0, limit));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get team performance data
exports.getTeamPerformance = async (req, res) => {
    try {
        // Get tasks grouped by assignee
        const tasksByAssignee = await Task.aggregate([
            { $match: { assignee: { $exists: true, $ne: null } } },
            { $group: { _id: '$assignee', totalTasks: { $sum: 1 }, completedTasks: { $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] } } } },
            { $sort: { totalTasks: -1 } },
            { $limit: 10 }
        ]);

        // Get projects grouped by department
        const projectsByDepartment = await Project.aggregate([
            { $match: { department: { $exists: true, $ne: null } } },
            { $group: { _id: '$department', totalProjects: { $sum: 1 }, activeProjects: { $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] } } } },
            { $sort: { totalProjects: -1 } }
        ]);

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'team_performance_viewed',
                description: `${req.user.name} viewed team performance data`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'system',
                    operation: 'view_team_performance'
                }
            });
        }

        res.json({
            tasksByAssignee,
            projectsByDepartment
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get system health data
exports.getSystemHealth = async (req, res) => {
    try {
        // Get database stats
        const dbStats = await Project.db.stats();

        // Get recent error logs (this would typically come from a logging system)
        const recentErrors = [];

        // Get system metrics
        const uptime = process.uptime();
        const memoryUsage = process.memoryUsage();
        const cpuUsage = process.cpuUsage();

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'system_health_viewed',
                description: `${req.user.name} viewed system health data`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'system',
                    operation: 'view_system_health'
                }
            });
        }

        res.json({
            dbStats,
            recentErrors,
            uptime,
            memoryUsage,
            cpuUsage
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get user activity timeline
exports.getUserActivityTimeline = async (req, res) => {
    try {
        const { days = 30 } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        // Get user activity data
        const userActivity = await User.aggregate([
            { $match: { lastLogin: { $gte: startDate } } },
            { $project: { name: 1, email: 1, lastLogin: 1, createdAt: 1 } },
            { $sort: { lastLogin: -1 } }
        ]);

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'user_activity_timeline_viewed',
                description: `${req.user.name} viewed user activity timeline`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'system',
                    operation: 'view_user_activity'
                }
            });
        }

        res.json(userActivity);
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

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'compliance_alerts_viewed',
                description: `${req.user.name} viewed compliance alerts`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'system',
                    operation: 'view_compliance_alerts'
                }
            });
        }

        res.json(alerts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get system logs (mock data for now)
exports.getSystemLogs = async (req, res) => {
    try {
        const { page = 1, limit = 20, level } = req.query;

        // Get recent activities from the database to create realistic logs
        const recentActivities = await ActivityService.getActivityFeed(20);

        // Transform activities into log format
        const logs = recentActivities.map((activity, index) => ({
            id: activity._id || index,
            timestamp: activity.timestamp || activity.createdAt || new Date(),
            level: activity.type === 'error' ? 'error' :
                activity.type === 'warning' ? 'warning' : 'info',
            message: activity.description || activity.title || 'System activity',
            source: activity.meta?.category || 'system',
            details: activity.details || '',
            user: activity.userId || activity.user || 'System',
            category: activity.type || 'general',
            action: activity.type || 'activity'
        }));

        // Add some system-level logs if we don't have enough
        if (logs.length < 5) {
            logs.push({
                id: 'sys-1',
                timestamp: new Date(),
                level: 'info',
                message: 'System startup completed',
                source: 'system',
                details: 'All services initialized successfully',
                user: 'System',
                category: 'system',
                action: 'startup'
            });

            logs.push({
                id: 'sys-2',
                timestamp: new Date(Date.now() - 60000),
                level: 'info',
                message: 'Database connection established',
                source: 'database',
                details: 'Connected to MongoDB successfully',
                user: 'System',
                category: 'system',
                action: 'database'
            });
        }

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'system_logs_viewed',
                description: `${req.user.name} viewed system logs`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'system',
                    operation: 'view_system_logs'
                }
            });
        }

        res.json({
            logs: logs.slice(0, limit),
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

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'task_heatmap_viewed',
                description: `${req.user.name} viewed task heatmap`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'system',
                    operation: 'view_task_heatmap'
                }
            });
        }

        res.json(heatmapData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};