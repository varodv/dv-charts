import typescript from 'rollup-plugin-typescript2';

export default {
  input: ['src/index.ts'],
  output: {
    format: 'esm',
    dir: 'dist',
    preserveModules: true,
    preserveModulesRoot: 'src',
    sourcemap: true,
  },
  plugins: [typescript()],
};
