import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import deno from '@deno/vite-plugin';
import { tanstackRouter } from '@tanstack/router-plugin/vite';

/** @see https://vitejs.dev/config */
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'solid',
      autoCodeSplitting: true,
      addExtensions: true,
    }),
    solid(),
    deno(),
  ],
});
