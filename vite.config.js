import base44 from "@base44/vite-plugin"
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Em produção (GitHub Pages) o app é servido em /MORENTE-Projeto/.
  // Em dev (npm run dev) usa /. A var GITHUB_PAGES é definida pelo workflow.
  base: process.env.GITHUB_PAGES === 'true' ? '/MORENTE-Projeto/' : '/',
  logLevel: 'error', // Suppress warnings, only show errors
  plugins: [
    base44({
      // Support for legacy code that imports the base44 SDK with @/integrations, @/entities, etc.
      // can be removed if the code has been updated to use the new SDK imports from @base44/sdk
      legacySDKImports: process.env.BASE44_LEGACY_SDK_IMPORTS === 'true'
    }),
    react(),
  ]
});