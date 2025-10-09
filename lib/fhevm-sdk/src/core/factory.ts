/**
 * Factory function for creating FHEVM instances
 * Provides a simple, intuitive API for developers
 */

import { FHEVMInstance } from './FHEVMInstance';
import type { FHEVMConfig, FHEVM } from '../types';

/**
 * Create and initialize a new FHEVM instance
 *
 * @example
 * ```typescript
 * // Simple setup
 * const fhevm = await createFHEVM({ chainId: 11155111 });
 *
 * // With custom config
 * const fhevm = await createFHEVM({
 *   chainId: 11155111,
 *   provider: ethersProvider,
 *   gatewayUrl: 'https://custom-gateway.example.com',
 *   publicKey: 'your-public-key'
 * });
 * ```
 */
export async function createFHEVM(config: FHEVMConfig): Promise<FHEVM> {
  const instance = new FHEVMInstance(config);
  await instance.init();
  return instance;
}

/**
 * Create FHEVM instance without auto-initialization
 * Useful when you want to control initialization timing
 */
export function createFHEVMSync(config: FHEVMConfig): FHEVMInstance {
  return new FHEVMInstance(config);
}
