import base from '../../jest.config.base';

export default {
  ...base,
  roots: ['src'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.scss$': 'identity-obj-proxy',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!d3-\\w+)'],
};
