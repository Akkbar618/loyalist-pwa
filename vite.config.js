import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    // Public files are in public/
    root: 'public',

    // Base path for production
    base: '/',

    // Development server
    server: {
        port: 5173,
        open: true,
        cors: true
    },

    // Build settings
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        sourcemap: true,
        target: 'esnext', // Allow top-level await
        minify: 'terser',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'public/index.html')
            },
            output: {
                manualChunks: {
                    // Firebase SDK into separate chunk
                    firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore']
                }
            }
        },
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true
            }
        }
    },

    // Optimize deps settings
    optimizeDeps: {
        esbuildOptions: {
            target: 'esnext'
        }
    },

    esbuild: {
        supported: {
            'top-level-await': true
        },
    },

    // Environment variables prefix
    envPrefix: 'VITE_',

    // Resolve aliases
    resolve: {
        alias: {
            '@': resolve(__dirname, 'public'),
            '@components': resolve(__dirname, 'public/components'),
            '@screens': resolve(__dirname, 'public/screens'),
            '@utils': resolve(__dirname, 'public/utils'),
            '@styles': resolve(__dirname, 'public/styles')
        }
    }
});
