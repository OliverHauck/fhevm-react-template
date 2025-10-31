/**
 * Security Utilities
 * Helper functions for security operations
 */

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Sanitize input value
 */
export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    return input.trim();
  }
  return input;
}

/**
 * Validate numeric range
 */
export function validateRange(
  value: number,
  min: number,
  max: number
): boolean {
  return value >= min && value <= max;
}

/**
 * Hash sensitive data (for logging)
 */
export function hashSensitive(data: string): string {
  if (data.length <= 10) return '***';
  return `${data.slice(0, 4)}...${data.slice(-4)}`;
}
