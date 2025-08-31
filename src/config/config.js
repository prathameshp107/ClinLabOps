// Get environment variables directly from process.env
const envVars = {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION
};

// Validate required frontend environment variables
const requiredEnvVars = [
    'NEXT_PUBLIC_API_URL',
    'NEXT_PUBLIC_BACKEND_URL',
    'NEXT_PUBLIC_APP_NAME',
    'NEXT_PUBLIC_APP_VERSION'
];

// Only log debug info in development
if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Environment Variables Debug:');
    console.log('- All NEXT_PUBLIC vars:', Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_')));
    console.log('- Required vars:', requiredEnvVars.map(envVar => `${envVar}: ${envVars[envVar]}`));
    console.log('- NODE_ENV:', process.env.NODE_ENV);
}

// Validate all required environment variables are present
const missingEnvVars = requiredEnvVars.filter(envVar => !envVars[envVar]);

if (missingEnvVars.length > 0) {
    const errorMessage = `Missing required environment variables: ${missingEnvVars.join(', ')}`;
    console.error('❌ Missing required environment variables:', errorMessage);
    console.error('Please ensure all required variables are set in your environment configuration.');
    throw new Error(errorMessage);
}

// Validate URL formats in production
if (process.env.NODE_ENV === 'production') {
    const urlVars = ['NEXT_PUBLIC_API_URL', 'NEXT_PUBLIC_BACKEND_URL'];
    urlVars.forEach(varName => {
        const url = process.env[varName];
        if (url && !url.startsWith('https://') && !url.startsWith('http://')) {
            throw new Error(`${varName} must be a valid URL starting with http:// or https://`);
        }
    });
}

const config = {
    // API Configuration
    api: {
        baseUrl: envVars.NEXT_PUBLIC_API_URL,
        backendUrl: envVars.NEXT_PUBLIC_BACKEND_URL
    },

    // Application Configuration
    app: {
        name: envVars.NEXT_PUBLIC_APP_NAME,
        version: envVars.NEXT_PUBLIC_APP_VERSION
    },

    // Environment
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',

    // Database Configuration (for reference)
    database: {
        uri: process.env.MONGODB_URI
    }
};

export default config;