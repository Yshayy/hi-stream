import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  target: 'esnext',
  dts: true,
  sourcemap: true,
  clean: true,
  minify: true,
  outDir: 'dist',
  platform: 'node',
  env: {
    NODE_ENV: 'production'
  },
  define: {
    'import.meta.vitest': 'undefined',
  },
  esbuildOptions(options) {
    options.define = {
      ...options.define,
      'process.env.NODE_ENV': JSON.stringify('production')
    };
  }
});
