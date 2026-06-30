import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const fixTensorflowPlugin = () => ({
  name: 'fix-tfjs',
  enforce: 'pre',
  transform(code, id) {
    if (id.includes('@tensorflow') || id.includes('.vite/deps')) {
      if (code.includes('import(keys, values)')) {
        code = code.replace(/async import\s*\(\s*keys\s*,\s*values\s*\)/g, 'async importData(keys, values)');
        code = code.replace(/\.import\s*\(\s*keys\s*,\s*values\s*\)/g, '.importData(keys, values)');
        return { code };
      }
    }
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), fixTensorflowPlugin()],
})
