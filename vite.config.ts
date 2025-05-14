import { resolve } from 'path';

import react from '@vitejs/plugin-react-swc';
import { defineConfig, loadEnv } from 'vite';

// import svgr from 'vite-plugin-svgr';
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    base: env.VITE_WEB_BASE_PATH || '/',
    plugins: [
      react()

      //   svgr({
      //     include: ['**/*.svg', '**/*.svg?react'],
      //     exclude: ['**/*.svg?url', '**/*.svg?raw', '**/*.svg?inline'],
      //   }),
    ],
    optimizeDeps: {
      exclude: ['lucide-react']
    },
    resolve: {
      alias: {
        // 使用 resolve 方法替代 path.resolve
        '@': resolve(__dirname, 'src')
      }
    },
    server: {
      host: '0.0.0.0',
      port: 8000
    }
  };
});
