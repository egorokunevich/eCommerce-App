/// <reference types="vitest" />
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  define: {
    global: {},
  },
  plugins: [tsconfigPaths(), nodePolyfills()],
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
});
