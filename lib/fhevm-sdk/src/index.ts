/**
 * @astral/fhevm-sdk
 * Universal FHEVM SDK for framework-agnostic encryption and decryption
 *
 * Usage:
 * ```typescript
 * import { createFHEVM } from '@astral/fhevm-sdk';
 *
 * const fhevm = await createFHEVM({
 *   chainId: 11155111,
 *   provider: yourEthersProvider
 * });
 *
 * const encrypted = await fhevm.encrypt.uint8(42);
 * ```
 */

export * from './core/FHEVMInstance';
export * from './types';

// Main factory function
export { createFHEVM } from './core/factory';
