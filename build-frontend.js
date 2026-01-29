const { build } = require('vite');
const path = require('path');

async function buildFrontend() {
  try {
    console.log('Building frontend with Vite...');

    await build({
      root: path.resolve(__dirname, 'client'),
      build: {
        outDir: path.resolve(__dirname, 'dist/public'),
        emptyOutDir: true,
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, 'client/src'),
          '@shared': path.resolve(__dirname, 'shared'),
          '@assets': path.resolve(__dirname, 'attached_assets'),
        },
      },
    });

    console.log('Frontend build completed successfully!');
  } catch (error) {
    console.error('Frontend build failed:', error);
    process.exit(1);
  }
}

buildFrontend();
