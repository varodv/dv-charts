import base from '../../jest.config.base';

export default {
  ...base,
  roots: ['src'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.scss$': 'identity-obj-proxy',
  },
};
