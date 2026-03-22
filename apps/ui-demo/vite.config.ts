import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        exclude: [/packages\/sdk-react\/dist/],
      },
    }),
  ],
  resolve: {
    '@': path.resolve(__dirname, './src'),
  },
});
