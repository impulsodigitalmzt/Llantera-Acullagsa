// Vite configuration for TanStack Start with Cloudflare Pages deployment
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    // Resuelve automáticamente los alias definidos en tsconfig.json (como @/*)
    tsconfigPaths(),
    // Tailwind v4 must be registered so @import "tailwindcss" is processed.
    tailwindcss(),
    // Cloudflare plugin enables building a Cloudflare Worker for SSR
    cloudflare({
      viteEnvironment: { name: "ssr" },
    }),
    tanstackStart({
      // Enable prerendering for static generation (optional)
      prerender: {
        enabled: true,
        crawlLinks: true,
      },
    }),
    react(),
  ],
});