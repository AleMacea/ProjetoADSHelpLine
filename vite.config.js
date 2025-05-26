import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src') // Define '@' como 'src'
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx'] // Garante que .tsx seja resolvido automaticamente
  },
  server: {
    historyApiFallback: true
  }
});
