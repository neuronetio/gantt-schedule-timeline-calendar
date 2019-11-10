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
      !production && livereload('dist')
    ]
  },
  {
    input: 'src/index.ts',
    output: {
      sourcemap: true,
      file: 'dist/index.umd.min.js',
      format: 'umd',
      name: 'GSTC'
    },
    plugins: [
      typescript({ target: 'es6' }),
      resolve({
        browser: true
        //module: true
      }),
      commonjs({ extensions: ['.js', '.ts'] }),
      terser({
        keep_classnames: true,
        keep_fnames: true
      })
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
      production &&
        terser({
          keep_classnames: true,
          keep_fnames: true
        })
    ]
  },
  {
    input: 'src/index.ts',
    output: {
      sourcemap: true,
      file: 'dist/index.esm.min.js',
      format: 'esm'
    },
    plugins: [
      typescript({ target: 'es6' }),
      resolve({
        browser: true
        //module: true
      }),
      commonjs({ extensions: ['.js', '.ts'] }),
      terser({
        keep_classnames: true,
        keep_fnames: true
      })
    ]
  },
  {
    input: 'src/plugins/ItemMovement.plugin.ts',
    output: {
      sourcemap: true,
      file: 'dist/ItemMovement.plugin.js',
      format: 'umd',
      name: 'ItemMovement'
    },
    plugins: [
      typescript({ target: 'es6' }),
      resolve({
        browser: true
        //module: true
      }),
      commonjs({ extensions: ['.js', '.ts'] })
    ]
  },
  {
    input: 'src/plugins/ItemMovement.plugin.ts',
    output: {
      sourcemap: true,
      file: 'dist/ItemMovement.plugin.min.js',
      format: 'umd',
      name: 'ItemMovement'
    },
    plugins: [
      typescript({ target: 'es6' }),
      resolve({
        browser: true
        //module: true
      }),
      commonjs({ extensions: ['.js', '.ts'] }),
      production &&
        terser({
          keep_classnames: true,
          keep_fnames: true
        })
    ]
  },
  {
    input: 'src/plugins/DependencyLines.plugin.ts',
    output: {
      sourcemap: true,
      file: 'dist/DependencyLines.plugin.js',
      format: 'umd',
      name: 'DependencyLines'
    },
    plugins: [
      typescript({ target: 'es6' }),
      resolve({
        browser: true
        //module: true
      }),
      commonjs({ extensions: ['.js', '.ts'] })
    ]
  },
  {
    input: 'src/plugins/DependencyLines.plugin.ts',
    output: {
      sourcemap: true,
      file: 'dist/DependencyLines.plugin.min.js',
      format: 'umd',
      name: 'DependencyLines'
    },
    plugins: [
      typescript({ target: 'es6' }),
      resolve({
        browser: true
        //module: true
      }),
      commonjs({ extensions: ['.js', '.ts'] }),
      production &&
        terser({
          keep_classnames: true,
          keep_fnames: true
        })
    ]
  },
  {
    input: 'src/plugins/ItemHold.plugin.ts',
    output: {
      sourcemap: true,
      file: 'dist/ItemHold.plugin.js',
      format: 'umd',
      name: 'ItemHold'
    },
    plugins: [
      typescript({ target: 'es6' }),
      resolve({
        browser: true
        //module: true
      }),
      commonjs({ extensions: ['.js', '.ts'] })
    ]
  },
  {
    input: 'src/plugins/ItemHold.plugin.ts',
    output: {
      sourcemap: true,
      file: 'dist/ItemHold.plugin.min.js',
      format: 'umd',
      name: 'ItemHold'
    },
    plugins: [
      typescript({ target: 'es6' }),
      resolve({
        browser: true
        //module: true
      }),
      commonjs({ extensions: ['.js', '.ts'] }),
      production &&
        terser({
          keep_classnames: true,
          keep_fnames: true
        })
    ]
  },
  {
    input: 'src/plugins/SaveAsImage.plugin.ts',
    output: {
      sourcemap: true,
      file: 'dist/SaveAsImage.plugin.js',
      format: 'umd',
      name: 'SaveAsImage'
    },
    plugins: [
      typescript({ target: 'es6' }),
      resolve({
        browser: true
        //module: true
      }),
      commonjs({ extensions: ['.js', '.ts'] })
    ]
  },
  {
    input: 'src/plugins/SaveAsImage.plugin.ts',
    output: {
      sourcemap: true,
      file: 'dist/SaveAsImage.plugin.min.js',
      format: 'umd',
      name: 'SaveAsImage'
    },
    plugins: [
      typescript({ target: 'es6' }),
      resolve({
        browser: true
        //module: true
      }),
      commonjs({ extensions: ['.js', '.ts'] }),
      production &&
        terser({
          keep_classnames: true,
          keep_fnames: true
        })
    ]
  },
  {
    input: 'src/plugins/Selection.plugin.ts',
    output: {
      sourcemap: true,
      file: 'dist/Selection.plugin.js',
      format: 'umd',
      name: 'Selection'
    },
    plugins: [
      typescript({ target: 'es6' }),
      resolve({
        browser: true
        //module: true
      }),
      commonjs({ extensions: ['.js', '.ts'] })
    ]
  },
  {
    input: 'src/plugins/Selection.plugin.ts',
    output: {
      sourcemap: true,
      file: 'dist/Selection.plugin.min.js',
      format: 'umd',
      name: 'Selection'
    },
    plugins: [
      typescript({ target: 'es6' }),
      resolve({
        browser: true
        //module: true
      }),
      commonjs({ extensions: ['.js', '.ts'] }),
      production &&
        terser({
          keep_classnames: true,
          keep_fnames: true
        })
    ]
  },
  {
    input: 'src/plugins/plugins.ts',
    output: {
      sourcemap: true,
      file: 'dist/plugins.js',
      format: 'esm',
      name: 'plugins'
    },
    plugins: [
      typescript({ target: 'es6' }),
      resolve({
        browser: true
        //module: true
      }),
      commonjs({ extensions: ['.js', '.ts'] })
    ]
  },
  {
    input: 'src/plugins/plugins.ts',
    output: {
      sourcemap: true,
      file: 'dist/plugins.min.js',
      format: 'esm',
      name: 'plugins'
    },
    plugins: [
      typescript({ target: 'es6' }),
      resolve({
        browser: true
        //module: true
      }),
      commonjs({ extensions: ['.js', '.ts'] }),
      production &&
        terser({
          keep_classnames: true,
          keep_fnames: true
        })
    ]
  },
  {
    input: 'src/style.styl',
    output: { format: 'esm', file: 'dist/style.css' },
    plugins: [stylus()]
  }
];
