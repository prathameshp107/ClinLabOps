# LabTasker Email Service

## Overview

The LabTasker Email Service is a centralized email management system that handles all email communications within the application. It supports multiple email providers, provides robust error handling, and includes features like queuing, rate limiting, and retry logic.

## Features

1. **Multi-Provider Support**
   - SMTP (Standard SMTP servers)
   - SendGrid (API-based)
   - Resend (API-based)

2. **Email Types**
   - Notification emails (system alerts, updates, reminders)
   - Password reset emails (with secure token generation and expiration)
   - User invitation emails (for new user onboarding with registration links)
   - Account confirmation emails (for email verification during signup)

3. **Advanced Features**
   - HTML and plain text email templates
   - Email queuing mechanism for handling high volume sends
   - Rate limiting to prevent spam
   - Email delivery retry logic for failed sends
   - Configuration validation to ensure all required environment variables are present
   - Security best practices for handling credentials and tokens

## Installation

The email service is automatically included when you install the backend dependencies:

```bash
npm install
```

## Configuration

### Environment Variables

To configure the email service, set the following environment variables in your `.env` file:

```env
# Email Configuration
EMAIL_PROVIDER=smtp        # Options: smtp, sendgrid, resend
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USERNAME=your-email@example.com
EMAIL_PASSWORD=your-email-password
EMAIL_FROM=noreply@labtasker.com
EMAIL_FROM_NAME=LabTasker
FRONTEND_URL=http://localhost:3000
```

For SendGrid:
```env
EMAIL_PROVIDER=sendgrid
EMAIL_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@labtasker.com
EMAIL_FROM_NAME=LabTasker
FRONTEND_URL=http://localhost:3000
```

For Resend:
```env
EMAIL_PROVIDER=resend
EMAIL_API_KEY=your-resend-api-key
EMAIL_FROM=noreply@labtasker.com
EMAIL_FROM_NAME=LabTasker
FRONTEND_URL=http://localhost:3000
```

### Configuration Validation

The service automatically validates the configuration on startup. If required variables are missing, the application will log an error but continue to run (email features will be disabled).

## Usage

### Initializing the Service

The email service is automatically initialized in `app.js`:

```javascript
const emailService = require('./services/emailService');
if (config.email.provider) {
    emailService.initialize(config.email)
        .then(() => {
            // Verify connection
            return emailService.verifyConnection();
        })
        .then(() => {
            // Start email queue
            emailService.startQueue();
        })
        .catch((error) => {
            console.error('❌ Email service initialization failed:', error.message);
            // Don't exit the application, just log the error
        });
} else {
    console.log('📧 Email service not configured - skipping initialization');
}
```

### Sending Emails

#### 1. Generic Notification Email

```javascript
const emailService = require('./services/emailService');

// Send a simple notification
await emailService.sendNotification({
    to: 'user@example.com',
    subject: 'Task Assigned',
    message: 'You have been assigned to a new task.',
    priority: 'normal'
});

// Send with HTML template
await emailService.sendNotification({
    to: 'user@example.com',
    subject: 'Task Assigned',
    template: 'notification',
    data: {
        userName: 'John Doe',
        taskName: 'Sample Task',
        taskUrl: 'http://example.com/tasks/123'
    },
    priority: 'high'
});
```

#### 2. Password Reset Email

```javascript
const emailService = require('./services/emailService');

// Send password reset email
await emailService.sendPasswordReset(
    { 
        name: 'John Doe', 
        email: 'user@example.com' 
    },
    'reset-token-12345',
    new Date(Date.now() + 3600000) // 1 hour from now
);
```

#### 3. User Invitation Email

```javascript
const emailService = require('./services/emailService');

// Send user invitation email
await emailService.sendUserInvitation({
    email: 'newuser@example.com',
    inviteToken: 'invite-token-12345',
    invitedBy: { name: 'Admin User' },
    role: 'Scientist'
});
```

#### 4. Account Confirmation Email

```javascript
const emailService = require('./services/emailService');

// Send account confirmation email
await emailService.sendAccountConfirmation(
    { 
        name: 'John Doe', 
        email: 'user@example.com' 
    },
    'confirm-token-12345'
);
```

## Templates

The email service uses HTML and plain text templates stored in `backend/templates/emails/`.

### Available Templates

1. **password-reset.html/.txt** - Password reset emails
2. **user-invitation.html/.txt** - User invitation emails
3. **account-confirmation.html/.txt** - Account confirmation emails
4. **notification.html/.txt** - Generic notification emails

### Template Variables

Templates use double curly braces for variables:

```html
<p>Hello {{userName}},</p>
<p>Your reset link: {{resetUrl}}</p>
```

## Security

### Credential Handling

- All credentials are loaded from environment variables
- Never hardcoded in the source code
- TLS/SSL encryption for SMTP connections

### Rate Limiting

- Maximum of 10 emails per minute per recipient
- Automatic rate limiting to prevent spam

### Token Security

- Cryptographically secure random tokens
- SHA-256 hashing for token storage
- Time-limited tokens (1 hour for password reset, 24 hours for confirmation)

## Error Handling

The email service includes comprehensive error handling:

1. **Connection Errors** - Retry logic for temporary connection issues
2. **Rate Limiting** - Automatic throttling when limits are exceeded
3. **Template Errors** - Fallback to plain text when templates fail
4. **Delivery Errors** - Retry mechanism for failed deliveries

## Integration with Existing Systems

### Authentication System

The email service is integrated with the authentication system for password reset functionality:

```javascript
// In authController.js
exports.forgotPassword = async (req, res) => {
    // ... validation logic ...
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Save token to user
    user.passwordResetToken = resetTokenHash;
    user.passwordResetExpires = resetTokenExpires;
    await user.save();
    
    // Send reset email
    await emailService.sendPasswordReset(user, resetToken, resetTokenExpires);
};
```

### Notification System

The email service can be integrated with the existing notification system to send email notifications:

```javascript
// Example integration with notification system
const sendEmailNotification = async (notification) => {
    if (notification.category === 'task' && notification.type === 'assignment') {
        await emailService.sendNotification({
            to: notification.recipient.email,
            subject: 'New Task Assigned',
            template: 'notification',
            data: {
                userName: notification.recipient.name,
                message: notification.message,
                actionUrl: `${process.env.FRONTEND_URL}/tasks/${notification.relatedEntity.entityId}`
            }
        });
    }
};
```

## Testing

### Unit Tests

To run the email service tests:

```bash
npm test
```

### Manual Testing

A test script is available to verify the email service:

```bash
node scripts/test-email-service.js
```

## Monitoring

The email service logs all activities:

- Service initialization
- Connection verification
- Email sending attempts
- Success and failure notifications
- Rate limiting events

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check SMTP server settings
   - Verify credentials
   - Ensure firewall allows connections

2. **Authentication Failed**
   - Verify username/password
   - Check if 2FA is enabled (may require app-specific passwords)

3. **Rate Limiting**
   - Reduce email sending frequency
   - Implement batching for bulk emails

### Debugging

Enable debug logging by setting:

```env
DEBUG=email-service*
```

## Best Practices

1. **Environment Separation**
   - Use different email configurations for development, staging, and production
   - Consider using email testing services (like Mailtrap) in development

2. **Template Design**
   - Keep templates simple and responsive
   - Always provide plain text alternatives
   - Test templates across different email clients

3. **Error Handling**
   - Always handle email sending errors gracefully
   - Don't expose email sending failures to users directly
   - Log errors for monitoring and debugging

4. **Security**
   - Rotate API keys regularly
   - Use strong, unique passwords
   - Enable two-factor authentication where possible

## Future Enhancements

1. **Email Analytics**
   - Track open rates and click-through rates
   - Integration with email analytics services

2. **Advanced Queuing**
   - Priority-based queuing
   - Scheduled email sending

3. **Additional Providers**
   - Amazon SES
   - Mailgun
   - Postmark

4. **Internationalization**
   - Multi-language email templates
   - Localization support

5. **Advanced Features**
   - Email personalization
   - A/B testing for email content
   - Automated email sequences