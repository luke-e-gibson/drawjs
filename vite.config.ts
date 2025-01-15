import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), dts({tsconfigPath: resolve(__dirname, "tsconfig.lib.json")})],
  build: {
    copyPublicDir: false,
    lib: {
      entry: [resolve(__dirname, 'lib/lib.ts'), resolve(__dirname, 'lib/react.tsx')],
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  },
})
