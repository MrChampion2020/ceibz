// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    assetsInlineLimit: 0, // Set this to 0 to make sure video files are not inlined
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (/\.mp4|webm|ogg|mp3|wav|flac|aac/.test(assetInfo.name)) {
            return 'assets/media/[name][extname]';
          }
          return 'assets/pastor.mp4';
        },
      },
    },
  },
});
