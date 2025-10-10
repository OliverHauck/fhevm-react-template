import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import dts from 'rollup-plugin-dts';

const external = ['ethers', 'fhevmjs', 'react', 'vue'];

export default [
  // Core library builds
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/index.esm.js',
        format: 'esm',
        sourcemap: true,
      },
    ],
    external,
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
      }),
    ],
  },
  // React integration
  {
    input: 'src/react/index.tsx',
    output: [
      {
        file: 'dist/react.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/react.esm.js',
        format: 'esm',
        sourcemap: true,
      },
    ],
    external: [...external, /^react\//],
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
      }),
    ],
  },
  // Type definitions
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'esm',
    },
    external,
    plugins: [dts()],
  },
  {
    input: 'src/react/index.tsx',
    output: {
      file: 'dist/react.d.ts',
      format: 'esm',
    },
    external: [...external, /^react\//],
    plugins: [dts()],
  },
];
