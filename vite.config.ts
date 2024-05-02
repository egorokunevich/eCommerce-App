import { defineConfig } from 'vite';

export default defineConfig({
    base: '',
	css: {
		modules: {
			localsConvention: 'camelCase',
		},
	},
});