// Set test environment
process.env.NODE_ENV = 'test';

// Set test JWT secret if not already set
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'test-jwt-secret';
}

// Set test MongoDB URI if not already set
if (!process.env.MONGO_URI) {
  process.env.MONGO_URI = 'mongodb://localhost:27017/labtasker-test';
}

// Increase test timeout
jest.setTimeout(30000);