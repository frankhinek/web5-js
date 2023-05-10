import esbuild from 'esbuild';
import browserConfig from './browser-config.cjs';

// cjs bundle. external dependencies **not** bundled
esbuild.buildSync({
  platform       : 'node',
  bundle         : true,
  format         : 'cjs',
  packages       : 'external',
  sourcemap      : true,
  entryPoints    : ['./common.ts'],
  outfile        : './dist/common.cjs',
  allowOverwrite : true,
});

// esm bundle. external dependencies **not** bundled
esbuild.buildSync({
  platform       : 'node',
  bundle         : true,
  format         : 'esm',
  packages       : 'external',
  sourcemap      : true,
  entryPoints    : ['./common.ts'],
  outfile        : './dist/common.mjs',
  allowOverwrite : true,
});


// node specific utils
esbuild.buildSync({
  platform       : 'node',
  bundle         : true,
  format         : 'esm',
  packages       : 'external',
  sourcemap      : true,
  entryPoints    : ['./node-utils.ts'],
  outfile        : './dist/node-utils.mjs',
  allowOverwrite : true,
});

// esm polyfilled bundle for browser
esbuild.build({
  ...browserConfig,
  outfile: 'dist/browser.mjs',
});

// iife polyfilled bundle for browser
esbuild.build({
  ...browserConfig,
  format     : 'iife',
  globalName : 'Web5',
  outfile    : 'dist/browser.js',
});