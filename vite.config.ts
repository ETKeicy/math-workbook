import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
// import devtools from 'solid-devtools/vite';

export default defineConfig(config => {
  const { mode } = config;
  const base = mode === 'production' ? '/math-workbook/' : '/';

  return {
    plugins: [
      solidPlugin(),
    ],
    server: {
      port: 3000,
    },
    build: {
      target: 'esnext',
      outDir: './docs'
    },
    base
  }
});
