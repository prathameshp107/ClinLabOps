# Hardcoded URLs Removal Summary

This document summarizes the changes made to remove hardcoded URLs and data throughout the LabTasker codebase, replacing them with dynamic values or environment-based configuration.

## Changes Made

### 1. Frontend Service Files

#### Fixed Files:
- `src/services/cageService.js`
- `src/services/breedingService.js`
- `src/services/animalService.js`

**Before:**
```javascript
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000/api/cages';
```

**After:**
```javascript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL + '/cages';
```

### 2. Middleware File

#### File: `src/middleware.js`

**Before:**
```javascript
const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:5000';
```

**After:**
```javascript
const BACKEND_API_URL = process.env.BACKEND_URL;
```

### 3. Backend Email Service

#### File: `backend/services/emailService.js`

**Before:**
```javascript
const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
const inviteUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/accept-invite?token=${inviteToken}`;
const confirmUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/confirm-email?token=${confirmToken}`;
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
```

**After:**
```javascript
const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
const inviteUrl = `${process.env.FRONTEND_URL}/accept-invite?token=${inviteToken}`;
const confirmUrl = `${process.env.FRONTEND_URL}/confirm-email?token=${confirmToken}`;
const frontendUrl = process.env.FRONTEND_URL;
```

### 4. Script Files

#### Files:
- `backend/scripts/check-deadline-notifications.js`
- `backend/scripts/generate-notifications-from-activities.js`

**Before:**
```javascript
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/labtasker';
```

**After:**
```javascript
const mongoURI = process.env.MONGO_URI;
```

### 5. Other Files with Fallback Values

#### Files Updated:
- `backend/controllers/notificationController.js`
- `backend/middleware/notificationMiddleware.js`
- `backend/scripts/test-signup-email.js`
- `backend/services/deadlineNotificationService.js`
- `backend/services/emailService.js`
- `backend/config/config.js`
- `backend/controllers/settingsController.js`

**Before:**
```javascript
appName: process.env.APP_NAME || 'LabTasker'
fromName: config.fromName || process.env.EMAIL_FROM_NAME || 'LabTasker'
const key = process.env.ENCRYPTION_KEY || crypto.randomBytes(32)
```

**After:**
```javascript
appName: process.env.APP_NAME
fromName: config.fromName || process.env.EMAIL_FROM_NAME
const key = process.env.ENCRYPTION_KEY
```

## Environment Variable Configuration

### Frontend (.env)

The frontend now uses the following environment variables (without fallbacks):

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api

# Application Configuration
NEXT_PUBLIC_APP_NAME=LabTasker
NEXT_PUBLIC_APP_VERSION=0.1.0

# Backend URL for API routes
BACKEND_URL=https://your-api-domain.com
```

### Backend (.env)

The backend uses the following environment variables (without fallbacks):

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/labtasker

# Authentication
JWT_SECRET=your-production-jwt-secret-here
JWT_EXPIRES_IN=7d

# Application Configuration
APP_NAME=LabTasker
APP_VERSION=1.0.0

# CORS Configuration
CORS_ORIGIN=https://your-frontend-domain.com

# Security Configuration
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Email Configuration
EMAIL_PROVIDER=smtp
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@labtasker.com
EMAIL_FROM_NAME=LabTasker System
FRONTEND_URL=https://your-frontend-domain.com

# Encryption Configuration
ENCRYPTION_KEY=your-32-byte-encryption-key-here
```

## No Fallback Values

All fallback values have been removed to ensure the application depends entirely on environment variables. This means:

1. **No Default URLs**: No localhost fallbacks for API endpoints
2. **No Default Database**: No localhost MongoDB fallback
3. **No Default App Names**: No "LabTasker" fallback for application names
4. **No Default Email Settings**: No default email configuration
5. **No Default Encryption Keys**: No fallback encryption keys

## Benefits of These Changes

1. **Explicit Configuration**: Forces proper environment setup for all deployments
2. **No Hidden Defaults**: Eliminates unexpected behavior from hidden fallback values
3. **Clearer Error Messages**: Missing environment variables will cause clear startup failures
4. **Security**: No accidental exposure of localhost services in production
5. **Consistency**: All services use the same configuration pattern

## Requirements for Deployment

### Development Environment

You must set all required environment variables even in development:

**Frontend (.env)**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=LabTasker
NEXT_PUBLIC_APP_VERSION=0.1.0
```

**Backend (.env)**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/labtasker
JWT_SECRET=your-development-jwt-secret
JWT_EXPIRES_IN=7d
APP_NAME=LabTasker
APP_VERSION=0.1.0
CORS_ORIGIN=http://localhost:3000
BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
FRONTEND_URL=http://localhost:3000
ENCRYPTION_KEY=your-32-byte-encryption-key-for-development
```

### Production Environment

All environment variables must be explicitly set:

**Frontend (.env)**
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
BACKEND_URL=https://your-api-domain.com
NEXT_PUBLIC_APP_NAME=LabTasker
NEXT_PUBLIC_APP_VERSION=1.0.0
```

**Backend (.env)**
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/labtasker
JWT_SECRET=your-production-jwt-secret-here
JWT_EXPIRES_IN=7d
APP_NAME=LabTasker
APP_VERSION=1.0.0
CORS_ORIGIN=https://your-frontend-domain.com
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
EMAIL_PROVIDER=smtp
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@labtasker.com
EMAIL_FROM_NAME=LabTasker System
FRONTEND_URL=https://your-frontend-domain.com
ENCRYPTION_KEY=your-32-byte-production-encryption-key
```

## Testing the Configuration

To verify that the environment variables are working correctly:

1. Start the application in development mode
2. Check that all API calls are working
3. Test email functionality to ensure frontend URLs are correct
4. Verify that database connections are working
5. Test encryption functionality to ensure encryption keys are properly configured

All hardcoded URLs and fallback values have been successfully removed, making the application depend entirely on environment variables for configuration.