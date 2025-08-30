require('dotenv').config();

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
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

const config = {
    // Server Configuration
    port: parseInt(process.env.PORT) || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',

    // Database Configuration
    mongodbUri: process.env.MONGODB_URI,
    dbName: process.env.DB_NAME || 'labtasker',

    // Authentication Configuration
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

    // Application Configuration
    app: {
        name: process.env.APP_NAME || 'LabTasker',
        version: process.env.APP_VERSION || '1.0.0'
    },

    // CORS Configuration
    cors: {
        origin: process.env.CORS_ORIGIN || (process.env.NODE_ENV === 'production' ? false : 'http://localhost:3000'),
        credentials: true
    },

    // Security Configuration
    security: {
        bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
        rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
        rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 100 // requests per window
    }
};



// Log configuration status
console.log(`🚀 LabTasker Backend Configuration Loaded`);
console.log(`   Environment: ${config.nodeEnv}`);
console.log(`   Port: ${config.port}`);
console.log(`   Database: ${config.mongodbUri ? '✅ Connected' : '❌ Not configured'}`);
console.log(`   CORS Origin: ${config.cors.origin || 'All origins (not recommended for production)'}`);

module.exports = config;