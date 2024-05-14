import react from '@vitejs/plugin-react';
import 'dotenv/config';
import { resolve } from "path";
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '^/api/.*':  {
        target: process.env.HTTP || "http://localhost:3000",
      },
    },
  },
});
