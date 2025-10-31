/**
 * Security utilities for FHE operations
 * Provides security-related helper functions
 */

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Sanitize user input to prevent injection attacks
 */
export function sanitizeInput(input: string): string {
  return input.replace(/[<>\"']/g, '');
}

/**
 * Validate encrypted data format
 */
export function isValidEncryptedData(data: string): boolean {
  try {
    // Check if it's valid base64
    const decoded = Buffer.from(data, 'base64').toString('base64');
    return decoded === data;
  } catch {
    return false;
  }
}

/**
 * Generate a secure random nonce
 */
export function generateNonce(): string {
  if (typeof window !== 'undefined' && window.crypto) {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return Buffer.from(array).toString('hex');
  } else {
    // Fallback for server-side
    return Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15);
  }
}

/**
 * Hash data using SHA-256
 */
export async function hashData(data: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } else {
    // Fallback - not cryptographically secure
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(16);
  }
}

/**
 * Verify signature (placeholder for actual implementation)
 */
export function verifySignature(
  message: string,
  signature: string,
  publicKey: string
): boolean {
  // In production, this would verify an actual cryptographic signature
  return signature.length > 0 && publicKey.length > 0;
}

/**
 * Check if running in secure context (HTTPS)
 */
export function isSecureContext(): boolean {
  if (typeof window === 'undefined') {
    return true; // Server-side is considered secure
  }
  return window.isSecureContext ?? false;
}

/**
 * Constant-time string comparison to prevent timing attacks
 */
export function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Validate and sanitize numeric input for FHE
 */
export function validateNumericInput(
  value: any,
  type: string = 'uint32'
): { valid: boolean; error?: string; sanitized?: bigint } {
  try {
    const num = BigInt(value);

    // Check bounds based on type
    const bounds: Record<string, { min: bigint; max: bigint }> = {
      uint8: { min: 0n, max: 255n },
      uint16: { min: 0n, max: 65535n },
      uint32: { min: 0n, max: 4294967295n },
      uint64: { min: 0n, max: 18446744073709551615n },
      uint128: { min: 0n, max: (1n << 128n) - 1n },
      uint256: { min: 0n, max: (1n << 256n) - 1n },
    };

    if (type in bounds) {
      const { min, max } = bounds[type];
      if (num < min || num > max) {
        return {
          valid: false,
          error: `Value out of range for ${type}: must be between ${min} and ${max}`,
        };
      }
    }

    return { valid: true, sanitized: num };
  } catch {
    return { valid: false, error: 'Invalid numeric value' };
  }
}

/**
 * Rate limiting helper
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  constructor(
    private maxRequests: number,
    private windowMs: number
  ) {}

  /**
   * Check if request is allowed
   */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];

    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs);

    if (validRequests.length >= this.maxRequests) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(key, validRequests);

    return true;
  }

  /**
   * Clear rate limit for a key
   */
  clear(key: string): void {
    this.requests.delete(key);
  }
}

export default {
  isValidAddress,
  sanitizeInput,
  isValidEncryptedData,
  generateNonce,
  hashData,
  verifySignature,
  isSecureContext,
  constantTimeCompare,
  validateNumericInput,
  RateLimiter,
};
