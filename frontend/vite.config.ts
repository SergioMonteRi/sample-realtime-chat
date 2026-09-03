import path from 'node:path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, 'src') },
  },
  server: {
    port: 5173,
    /**
     * O front fala direto com o Flask, que libera esta origem em dois
     * lugares: `CORS(app, origins=[...])` para o REST e
     * `cors_allowed_origins` do SocketIO para o canal. Cair para 5174
     * porque a 5173 esta ocupada quebraria os dois de uma vez, com um erro
     * que nao aponta para a porta — melhor falhar aqui.
     */
    strictPort: true,
  },
})
