/**
 * Jest configuration for React Native / Expo project
 * Configured for testing discount engine and stores
 */

module.exports = {
  preset: 'jest-expo',
  testEnvironment: 'node', // Use 'node' instead of 'jsdom' for pure logic tests
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testMatch: ['**/tests/**/*.test.ts', '**/tests/**/*.test.tsx'],
  collectCoverageFrom: [
    'src/engine/**/*.ts',
    'src/stores/**/*.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  // Mock modules that cause issues in test environment
  moduleNameMapper: {
    '^expo$': '<rootDir>/tests/mocks/expo.ts',
    '^@expo/vector-icons$': '<rootDir>/tests/mocks/vector-icons.ts',
  },
};
