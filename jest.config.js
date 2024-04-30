module.exports = {
  preset: 'ts-jest',
  cache: false,
  coverageReporters: ['lcov', 'text', 'html'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '!**/__tests__/**/notest.*'],
};
