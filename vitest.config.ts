import { mergeConfig } from 'vite';
import { defineConfig } from 'vitest/config';
import viteConfig from './vite.config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default mergeConfig(
  viteConfig,
  defineConfig({
    plugins: [tsconfigPaths()],
    test: {
      name: 'happy-dom',
      environment: 'happy-dom',
      include: ['**/*.test.ts'],
      globals: true,
      restoreMocks: true,
    },
  }),
);
