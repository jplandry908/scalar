import { createViteBuildOptions } from '@scalar/build-tooling/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

import tailwindcss from '@tailwindcss/vite'
import svgLoader from 'vite-svg-loader'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    // Ensure the viewBox is preserved
    svgLoader({
      svgoConfig: {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                // @see https://github.com/svg/svgo/issues/1128
                removeViewBox: false,
              },
            },
          },
        ],
      },
    }),
  ],
  build: createViteBuildOptions({
    entry: ['src/index.ts'],
  }),
})
