/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/packages', '<rootDir>/services'],
  testMatch: ['**/__tests__/**/*.ts', '**/*.test.ts', '**/*.spec.ts'],
  collectCoverageFrom: [
    '**/*.{ts,js}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/lib/**',
    '!**/coverage/**',
    '!**/*.config.{js,ts}',
    '!**/*.test.{js,ts}',
    '!**/*.spec.{js,ts}',
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  coverageThresholds: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  // Maps @steedos/* imports to package source directories
  // Assumes all packages follow the convention of having src/ directory
  moduleNameMapper: {
    '^@steedos/(.*)$': '<rootDir>/packages/$1/src',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testTimeout: 30000,
  verbose: true,
};
