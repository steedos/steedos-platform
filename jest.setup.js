// Jest setup file for global test configuration

// Increase timeout for integration tests
jest.setTimeout(30000);

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to suppress console logs in tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // Keep error and assert for debugging
  error: console.error,
  assert: console.assert,
};

// Add custom matchers if needed
expect.extend({
  // Example custom matcher
  // toBeValidObjectName(received) {
  //   const pass = /^[a-z][a-z0-9_]*$/.test(received);
  //   return {
  //     pass,
  //     message: () => `expected ${received} to be a valid object name`,
  //   };
  // },
});
