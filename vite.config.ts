import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2022',
    minify: 'esbuild',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        manualChunks: {
          three: ['three']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@core': resolve(__dirname, './src/core'),
      '@entities': resolve(__dirname, './src/entities'),
      '@weapons': resolve(__dirname, './src/weapons'),
      '@rendering': resolve(__dirname, './src/rendering'),
      '@audio': resolve(__dirname, './src/audio'),
      '@ui': resolve(__dirname, './src/ui'),
      '@storage': resolve(__dirname, './src/storage'),
      '@types': resolve(__dirname, './src/types')
    }
  },
  server: {
    port: 3000,
    open: true
  }
});

