import base from '../../jest.config.base';

export default {
  ...base,
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.scss$': 'identity-obj-proxy',
  },
};
