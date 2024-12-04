// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="vite" />

import { defineConfig, loadEnv, UserConfigFn } from 'vite';
import react from '@vitejs/plugin-react-swc';
import basicSsl from '@vitejs/plugin-basic-ssl';
import envCompatible from 'vite-plugin-env-compatible';
import tsConfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
const Config: UserConfigFn = ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };
  return defineConfig({
    define: {
      'import.meta.env.HOST': JSON.stringify(process.env.HOST)
    },
    plugins: [react(), envCompatible(), tsConfigPaths(), basicSsl()],
    server: {
      host: process.env.HOST,
      open: true
    }
  });
};

export default Config;
