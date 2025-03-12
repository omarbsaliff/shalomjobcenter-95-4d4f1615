
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Optimize build output for production and Netlify
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1600, // Augmenté pour éviter trop d'avertissements
    terserOptions: {
      compress: {
        drop_console: false, 
        drop_debugger: true,
      },
      format: {
        comments: false,
      },
      // Options supplémentaires pour la stabilité
      keep_classnames: true,
      keep_fnames: true,
    },
    // Improved Rollup options for better dependency handling
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs'
          ],
          // Split date-fns into a separate chunk
          dateFns: ['date-fns'],
        },
        // Ensure small chunks for better loading
        assetFileNames: 'assets/[name].[hash].[ext]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
      },
      onwarn(warning, warn) {
        // Ignore specific warnings that aren't actual issues
        if (
          warning.code === 'MODULE_LEVEL_DIRECTIVE' || 
          warning.message.includes('date-fns') ||
          warning.code === 'CIRCULAR_DEPENDENCY' ||
          warning.message.includes('sourcemap')
        ) {
          return;
        }
        warn(warning);
      }
    }
  },
  optimizeDeps: {
    include: ['date-fns', 'react-day-picker', 'terser'],
    force: true,
    esbuildOptions: {
      // Node.js global for polyfills
      define: {
        global: 'globalThis',
      },
    },
  },
  // Configure environment variables for Netlify
  define: {
    'process.env.NETLIFY': JSON.stringify(process.env.NETLIFY),
  },
  // Améliorations de la stabilité CSS
  css: {
    devSourcemap: false,
    modules: {
      scopeBehaviour: 'local'
    },
  },
}));
