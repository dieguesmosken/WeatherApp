module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    // Handle CSS imports (if you're using them directly in components)
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Handle module aliases
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
    '^../styles/(.*)$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '@swc/jest',
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
};