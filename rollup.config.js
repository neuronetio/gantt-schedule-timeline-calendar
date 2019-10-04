import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';

import stylusLib from 'stylus';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
function stylus(filename) {
  return {
    name: 'stylus',
    resolveId(source) {
      if (source.endsWith('.styl')) {
        return source;
      }
      return null;
    },
    load(id) {
      if (id.endsWith('.styl')) {
        const style = readFileSync(id, { encoding: 'utf8' });
        stylusLib.render(style, function(err, css) {
          if (err) throw err;
          writeFileSync(join(__dirname, filename), css, { encoding: 'utf8' });
        });
        return '';
      }
      return null; // other ids should be handled as usually
    }
  };
}

const production = !process.env.ROLLUP_WATCH;

export default [
  {
    input: 'src/index.ts',
    output: {
      sourcemap: true,
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'GSTC'
    },
    plugins: [
      typescript({ target: 'es6', locale: 'pl' }),
      resolve({
        browser: true
      }),
      commonjs(),
      !production && livereload('dist'),
      !production && terser()
    ]
  },
  {
    input: 'src/index.ts',
    output: {
      sourcemap: true,
      file: 'dist/index.esm.js',
      format: 'esm'
    },
    plugins: [
      typescript({ target: 'es6', locale: 'pl' }),
      resolve({
        browser: true
      }),
      commonjs(),
      !production && terser()
    ]
  },
  {
    input: 'src/style.styl',
    output: { format: 'esm' },
    plugins: [stylus('dist/style.css')]
  }
];
