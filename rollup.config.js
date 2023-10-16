const typescript = require('@rollup/plugin-typescript');
const postcss = require('rollup-plugin-postcss');
const terser = require('@rollup/plugin-terser');
const packageJson = require('./package.json');
const dts = require('rollup-plugin-dts');

module.exports = [
  {
    input: 'src/index.ts',
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
        extract: false,
        minimize: true,
      }),
      terser(),
    ]
  },
  {
    input: 'dist/esm/types/index.d.ts',
    output: [{file: 'dist/index.d.ts', format: 'esm'}],
    external: [/\.(css|scss)$/],
    plugins: [dts.default()]
  }
]
