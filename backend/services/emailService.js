const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');

// Simple in-memory queue implementation
class SimpleQueue {
    constructor(options = {}) {
        this.concurrency = options.concurrency || 1;
        this.timeout = options.timeout || 0;
        this.queue = [];
        this.running = 0;
    }

    push(job) {
        this.queue.push(job);
        this.process();
    }

    process() {
        while (this.running < this.concurrency && this.queue.length > 0) {
            const job = this.queue.shift();
            this.running++;

            // Wrap the job in a promise if it's not already
            Promise.resolve()
                .then(() => new Promise((resolve, reject) => {
                    const timeout = this.timeout > 0 ?
                        setTimeout(() => {
                            console.warn('Job timeout warning - job taking longer than expected');
                            // Don't reject immediately, give it more time
                            setTimeout(() => {
                                reject(new Error('Job timeout'));
                            }, 10000); // Additional 10 seconds before rejecting
                        }, this.timeout) :
                        null;

                    job((err, result) => {
                        if (timeout) clearTimeout(timeout);
                        this.running--;
                        this.process();
                        if (err) reject(err);
                        else resolve(result);
                    });
                }))
                .catch(err => {
                    console.error('Queue job error:', err);
                });
        }
    }

    start() {
        // Already started by default
    }

    end() {
        // Clear the queue
        this.queue = [];
    }
}

// Email queue for handling high volume sends
const emailQueue = new SimpleQueue({ concurrency: 5, timeout: 60000 }); // Increased to 60 seconds

// Rate limiting
const rateLimiter = new Map();
const MAX_EMAILS_PER_MINUTE = 10;

class EmailService {
    constructor() {
        this.transporter = null;
        this.initialized = false;
        this.config = null;
    }

    /**
     * Initialize email service
     * @param {Object} config - Email configuration
     */
    async initialize(config) {
        try {
            this.config = {
                provider: config.provider || 'smtp',
                from: config.from || process.env.EMAIL_FROM,
                fromName: config.fromName || process.env.EMAIL_FROM_NAME,
                ...config
            };

            // Validate required configuration
            this.validateConfig();

            // Create transporter based on provider
            this.transporter = await this.createTransporter();
            this.initialized = true;

            console.log('✅ Email service initialized successfully');
            return true;
        } catch (error) {
            console.error('❌ Email service initialization failed:', error.message);
            throw new Error(`Email service initialization failed: ${error.message}`);
        }
    }

    /**
     * Validate email configuration
     */
    validateConfig() {
        if (!this.config) {
            throw new Error('Email configuration is required');
        }

        switch (this.config.provider) {
            case 'smtp':
                if (!this.config.host || !this.config.port) {
                    throw new Error('SMTP host and port are required');
                }
                break;
            case 'sendgrid':
                if (!this.config.apiKey) {
                    throw new Error('SendGrid API key is required');
                }
                break;
            case 'resend':
                if (!this.config.apiKey) {
                    throw new Error('Resend API key is required');
                }
                break;
            default:
                throw new Error(`Unsupported email provider: ${this.config.provider}`);
        }

        if (!this.config.from) {
            throw new Error('Sender email address is required');
        }
    }

    /**
     * Create transporter based on provider
     */
    async createTransporter() {
        switch (this.config.provider) {
            case 'smtp':
                return nodemailer.createTransport({
                    host: this.config.host,
                    port: this.config.port,
                    secure: this.config.secure || false,
                    auth: {
                        user: this.config.username,
                        pass: this.config.password
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });
            case 'sendgrid':
                return nodemailer.createTransport({
                    host: 'smtp.sendgrid.net',
                    port: 587,
                    secure: false,
                    auth: {
                        user: 'apikey',
                        pass: this.config.apiKey
                    }
                });
            case 'resend':
                return nodemailer.createTransport({
                    host: 'smtp.resend.com',
                    port: 587,
                    secure: false,
                    auth: {
                        user: 'resend',
                        pass: this.config.apiKey
                    }
                });
            default:
                throw new Error(`Unsupported email provider: ${this.config.provider}`);
        }
    }

    /**
     * Verify transporter connection
     */
    async verifyConnection() {
        if (!this.initialized || !this.transporter) {
            throw new Error('Email service not initialized');
        }

        try {
            await this.transporter.verify();
            console.log('✅ Email transporter connection verified');
            return true;
        } catch (error) {
            console.error('❌ Email transporter connection failed:', error.message);
            throw new Error(`Email transporter connection failed: ${error.message}`);
        }
    }

    /**
     * Check rate limiting
     * @param {string} identifier - Identifier for rate limiting (email address, IP, etc.)
     */
    checkRateLimit(identifier) {
        const now = Date.now();
        const windowStart = now - 60000; // 1 minute window

        // Clean up old entries
        for (const [key, timestamps] of rateLimiter.entries()) {
            const filtered = timestamps.filter(timestamp => timestamp > windowStart);
            if (filtered.length === 0) {
                rateLimiter.delete(key);
            } else {
                rateLimiter.set(key, filtered);
            }
        }

        // Check current rate
        const timestamps = rateLimiter.get(identifier) || [];
        if (timestamps.length >= MAX_EMAILS_PER_MINUTE) {
            const oldest = Math.min(...timestamps);
            const waitTime = Math.ceil((oldest + 60000 - now) / 1000);
            throw new Error(`Rate limit exceeded. Please wait ${waitTime} seconds before sending another email.`);
        }

        // Add current timestamp
        timestamps.push(now);
        rateLimiter.set(identifier, timestamps);
    }

    /**
     * Send email with retry logic
     * @param {Object} mailOptions - Email options
     * @param {number} maxRetries - Maximum number of retries
     */
    async sendEmail(mailOptions, maxRetries = 3) {
        if (!this.initialized || !this.transporter) {
            throw new Error('Email service not initialized');
        }

        // Apply rate limiting
        if (mailOptions.to) {
            this.checkRateLimit(Array.isArray(mailOptions.to) ? mailOptions.to.join(',') : mailOptions.to);
        }

        // Add default sender if not provided
        if (!mailOptions.from) {
            mailOptions.from = `"${this.config.fromName}" <${this.config.from}>`;
        }

        // Queue the email
        return new Promise((resolve, reject) => {
            emailQueue.push(async (cb) => {
                let lastError;
                for (let attempt = 1; attempt <= maxRetries; attempt++) {
                    try {
                        const info = await this.transporter.sendMail(mailOptions);
                        console.log(`✅ Email sent successfully (attempt ${attempt}/${maxRetries})`, {
                            messageId: info.messageId,
                            to: mailOptions.to
                        });
                        cb(null, info);
                        return resolve(info);
                    } catch (error) {
                        lastError = error;
                        console.error(`❌ Email send attempt ${attempt}/${maxRetries} failed:`, error.message);

                        // Don't retry on certain errors
                        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
                            break;
                        }

                        // Wait before retry (exponential backoff)
                        if (attempt < maxRetries) {
                            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
                        }
                    }
                }

                console.error('❌ Email send failed after all retries:', lastError.message);
                cb(lastError);
                return reject(new Error(`Failed to send email after ${maxRetries} attempts: ${lastError.message}`));
            });
        });
    }

    /**
     * Send notification email
     * @param {Object} options - Notification options
     */
    async sendNotification(options) {
        const { to, subject, message, template, data = {}, priority = 'normal' } = options;

        const mailOptions = {
            to,
            subject,
            priority
        };

        // Use template if provided, otherwise use plain message
        if (template) {
            const { html, text } = await this.renderTemplate(template, data);
            mailOptions.html = html;
            mailOptions.text = text;
        } else {
            mailOptions.text = message;
            mailOptions.html = `<p>${message}</p>`;
        }

        return await this.sendEmail(mailOptions);
    }

    /**
     * Send password reset email
     * @param {Object} user - User object
     * @param {string} resetToken - Password reset token
     * @param {Date} expiresAt - Token expiration date
     */
    async sendPasswordReset(user, resetToken, expiresAt) {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        const mailOptions = {
            to: user.email,
            subject: 'LabTasker Password Reset Request',
            template: 'password-reset',
            data: {
                userName: user.name,
                resetUrl,
                expiresAt: expiresAt.toLocaleString(),
                appName: process.env.APP_NAME
            },
            priority: 'high'
        };

        return await this.sendNotification(mailOptions);
    }

    /**
     * Send user invitation email
     * @param {Object} inviteData - Invitation data
     */
    async sendUserInvitation(inviteData) {
        const { email, inviteToken, invitedBy, role } = inviteData;
        const inviteUrl = `${process.env.FRONTEND_URL}/accept-invite?token=${inviteToken}`;

        const mailOptions = {
            to: email,
            subject: 'LabTasker Account Invitation',
            template: 'user-invitation',
            data: {
                invitedByName: invitedBy.name,
                role,
                inviteUrl,
                appName: process.env.APP_NAME
            },
            priority: 'normal'
        };

        return await this.sendNotification(mailOptions);
    }

    /**
     * Send account confirmation email
     * @param {Object} user - User object
     * @param {string} confirmToken - Confirmation token
     */
    async sendAccountConfirmation(user, confirmToken) {
        const confirmUrl = `${process.env.FRONTEND_URL}/confirm-email?token=${confirmToken}`;

        const mailOptions = {
            to: user.email,
            subject: 'LabTasker Account Confirmation',
            template: 'account-confirmation',
            data: {
                userName: user.name,
                confirmUrl,
                appName: process.env.APP_NAME
            },
            priority: 'normal'
        };

        return await this.sendNotification(mailOptions);
    }

    /**
     * Send welcome email for new users
     * @param {Object} user - User object
     */
    async sendWelcomeEmail(user) {
        const frontendUrl = process.env.FRONTEND_URL;

        const mailOptions = {
            to: user.email,
            subject: `Welcome to ${process.env.APP_NAME}!`,
            template: 'welcome',
            data: {
                userName: user.name,
                appName: process.env.APP_NAME,
                frontendUrl: frontendUrl
            },
            priority: 'normal'
        };

        return await this.sendNotification(mailOptions);
    }

    /**
     * Render email template
     * @param {string} templateName - Template name
     * @param {Object} data - Template data
     */
    async renderTemplate(templateName, data) {
        try {
            // Try to load HTML template
            const htmlTemplatePath = path.join(__dirname, '..', 'templates', 'emails', `${templateName}.html`);
            let html = await fs.readFile(htmlTemplatePath, 'utf8');

            // Try to load text template
            const textTemplatePath = path.join(__dirname, '..', 'templates', 'emails', `${templateName}.txt`);
            let text = '';
            try {
                text = await fs.readFile(textTemplatePath, 'utf8');
            } catch (error) {
                // If text template doesn't exist, generate from HTML
                text = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
            }

            // Replace placeholders with data
            for (const [key, value] of Object.entries(data)) {
                const placeholder = new RegExp(`{{${key}}}`, 'g');
                html = html.replace(placeholder, value);
                text = text.replace(placeholder, value);
            }

            return { html, text };
        } catch (error) {
            console.error(`❌ Failed to render template ${templateName}:`, error.message);
            // Fallback to simple text
            const text = data.message || 'No message content';
            return {
                html: `<p>${text}</p>`,
                text
            };
        }
    }

    /**
     * Process email queue
     */
    startQueue() {
        emailQueue.start();
        console.log('✅ Email queue started');
    }

    /**
     * Stop email queue
     */
    stopQueue() {
        emailQueue.end();
        console.log('✅ Email queue stopped');
    }
}

// Export singleton instance
module.exports = new EmailService();