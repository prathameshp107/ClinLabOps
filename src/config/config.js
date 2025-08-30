const config = {
    // API Configuration
    api: {
        baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
        backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
    },

    // Application Configuration
    app: {
        name: process.env.NEXT_PUBLIC_APP_NAME || 'LabTasker',
        version: process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0'
    },

    // Environment
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',

    // Database Configuration (for reference)
    database: {
        uri: process.env.MONGODB_URI || ''
    }
};

export default config;