import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa';

// Define the PWA configuration
const pwaOptions: Partial<VitePWAOptions> = {
  registerType: 'autoUpdate',
  injectRegister: 'script', // Explicitly set to 'script'
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
    cleanupOutdatedCaches: true, // Clean up outdated caches
    clientsClaim: true, // Claim controlling clients immediately
    skipWaiting: true, // Skip waiting for service worker activation
  },
  manifest: {
    short_name: 'To Do Keeper',
    name: 'To Do Keeper',
    icons: [
      {
        src: 'favicon.ico',
        sizes: '64x64 32x32 24x24 16x16',
        type: 'image/x-icon',
      },
      {
        src: 'logo192.png',
        type: 'image/png',
        sizes: '192x192',
      },
      {
        src: 'logo512.png',
        type: 'image/png',
        sizes: '512x512',
      },
    ],
    start_url: '.',
    display: 'standalone',
    theme_color: '#000000',
    background_color: '#ffffff',
  },
  devOptions: {
    enabled: true, // Enable PWA in development mode for testing
    type: 'module', // Use module type for service worker
  },
};

export default defineConfig({
  plugins: [react(), VitePWA(pwaOptions)],
});