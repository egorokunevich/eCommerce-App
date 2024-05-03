import { mergeConfig } from 'vite'
import { defineConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(viteConfig, defineConfig({
  test: {
    name: 'happy-dom',
    environment: 'happy-dom',
    include: ['**/*.test.ts'],
    globals: true,
    restoreMocks: true,
  },
}))