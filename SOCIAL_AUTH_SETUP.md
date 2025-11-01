# Social Authentication Setup Guide

## Overview
This guide explains how to set up Google and GitHub OAuth authentication for LabTasker.

## Prerequisites
1. Google OAuth credentials
2. GitHub OAuth credentials
3. Environment variables configured

## Google OAuth Setup

### 1. Create Google OAuth Credentials
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Select "Web application" as the application type
6. Set the following URLs:
   - **Authorized JavaScript origins**: `http://localhost:3000` (for development)
   - **Authorized redirect URIs**: 
     - `http://localhost:5000/api/auth/google/callback` (for development)
     - `https://your-production-domain.com/api/auth/google/callback` (for production)
7. Save and note down the Client ID and Client Secret

### 2. Configure Environment Variables
Add the following to your `.env` file:
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## GitHub OAuth Setup

### 1. Create GitHub OAuth App
1. Go to your GitHub profile settings
2. Navigate to "Developer settings" > "OAuth Apps"
3. Click "New OAuth App"
4. Fill in the application details:
   - **Application name**: LabTasker
   - **Homepage URL**: `http://localhost:3000` (for development)
   - **Authorization callback URL**: 
     - `http://localhost:5000/api/auth/github/callback` (for development)
     - `https://your-production-domain.com/api/auth/github/callback` (for production)
5. Click "Register application"
6. Note down the Client ID and generate a new Client Secret

### 2. Configure Environment Variables
Add the following to your `.env` file:
```env
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

## Session Configuration

### Environment Variables
Add the following to your `.env` file:
```env
SESSION_SECRET=your-session-secret-key
```

For production, use a strong random string for the session secret.

## Frontend Configuration

The frontend automatically detects OAuth redirects and handles token storage. No additional configuration is required.

## Testing Social Authentication

### Development Testing
1. Start both frontend and backend servers
2. Navigate to the login or registration page
3. Click on "Continue with Google" or "Continue with GitHub"
4. Complete the OAuth flow
5. You should be redirected back to the application

### Production Deployment
Make sure to update the callback URLs in both Google and GitHub OAuth configurations to match your production domain.

## How It Works

### Backend Flow
1. User clicks social login button
2. Frontend redirects to backend OAuth endpoint
3. Backend redirects to OAuth provider
4. User authenticates with OAuth provider
5. OAuth provider redirects back to backend callback
6. Backend creates/updates user and generates JWT token
7. Backend redirects to frontend with token in URL parameters
8. Frontend extracts token and stores it

### User Creation/Linking
- If a user with the OAuth provider ID already exists, they are logged in
- If a user with the same email exists, the OAuth account is linked to that user
- If neither exists, a new user is created

## Security Considerations

1. **Token Storage**: JWT tokens are stored in localStorage on the frontend
2. **Session Security**: Backend sessions are secured with HTTPS in production
3. **OAuth Scopes**: Only minimal scopes are requested (profile and email)
4. **Token Expiration**: JWT tokens expire after 24 hours

## Troubleshooting

### Common Issues
1. **Redirect URI Mismatch**: Ensure callback URLs exactly match configured URIs
2. **CORS Errors**: Check that CORS origins are properly configured
3. **Token Storage Issues**: Verify browser storage permissions

### Debugging
1. Check backend logs for authentication errors
2. Verify environment variables are correctly set
3. Ensure OAuth app configurations are correct

## Adding New Providers

To add new OAuth providers:
1. Install the appropriate Passport strategy
2. Add configuration to `backend/config/passport.js`
3. Add routes to `backend/routes/auth.js`
4. Add frontend buttons and handlers
5. Update environment variables