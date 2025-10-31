/**
 * Client-side FHE operations
 * Handles encryption and interaction with FHE contracts from the browser
 */

import { ethers } from 'ethers';

export interface FHEClientConfig {
  chainId: number;
  publicKey?: string;
  contractAddress?: string;
}

export class FHEClient {
  private config: FHEClientConfig;
  private provider?: ethers.providers.Web3Provider;
  private signer?: ethers.Signer;

  constructor(config: FHEClientConfig) {
    this.config = config;
  }

  /**
   * Initialize the FHE client with a web3 provider
   */
  async init(provider?: ethers.providers.Web3Provider) {
    if (provider) {
      this.provider = provider;
      this.signer = provider.getSigner();
    } else if (typeof window !== 'undefined' && (window as any).ethereum) {
      this.provider = new ethers.providers.Web3Provider((window as any).ethereum);
      this.signer = this.provider.getSigner();
    } else {
      throw new Error('No web3 provider available');
    }

    // Request account access if needed
    if ((window as any).ethereum) {
      await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
    }

    return this;
  }

  /**
   * Encrypt a value using FHE
   */
  async encrypt(value: number | bigint, type: string = 'uint32'): Promise<string> {
    try {
      // In production, this would use fhevmjs
      const response = await fetch('/api/fhe/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value, type }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error);
      }

      return data.encrypted;
    } catch (error) {
      throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Request decryption of encrypted data
   */
  async decrypt(encryptedData: string): Promise<number> {
    try {
      const response = await fetch('/api/fhe/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ encryptedData }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error);
      }

      return data.decrypted;
    } catch (error) {
      throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Perform homomorphic computation
   */
  async compute(operation: string, operands: number[]): Promise<string> {
    try {
      const response = await fetch('/api/fhe/compute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation, operands }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error);
      }

      return data.encryptedResult;
    } catch (error) {
      throw new Error(`Computation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get the current account address
   */
  async getAccount(): Promise<string> {
    if (!this.signer) {
      throw new Error('Client not initialized');
    }
    return await this.signer.getAddress();
  }

  /**
   * Get network information
   */
  async getNetwork() {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }
    return await this.provider.getNetwork();
  }
}

export default FHEClient;
