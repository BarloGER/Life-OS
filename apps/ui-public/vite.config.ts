/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import fs from 'fs';
import path from 'path';

export default defineConfig(({ command }) => {
  console.log(command);
  if (command === 'serve') {
    return {
      root: __dirname,
      cacheDir: '../../node_modules/.vite/apps/ui-public',

      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
          '@shared/components': path.resolve(
            __dirname,
            './src/shared/components',
          ),
          '@shared/configs': path.resolve(__dirname, './src/shared/configs'),
          '@shared/context': path.resolve(__dirname, './src/shared/context'),
          '@shared/entities': path.resolve(__dirname, './src/shared/entities'),
          '@shared/layouts': path.resolve(__dirname, './src/shared/layouts'),
          '@shared/utils': path.resolve(__dirname, './src/shared/utils'),

          '@features/authentication/components': path.resolve(
            __dirname,
            './src/features/authentication/components',
          ),
        },
      },

      server: {
        port: 4200,
        host: '0.0.0.0',
        https: {
          key: fs.readFileSync(path.join(__dirname, 'certs', 'server.key')),
          cert: fs.readFileSync(path.join(__dirname, 'certs', 'server.cert')),
        },
      },

      preview: {
        port: 4300,
        host: '0.0.0.0',
      },
      plugins: [react(), nxViteTsPaths()],
      // Uncomment this if you are using workers.
      // worker: {
      //  plugins: [ nxViteTsPaths() ],
      // },
      build: {
        outDir: '../../dist/apps/ui-public',
        emptyOutDir: true,
        reportCompressedSize: true,
        commonjsOptions: {
          transformMixedEsModules: true,
        },
      },
    };
  } else {
    return {
      root: __dirname,
      cacheDir: '../../node_modules/.vite/apps/ui-public',

      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
          '@shared/components': path.resolve(
            __dirname,
            './src/shared/components',
          ),
          '@shared/configs': path.resolve(__dirname, './src/shared/configs'),
          '@shared/context': path.resolve(__dirname, './src/shared/context'),
          '@shared/entities': path.resolve(__dirname, './src/shared/entities'),
          '@shared/layouts': path.resolve(__dirname, './src/shared/layouts'),
          '@shared/utils': path.resolve(__dirname, './src/shared/utils'),

          '@features/authentication/components': path.resolve(
            __dirname,
            './src/features/authentication/components',
          ),
        },
      },

      server: {
        port: 4200,
        host: 'localhost',
      },

      preview: {
        port: 4300,
        host: 'localhost',
      },
      plugins: [react(), nxViteTsPaths()],
      // Uncomment this if you are using workers.
      // worker: {
      //  plugins: [ nxViteTsPaths() ],
      // },
      build: {
        outDir: '../../dist/apps/ui-public',
        emptyOutDir: true,
        reportCompressedSize: true,
        commonjsOptions: {
          transformMixedEsModules: true,
        },
      },
    };
  }
});
