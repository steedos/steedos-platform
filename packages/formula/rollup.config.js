/* eslint-disable import/no-extraneous-dependencies */
import { terser } from 'rollup-plugin-terser';

export default [{
  /* NodeJS - CommonJS format */
  input: 'src/formulon.js',
  output: {
    dir: 'lib',
    format: 'cjs',
  },
},
{
  // Browsers - UMD format

  input: 'src/formulon.js',
  output: {
    file: 'lib/formulon.min.js',
    format: 'umd',
    name: 'formulon',
  },
  plugins: [
    terser(),
  ],
},
{
  // LWC - requires ES code/exports
  input: 'src/formulon.js',
  output: {
    file: 'lib/formulon.lwc.min.js',
    format: 'esm',
  },
  plugins: [
    terser(),
  ],
},
];
