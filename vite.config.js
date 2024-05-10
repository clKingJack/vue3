import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import path from 'path';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import vueJsx from '@vitejs/plugin-vue-jsx';
import eslint from 'vite-plugin-eslint';
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    server: {
        port: 8000,
        proxy: {
            // 字符串简写写法
            '/foo': 'http://localhost:4567/foo',
            // 选项写法
            '/api': {
                target: 'http://jsonplaceholder.typicode.com',
                changeOrigin: true,
                // 如果接口中不包含 api，用 rewrite 覆盖
                // rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
    },

    plugins: [
        vue(),AutoImport({
            imports:['vue'],
            dts:'./src/auto-imports.d.ts',
            eslintrc: {
                enabled: false, // Default `false`
              },
        }),
        vueJsx(),
        viteCommonjs(),
        Components({
            resolvers: [AntDesignVueResolver()],
        }),
        eslint(),

     
    ],
});
