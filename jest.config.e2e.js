const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/app/$1',
  },
  testMatch: ['**/*.e2e.test.ts', '**/*.e2e.test.tsx'],
  testTimeout: 30000, // Longer timeout for E2E tests
  maxWorkers: 1, // Run E2E tests serially
  globalSetup: '<rootDir>/jest.e2e.setup.js',
  globalTeardown: '<rootDir>/jest.e2e.teardown.js',
};

module.exports = createJestConfig(customJestConfig);