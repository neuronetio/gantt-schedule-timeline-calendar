import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';

import stylusLib from 'stylus';
import { readFileSync, writeFileSync } from 'fs';
function stylus() {
  let result = '';
  let output = '';
  return {
    name: 'stylus',
    outputOptions(options) {
      output = options.file;
    },
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
          result = css;
        });
        return 'var stylus=1;';
      }
      return null; // other ids should be handled as usually
    },
    writeBundle(bundle) {
      writeFileSync(output, result, { encoding: 'utf8' });
    }
  };
}

const production = !process.env.ROLLUP_WATCH;

export default [
  {
    input: 'src/vido.ts',
    output: {
      sourcemap: true,
      file: 'dist/vido.umd.js',
      format: 'umd',
      name: 'Vido'
    },
    plugins: [
      typescript({ target: 'es6' }),
      resolve({
        browser: true
        //module: true
      }),
      commonjs({ extensions: ['.js', '.ts'] }),
      production && terser()
    ]
  },
  {
    input: 'src/vido.ts',
    output: {
      sourcemap: true,
      file: 'dist/vido.esm.js',
      format: 'esm',
      name: 'Vido'
    },
    plugins: [
      typescript({ target: 'es6' }),
      resolve({
        browser: true
        //module: true
      }),
      commonjs({ extensions: ['.js', '.ts'] }),
      production && terser()
    ]
  },
  {
    input: 'src/index.ts',
    output: {
      sourcemap: true,
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'GSTC'
    },
    //context: 'null',
    //moduleContext: 'null',
    plugins: [
      typescript({ target: 'es6' }),
      resolve({
        browser: true
        //module: true
      }),
      commonjs({ extensions: ['.js', '.ts'] }),
      !production && livereload('dist'),
      production && terser()
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
      typescript({ target: 'es6' }),
      resolve({
        browser: true
        //module: true
      }),
      commonjs({ extensions: ['.js', '.ts'] }),
      production && terser()
    ]
  },
  {
    input: 'src/plugins/ItemMovement.plugin.js',
    output: {
      sourcemap: true,
      file: 'dist/ItemMovement.plugin.js',
      format: 'umd',
      name: 'ItemMovement'
    },
    plugins: [
      resolve({
        browser: true
        //module: true
      }),
      commonjs({ extensions: ['.js'] }),
      production && terser()
    ]
  },
  {
    input: 'src/style.styl',
    output: { format: 'esm', file: 'dist/style.css' },
    plugins: [stylus()]
  }
];
