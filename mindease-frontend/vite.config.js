import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        strictPort: true, // This makes Vite fail if port 3000 is not available instead of trying another port
        proxy: {
            '/api': 'http://localhost:3001'
        }
    },
    // App name displayed in the window title
    resolve: {
        alias: {
            '@': '/src',
        },
    },
});
