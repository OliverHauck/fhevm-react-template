/**
 * Key Management Module
 * Handles public key retrieval and management for FHE operations
 */

import type { FHEVMConfig } from '@/types/fhe';

/**
 * Fetch public key from FHEVM gateway
 */
export async function fetchPublicKey(chainId: number, gatewayUrl?: string): Promise<string> {
  const url = gatewayUrl || `https://gateway.zama.ai/${chainId}`;

  try {
    const response = await fetch(`${url}/public-key`);
    if (!response.ok) {
      throw new Error(`Failed to fetch public key: HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.publicKey;
  } catch (error) {
    throw new Error(`Failed to fetch public key: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get public key with caching
 */
const publicKeyCache = new Map<number, { key: string; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function getPublicKey(chainId: number, gatewayUrl?: string): Promise<string> {
  const cached = publicKeyCache.get(chainId);
  const now = Date.now();

  if (cached && (now - cached.timestamp) < CACHE_TTL) {
    return cached.key;
  }

  const key = await fetchPublicKey(chainId, gatewayUrl);
  publicKeyCache.set(chainId, { key, timestamp: now });

  return key;
}

/**
 * Clear public key cache
 */
export function clearPublicKeyCache(chainId?: number): void {
  if (chainId !== undefined) {
    publicKeyCache.delete(chainId);
  } else {
    publicKeyCache.clear();
  }
}
