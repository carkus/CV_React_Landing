import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // @carkus/seo-react is a `file:` link to a sibling repo (../carkus-seo-react)
    // that has its own node_modules/react installed locally (needed for its own
    // tsc build). Vite resolves bare imports from a linked package relative to
    // its real on-disk path, so without this it picks up that private react/
    // react-dom copy instead of this app's — two separate React module
    // instances in one bundle, and the private copy's hook dispatcher is never
    // populated (only the app's real React instance renders), which crashes
    // every useEffect call inside useDocumentMeta with "Cannot read properties
    // of null (reading 'useEffect')". dedupe forces both copies to resolve to
    // this project's own installed react/react-dom.
    dedupe: ['react', 'react-dom'],
  },
})
