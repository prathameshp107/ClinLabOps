// Validate required frontend environment variables
const requiredEnvVars = [
    'NEXT_PUBLIC_API_URL',
    'NEXT_PUBLIC_BACKEND_URL',
    'NEXT_PUBLIC_APP_NAME',
    'NEXT_PUBLIC_APP_VERSION'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error('❌ Missing required frontend environment variables:', missingEnvVars.join(', '));
    console.error('Please check your .env.local file and ensure all required variables are set.');
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

const config = {
    // API Configuration
    api: {
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
        backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL
    },

    // Application Configuration
    app: {
        name: process.env.NEXT_PUBLIC_APP_NAME,
        version: process.env.NEXT_PUBLIC_APP_VERSION
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