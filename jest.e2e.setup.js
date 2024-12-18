const { setupTestDatabase } = require('./scripts/setup-test-db');
const { spawn } = require('child_process');
const waitOn = require('wait-on');

module.exports = async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/test_db';
  process.env.REDIS_URL = 'redis://localhost:6379';

  // Setup test database
  await setupTestDatabase();

  // Start the Next.js development server
  const server = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      PORT: '3000',
    },
  });

  // Store the server process in global scope so we can access it in teardown
  global.__SERVER__ = server;

  // Wait for the server to be ready
  try {
    await waitOn({
      resources: ['http://localhost:3000'],
      timeout: 30000, // 30 seconds
      interval: 100, // Check every 100ms
    });
    console.log('Development server is ready');
  } catch (error) {
    console.error('Failed to start development server:', error);
    throw error;
  }

  // Store any other global setup data
  global.__E2E_CONFIG__ = {
    baseUrl: 'http://localhost:3000',
    testUsers: {
      admin: {
        email: 'admin@test.com',
        password: 'password123',
      },
      user: {
        email: 'user@test.com',
        password: 'password123',
      },
    },
  };
};