import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return

          if (id.includes("country-state-city")) return "location-data"
          if (id.includes("lucide-react")) return "icons"

          return "vendor"
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
