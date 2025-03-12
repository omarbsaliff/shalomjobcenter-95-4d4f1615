
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
    terserOptions: {
      compress: {
        drop_console: false, 
        drop_debugger: true,
      },
      format: {
        comments: false,
      }
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
      },
      onwarn(warning, warn) {
        // Ignore specific warnings that aren't actual issues
        if (
          warning.code === 'MODULE_LEVEL_DIRECTIVE' || 
          warning.message.includes('date-fns') ||
          warning.code === 'CIRCULAR_DEPENDENCY'
        ) {
          return;
        }
        warn(warning);
      }
    }
  },
  optimizeDeps: {
    include: ['date-fns'],
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
}));
