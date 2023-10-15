const typescript = require('@rollup/plugin-typescript');
const postcss = require('rollup-plugin-postcss');
const terser = require('@rollup/plugin-terser');
const packageJson = require('./package.json');

module.exports = {
  input: 'src/facefinder/index.ts',
  output: [
    {
    file: packageJson.module,
    format: 'cjs'
  },
    {
      file: packageJson.main,
      format: 'esm'
    },
  ],
  external: ['react', 'react/jsx-runtime', 'react-intl'],
  plugins: [
    typescript({
    tsconfig: './tsconfig.json',
  }),
    postcss({
      extract: 'index.css',
      minimize: true
    }),
    terser(),
  ]
};
