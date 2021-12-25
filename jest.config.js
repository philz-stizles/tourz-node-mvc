/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  verbose: true,
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['./src/test/setupFilesAfterEnv.ts'],
  coverageDirectory: 'coverage',
  coverageReporters: ['json-summary', 'text', 'lcov'],
  collectCoverageFrom: ['src/**/*.{js,ts}'],
  coveragePathIgnorePatterns: [
    '<rootDir>/build/',
    '<rootDir>/node_modules/',
    '<rootDir>/src/@types/',
    '<rootDir>/src/docs/',
    '<rootDir>/src/graphql/',
    '<rootDir>/src/test/',
    '<rootDir>/src/views/',
  ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  moduleNameMapper: {
    'src/(.*)': '<rootDir>/src/$1',
    '@src/(.*)': '<rootDir>/src/$1',
  },
  // testPathIgnorePatterns: [
  //   '<rootDir>/dist/',
  //   '<rootDir>/node_modules/',
  //   '<rootDir>/coverage/',
  //   '<rootDir>/.github/',
  // ],
  // transform: {
  //   'node_modules/variables/.+\\.(j|t)sx?$': 'ts-jest',
  // },
  // transformIgnorePatterns: ['node_modules/(?!variables/.*)'],
};
