import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

function manualChunks(id) {
  if (!id.includes("node_modules")) return;

  if (id.includes("/@react-three/drei/")) {
    return "three-drei";
  }

  if (id.includes("/@react-three/fiber/")) {
    return "three-fiber";
  }

  if (id.includes("/three/")) {
    return "three-core";
  }

  if (id.includes("/@supabase/supabase-js/")) {
    return "supabase";
  }

  if (id.includes("/framer-motion/")) {
    return "motion";
  }

  if (id.includes("/react-icons/") || id.includes("/lucide-react/")) {
    return "icons";
  }

  if (id.includes("/react/") || id.includes("/react-dom/")) {
    return "react-core";
  }

  return "vendor";
}

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks,
      },
    },
  },
});
