module.exports = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: false, // Run yarn test:coverage to generate coverage reports
  collectCoverageFrom: ['src/**/*.ts'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  coverageReporters: ['html', 'text-summary'],
  coverageDirectory: '<rootDir>/reports/coverage',
  modulePathIgnorePatterns: ['<rootDir>/dist', '<rootDir/reports>'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: '<rootDir>/reports/jest',
      },
    ],
  ],
};
