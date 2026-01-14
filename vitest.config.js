import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        include: ['tests/**/*.test.js'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
            include: ['public/**/*.js'],
            exclude: [
                'public/firebase-config.js',
                'public/app.js',
                'public/screens/**'
            ]
        },
        setupFiles: ['./tests/setup.js']
    },
    resolve: {
        alias: {
            '@': '/public'
        }
    }
});
