module.exports = {
  roots: ['src'],
  testMatch: ['**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.scss$': 'identity-obj-proxy',
  },
};
