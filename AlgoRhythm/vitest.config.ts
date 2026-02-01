/// <reference types="vite/client" />
/// <reference types="vitest" />

import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "node:path"

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        sentryVitePlugin({
            org: "algorhythm",
            project: "frontend"
        })
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            react: path.resolve(__dirname, './node_modules/react'),
            'react-dom': path.resolve(__dirname, './node_modules/react-dom')
        },
    },
    server: {
        proxy: {
            '/api': {
                target: 'https://localhost:7080',
                changeOrigin: true,
                secure: false,
            },
        },
    },
    build: {
        sourcemap: true
    },
    test: {
        globals: true,
        setupFiles: './src/tests/unit/setupTests.ts',
        environment: 'happy-dom',
        css: true,                   // Tailwind
        include: [
            './src/tests/unit/**/**.{test,spec}.{js,jsx,ts,tsx}',
        ],
        exclude: [
            'node_modules',
            'dist',
            'e2e',
            'playwright',
            '**/*.spec.ts',
        ],
        reporters: ['tree'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            reportsDirectory: './coverage',
            exclude: ['node_modules/', 'src/tests/'],
        },
    },
})