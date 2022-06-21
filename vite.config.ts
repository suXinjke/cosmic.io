import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    base: '/cosmic-io/',
    plugins: [
        react({
            fastRefresh: false,
        }),
    ],
})
