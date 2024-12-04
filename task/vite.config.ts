import { defineConfig, loadEnv, UserConfig } from 'vite';

import react from '@vitejs/plugin-react-swc';
import basicSsl from '@vitejs/plugin-basic-ssl';
import envCompatible from 'vite-plugin-env-compatible';
import tsConfigPaths from 'vite-tsconfig-paths';

import webcomponentPlugin from './src/plugins/webComponentPlugin';
import injectShadowRootPlugin from './src/plugins/injectShadowRoot';
import createWebComponentPreviewPlugin from './src/plugins/createWebComponentPreviewPlugin';

const PORTS = {
  dev: 5173,
  preview: 4173
} as const;
const webComponentName = 'TaskWebComponent';
const getWebComponentTemplate = (mode: string) => {
  const port = mode === 'preview' ? PORTS.preview : PORTS.dev;
  return `<task-web-component 
    route-basename="/" 
    api-baseurl="http://localhost:${port}/api" 
    loading-delay="600"
  ></task-web-component>`;
};
const script = `/src/${webComponentName}.tsx`;

const getWebComponentConfig = (command: string): Partial<UserConfig> => {
  const mode = command === 'build' ? 'preview' : 'dev';
  const webComponent = getWebComponentTemplate(mode);
  return {
    plugins: [
      webcomponentPlugin({ script, webComponent }),
      injectShadowRootPlugin(),
      createWebComponentPreviewPlugin({ webComponentName, webComponent })
    ],
    build: {
      lib: {
        entry: script,
        formats: ['es']
      },
      minify: 'esbuild',
      sourcemap: true,
      manifest: 'manifest.wc.json',
      rollupOptions: {
        output: {
          entryFileNames: '[name].[hash].js',
          chunkFileNames: '[name].[hash].js',
          assetFileNames: '[name].[hash].[ext]',
          inlineDynamicImports: false,
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'router-vendor': ['react-router-dom'],
            markdown: ['react-markdown', 'rehype-highlight', 'remark-gfm']
          }
        }
      }
    }
  };
};

const getReactConfig = (): Partial<UserConfig> => ({
  plugins: [react(), injectShadowRootPlugin()]
});

export default defineConfig(({ mode, command }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };
  return {
    plugins: [
      envCompatible(),
      tsConfigPaths(),
      basicSsl(),
      ...(mode === 'web-component'
        ? getWebComponentConfig(command).plugins!
        : getReactConfig().plugins!)
    ],
    define: {
      'import.meta.env.HOST': JSON.stringify(process.env.HOST),
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production')
      }
    },
    build: mode === 'web-component' ? getWebComponentConfig(command).build : undefined,
    server: {
      host: process.env.HOST,
      open: false
    }
  };
});
