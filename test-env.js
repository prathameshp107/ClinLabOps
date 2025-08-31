// Test environment variables loading
console.log('Testing environment variables...');
console.log('Current working directory:', process.cwd());
console.log('NODE_ENV:', process.env.NODE_ENV);

// Load dotenv to test
require('dotenv').config({ path: '.env.local' });

console.log('\nAfter loading .env.local:');
console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('NEXT_PUBLIC_BACKEND_URL:', process.env.NEXT_PUBLIC_BACKEND_URL);
console.log('NEXT_PUBLIC_APP_NAME:', process.env.NEXT_PUBLIC_APP_NAME);
console.log('NEXT_PUBLIC_APP_VERSION:', process.env.NEXT_PUBLIC_APP_VERSION);

// Check if file exists
const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');
console.log('\n.env.local file exists:', fs.existsSync(envPath));

if (fs.existsSync(envPath)) {
    console.log('.env.local content:');
    console.log(fs.readFileSync(envPath, 'utf8'));
}