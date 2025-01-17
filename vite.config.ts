import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dts from 'vite-plugin-dts'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), dts({tsconfigPath: resolve(__dirname, "tsconfig.lib.json"), rollupTypes: true}), libInjectCss(),],
  build: {
    copyPublicDir: false,
    lib: {
      entry: [resolve(__dirname, 'lib/react.tsx'), resolve(__dirname, 'lib/lib.ts')],
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  },
})
