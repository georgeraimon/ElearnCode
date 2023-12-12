import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
 
  plugins: [react()],
  optimizeDeps: {
    include: ['react-page-progress']
  },
  "compilerOptions": {
    "types": ["ace-builds"]
  },
   build: {
    chunkSizeWarningLimit: 16000,
        rollupOptions: {
            output:{
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return id.toString().split('node_modules/')[1].split('/')[0].toString();
                    }
                }
            }
        }
    }
})
/*import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig(({ command, mode }) => {
  
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // vite config
    define: {
      VITE__APP_ENV__: JSON.stringify(env.APP_ENV),
    },
  }
})
*/
