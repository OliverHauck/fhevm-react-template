/**
 * Universal FHEVM SDK - Main Entry Point
 *
 * Framework-agnostic SDK for Zama's fhEVM
 * Works with Node.js, React, Vue, Next.js, and more
 */

export { createFHEVM } from './core/factory.js';
export { FHEVMInstance } from './core/FHEVMInstance.js';

// Type exports (for TypeScript users)
export * from './types/index.js';
