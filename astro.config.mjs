// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// NOTE: update `site` to your real production domain before deploying
// (used for canonical URLs + Open Graph tags).
export default defineConfig({
  site: 'https://lucky-stationery.netlify.app',
  output: 'static',
  compressHTML: true,
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          // rolldown requires a function (not an object) for manualChunks
          manualChunks(id) {
            if (id.includes("node_modules/three/") || id.includes("node_modules/@react-three/")) {
              return "three";
            }
            if (id.includes("node_modules/motion/") || id.includes("node_modules/framer-motion/")) {
              return "motion";
            }
          },
        },
      },
    },
  },
});
