// my-wc-hedera-demo/vite.config.js
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// This configuration is tailored for a Vanilla JS frontend project
// that needs to use libraries originally designed for Node.js,
// ensuring that Node.js global variables and modules are polyfilled
// for browser compatibility.

export default defineConfig({
  // `plugins` is an array where you can add Vite plugins.
  // `vite-plugin-node-polyfills` is used here to provide shims for
  // Node.js core modules and globals so that packages expecting
  // a Node.js environment can work in the browser.
  plugins: [
    nodePolyfills({
      // Specific globals to polyfill.
      // By setting these to `true`, we ensure that if any code
      // (your own or from dependencies) tries to access `global.Buffer`,
      // `global.process`, or just `Buffer`, these will be correctly
      // polyfilled for the browser environment.
      globals: {
        Buffer: true,   // Polyfills `Buffer` globally
        global: true,   // Polyfills `global` object
        process: true,  // Polyfills `process` object (e.g., for process.env)
      },
      // `protocolImports: true` allows you to use "node:" protocol imports
      // (e.g., import ... from "node:buffer") in your client-side code,
      // and the plugin will resolve them to appropriate polyfills.
      protocolImports: true,
    }),
  ],

  // `optimizeDeps` allows you to control Vite's dependency pre-bundling.
  optimizeDeps: {
    esbuildOptions: {
      // `define` within `esbuildOptions` allows you to replace global identifiers
      // during the pre-bundling phase (done by esbuild).
      define: {
        // This maps any occurrence of `global` to `globalThis` in dependencies
        // processed by esbuild, which is the standard way to refer to the global
        // object in modern JavaScript environments (browser and Node.js).
        global: 'globalThis',
      },
    },
    // `include` can be used to force pre-bundling of specific dependencies.
    // This can sometimes help if Vite's auto-discovery misses something or if a
    // dependency has complex CJS/ESM interop issues. For this minimal demo,
    // explicitly including the core WalletConnect and Hedera libraries can ensure
    // they are processed consistently.
    include: [
      '@walletconnect/sign-client',
      '@hashgraph/hedera-wallet-connect',
      '@hashgraph/sdk'
      // 'buffer' // Usually handled by the nodePolyfills plugin, but explicit include doesn't hurt
    ],
  },

  // `resolve.alias` can be used to manually redirect module paths.
  // While `vite-plugin-node-polyfills` handles most Node.js built-ins,
  // an explicit alias for 'buffer' can serve as a fallback or ensure
  // any direct 'buffer' imports resolve to the polyfill.
  resolve: {
    alias: {
      // 'buffer': 'buffer/', // This redirects 'buffer' imports to the 'buffer' package from npm
                            // The nodePolyfills plugin usually makes this redundant,
                            // but can be kept as a fallback if specific issues arise.
                            // For now, relying on the plugin is cleaner.
    },
  },
});