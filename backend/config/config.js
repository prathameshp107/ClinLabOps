require('dotenv').config();

// Validate required environment variables
const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'PORT',
    'NODE_ENV',
    'DB_NAME',
    'JWT_EXPIRES_IN',
    'APP_NAME',
    'APP_VERSION',
    'CORS_ORIGIN',
    'BCRYPT_ROUNDS',
    'RATE_LIMIT_WINDOW_MS',
    'RATE_LIMIT_MAX'
];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
    console.error('Please check your .env file and ensure all required variables are set.');
    process.exit(1);
}

// Validate JWT secret strength in production
if (process.env.NODE_ENV === 'production' && process.env.JWT_SECRET.length < 32) {
    console.error('❌ JWT_SECRET must be at least 32 characters long in production');
    process.exit(1);
}

// Validate email configuration
const emailRequiredEnvVars = [
    'EMAIL_PROVIDER',
    'EMAIL_FROM'
];

const emailMissingEnvVars = emailRequiredEnvVars.filter(envVar => !process.env[envVar]);

// Only validate email config in production or if email provider is set
if (process.env.NODE_ENV === 'production' || process.env.EMAIL_PROVIDER) {
    if (emailMissingEnvVars.length > 0) {
        console.error('❌ Missing required email environment variables:', emailMissingEnvVars.join(', '));
        console.error('Please check your .env file and ensure all required email variables are set.');
        process.exit(1);
    }
}

const config = {
    // Server Configuration
    port: parseInt(process.env.PORT),
    nodeEnv: process.env.NODE_ENV,

    // Database Configuration
    mongodbUri: process.env.MONGODB_URI,
    dbName: process.env.DB_NAME,

    // Authentication Configuration
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,

    // Application Configuration
    app: {
        name: process.env.APP_NAME,
        version: process.env.APP_VERSION
    },

    // CORS Configuration
    cors: {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    },

    // Security Configuration
    security: {
        bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS),
        rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS),
        rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX)
    },

    // Email Configuration
    email: {
        provider: process.env.EMAIL_PROVIDER,
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        secure: process.env.EMAIL_SECURE === 'true',
        username: process.env.EMAIL_USERNAME,
        password: process.env.EMAIL_PASSWORD,
        from: process.env.EMAIL_FROM,
        fromName: process.env.EMAIL_FROM_NAME,
        frontendUrl: process.env.FRONTEND_URL
    }
};



// Log configuration status
console.log(`🚀 LabTasker Backend Configuration Loaded`);
console.log(`   Environment: ${config.nodeEnv}`);
console.log(`   Port: ${config.port}`);
console.log(`   Database: ${config.mongodbUri ? '✅ Connected' : '❌ Not configured'}`);
console.log(`   CORS Origin: ${config.cors.origin}`);
console.log(`   Email Provider: ${config.email.provider ? `✅ ${config.email.provider}` : '❌ Not configured'}`);

module.exports = config;