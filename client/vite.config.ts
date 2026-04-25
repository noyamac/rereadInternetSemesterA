import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

//TODO: change to https when run in production environment
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    https: {
      key: fs.readFileSync('../key.pem'),
      cert: fs.readFileSync('../cert.pem'),
    },
    proxy: {
      '/book': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/user': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/comment': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/file': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/public': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
