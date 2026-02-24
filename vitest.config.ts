import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    // Load global test setup (e.g. jest-dom matchers) if needed
    // setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      // Match the `@/*` path alias configured in tsconfig.json
      '@': path.resolve(__dirname, '.'),
    },
  },
});
