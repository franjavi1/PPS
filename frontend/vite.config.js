import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // 1. Activar la división de código nativa
    codeSplitting: true,
    rolldownOptions: {
      output: {
        // 2. Fragmentar manualmente las librerías del node_modules
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Separa React y librerías core del resto del código de la app
            if (id.includes('react')) {
              return 'vendor-react';
            }
            return 'vendor-helpers';
          }
        },
      },
    },
    // Ajustar levemente el límite de advertencia si fuera necesario
    chunkSizeWarningLimit: 600,
  },
})