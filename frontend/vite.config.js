import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // This tells Vite to process .js files with Babel to handle JSX
      include: '**/*.{js,jsx,ts,tsx}',
    }),
  ],
  esbuild: {
    // This tells esbuild to treat .js files as JSX
    loader: 'jsx',
    include: /.*\.jsx?$/,
    exclude: [],
  },
  // Add this to handle .jsx imports
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
});
