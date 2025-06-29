import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        montana: resolve(__dirname, 'montana.html'),
        login: resolve(__dirname, 'login.html'),
        profile: resolve(__dirname, 'profile.html')
        // Add other HTML files that import TS modules here
      },
    },
  },
}); 