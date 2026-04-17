import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { sveltePreprocess } from 'svelte-preprocess'

export default defineConfig({
  base: '/corkborg/',
  plugins: [
    svelte({
      preprocess: sveltePreprocess(),
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
})
