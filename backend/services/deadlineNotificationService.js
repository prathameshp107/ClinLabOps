const cron = require('node-cron');
const mongoose = require('mongoose');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Notification = require('../models/Notification');
const User = require('../models/User');
const emailService = require('./emailService');

/**
 * Deadline Notification Service
 * Checks for upcoming project and task deadlines and sends notifications
 */

class DeadlineNotificationService {
    constructor() {
        // Schedule daily check at 9:00 AM
        this.schedule = '0 9 * * *'; // Cron expression for daily at 9 AM
    }

    /**
     * Start the deadline notification scheduler
     */
    startScheduler() {
        console.log('Starting deadline notification scheduler...');
        cron.schedule(this.schedule, async () => {
            console.log('Running daily deadline check...');
            await this.checkUpcomingDeadlines();
        });
    }

    /**
     * Check for upcoming deadlines and generate notifications
     */
    async checkUpcomingDeadlines() {
        try {
            const now = new Date();

            // Check for deadlines at different intervals
            const deadlinesToCheck = [
                { days: 1, label: 'tomorrow' },
                { days: 3, label: 'in 3 days' },
                { days: 7, label: 'in a week' }
            ];

            // Check projects
            for (const deadline of deadlinesToCheck) {
                await this.checkProjectDeadlines(now, deadline.days, deadline.label);
            }

            // Check tasks
            for (const deadline of deadlinesToCheck) {
                await this.checkTaskDeadlines(now, deadline.days, deadline.label);
            }

            console.log('Deadline check completed successfully');
        } catch (error) {
            console.error('Error checking deadlines:', error);
        }
    }

    /**
     * Check for upcoming project deadlines
     */
    async checkProjectDeadlines(now, daysAhead, label) {
        try {
            const targetDate = new Date(now);
            targetDate.setDate(targetDate.getDate() + daysAhead);

            // Find projects with end dates matching our target date
            const projects = await Project.find({
                endDate: {
                    $gte: new Date(targetDate.setHours(0, 0, 0, 0)),
                    $lte: new Date(targetDate.setHours(23, 59, 59, 999))
                }
            }).populate('team.id', 'name email');

            console.log(`Found ${projects.length} projects with deadlines ${label}`);

            for (const project of projects) {
                // Create notifications for project owner and team members
                const recipients = new Set();

                // Add project creator/owner
                if (project.createdBy) {
                    recipients.add(project.createdBy.toString());
                }

                // Add team members
                if (project.team && project.team.length > 0) {
                    project.team.forEach(member => {
                        if (member.id) {
                            recipients.add(member.id.toString());
                        }
                    });
                }

                // Create notifications for each recipient
                if (recipients.size > 0) {
                    for (const recipientId of recipients) {
                        // Get user details for email
                        const user = await User.findById(recipientId);
                        if (user) {
                            // Create in-app notification
                            const notification = await this.createDeadlineNotification({
                                recipient: recipientId,
                                title: `Project Deadline Reminder`,
                                message: `Project "${project.name}" deadline is ${label} on ${new Date(project.endDate).toLocaleDateString()}`,
                                type: 'warning',
                                priority: 'high',
                                category: 'project',
                                relatedEntity: {
                                    entityType: 'Project',
                                    entityId: project._id
                                },
                                metadata: {
                                    projectId: project._id,
                                    projectName: project.name,
                                    deadlineType: 'project',
                                    daysAhead: daysAhead
                                }
                            });

                            // Send email notification if user has email notifications enabled
                            if (user.preferences && user.preferences.notifications.email) {
                                try {
                                    await emailService.sendNotification({
                                        to: user.email,
                                        subject: `Project Deadline Reminder: ${project.name}`,
                                        template: 'notification',
                                        data: {
                                            userName: user.name,
                                            subject: `Project Deadline Reminder: ${project.name}`,
                                            message: `Project "${project.name}" deadline is ${label} on ${new Date(project.endDate).toLocaleDateString()}`,
                                            appName: process.env.APP_NAME || 'LabTasker'
                                        },
                                        priority: 'high'
                                    });
                                    console.log(`Email sent for project deadline to ${user.email}`);
                                } catch (emailError) {
                                    console.error(`Failed to send email for project deadline to ${user.email}:`, emailError);
                                }
                            }
                        }
                    }
                } else {
                    console.log(`Skipping project "${project.name}" - no valid recipients found`);
                }
            }
        } catch (error) {
            console.error(`Error checking project deadlines (${daysAhead} days):`, error);
        }
    }

    /**
     * Check for upcoming task deadlines
     */
    async checkTaskDeadlines(now, daysAhead, label) {
        try {
            const targetDate = new Date(now);
            targetDate.setDate(targetDate.getDate() + daysAhead);

            // Find tasks with due dates matching our target date
            const tasks = await Task.find({
                dueDate: {
                    $gte: new Date(targetDate.setHours(0, 0, 0, 0)),
                    $lte: new Date(targetDate.setHours(23, 59, 59, 999))
                }
            }).populate('projectId', 'name projectCode');

            console.log(`Found ${tasks.length} tasks with deadlines ${label}`);

            for (const task of tasks) {
                // Create notifications for task assignee and project team
                const recipients = new Set();

                // Add task assignee (if it's a valid ObjectId)
                if (task.assignee && mongoose.Types.ObjectId.isValid(task.assignee)) {
                    recipients.add(task.assignee.toString());
                }

                // Add task creator (if it's a valid ObjectId)
                if (task.createdBy && mongoose.Types.ObjectId.isValid(task.createdBy)) {
                    recipients.add(task.createdBy.toString());
                }

                // If no valid recipients found, notify a default admin user (if configured)
                if (recipients.size === 0 && process.env.DEFAULT_ADMIN_USER_ID) {
                    recipients.add(process.env.DEFAULT_ADMIN_USER_ID);
                }

                // Create notifications for each recipient
                if (recipients.size > 0) {
                    for (const recipientId of recipients) {
                        // Check if user exists
                        const user = await User.findById(recipientId);
                        if (user) {
                            // Create in-app notification
                            const notification = await this.createDeadlineNotification({
                                recipient: recipientId,
                                title: `Task Deadline Reminder`,
                                message: `Task "${task.title}" is due ${label} on ${new Date(task.dueDate).toLocaleDateString()}`,
                                type: 'warning',
                                priority: 'high',
                                category: 'task',
                                relatedEntity: {
                                    entityType: 'Task',
                                    entityId: task._id
                                },
                                metadata: {
                                    taskId: task._id,
                                    taskTitle: task.title,
                                    projectId: task.projectId?._id,
                                    projectName: task.projectId?.name,
                                    deadlineType: 'task',
                                    daysAhead: daysAhead
                                }
                            });

                            // Send email notification if user has email notifications enabled
                            if (user.preferences && user.preferences.notifications.email) {
                                try {
                                    await emailService.sendNotification({
                                        to: user.email,
                                        subject: `Task Deadline Reminder: ${task.title}`,
                                        template: 'notification',
                                        data: {
                                            userName: user.name,
                                            subject: `Task Deadline Reminder: ${task.title}`,
                                            message: `Task "${task.title}" is due ${label} on ${new Date(task.dueDate).toLocaleDateString()}`,
                                            appName: process.env.APP_NAME || 'LabTasker'
                                        },
                                        priority: 'high'
                                    });
                                    console.log(`Email sent for task deadline to ${user.email}`);
                                } catch (emailError) {
                                    console.error(`Failed to send email for task deadline to ${user.email}:`, emailError);
                                }
                            }
                        }
                    }
                } else {
                    console.log(`Skipping task "${task.title}" - no valid recipients found`);
                }
            }
        } catch (error) {
            console.error(`Error checking task deadlines (${daysAhead} days):`, error);
        }
    }

    /**
     * Create a deadline notification if it doesn't already exist
     */
    async createDeadlineNotification(notificationData) {
        try {
            // Check if notification already exists for this recipient and entity
            const existingNotification = await Notification.findOne({
                recipient: notificationData.recipient,
                'metadata.entityId': notificationData.relatedEntity.entityId,
                'metadata.daysAhead': notificationData.metadata.daysAhead
            });

            if (!existingNotification) {
                const notification = new Notification(notificationData);
                await notification.save();
                console.log(`Created deadline notification for recipient ${notificationData.recipient}`);
                return notification;
            } else {
                console.log(`Notification already exists for recipient ${notificationData.recipient}`);
                return existingNotification;
            }
        } catch (error) {
            console.error('Error creating deadline notification:', error);
            return null;
        }
    }

    /**
     * Manual trigger for testing
     */
    async runManualCheck() {
        console.log('Running manual deadline check...');
        await this.checkUpcomingDeadlines();
        console.log('Manual deadline check completed');
    }
}

module.exports = new DeadlineNotificationService();