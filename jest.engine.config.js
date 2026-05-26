/**
 * Jest configuration specifically for discount engine tests
 * Pure logic tests - no React Native or Expo dependencies needed
 */

module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testMatch: ['**/tests/**/*.test.ts'],
  collectCoverageFrom: [
    'src/engine/**/*.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  // No preset - pure logic tests
};
