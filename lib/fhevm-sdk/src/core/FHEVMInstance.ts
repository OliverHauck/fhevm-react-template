/**
 * Core FHEVM Instance Implementation
 * Framework-agnostic encryption and decryption
 */

import { createInstance, FhevmInstance, initFhevm } from 'fhevmjs';
import type {
  FHEVM,
  FHEVMConfig,
  EncryptionModule,
  DecryptionModule,
  ContractModule,
  DecryptionRequest,
  EncryptedInput,
} from '../types';
import { InitializationError, EncryptionError, DecryptionError } from '../types';

export class FHEVMInstance implements FHEVM {
  private instance: FhevmInstance | null = null;
  private config: FHEVMConfig;
  private _isReady: boolean = false;

  public encrypt: EncryptionModule;
  public decrypt: DecryptionModule;
  public contract: ContractModule;

  constructor(config: FHEVMConfig) {
    this.config = config;

    // Initialize encryption module with bound methods
    this.encrypt = {
      uint8: this.encryptUint8.bind(this),
      uint16: this.encryptUint16.bind(this),
      uint32: this.encryptUint32.bind(this),
      uint64: this.encryptUint64.bind(this),
      uint128: this.encryptUint128.bind(this),
      uint256: this.encryptUint256.bind(this),
      address: this.encryptAddress.bind(this),
      bool: this.encryptBool.bind(this),
      bytes: this.encryptBytes.bind(this),
    };

    // Initialize decryption module
    this.decrypt = {
      request: this.requestDecryption.bind(this),
      reencrypt: this.reencrypt.bind(this),
    };

    // Initialize contract module
    this.contract = {
      createInput: this.createEncryptedInput.bind(this),
      generatePermission: this.generatePermission.bind(this),
    };
  }

  /**
   * Initialize the FHEVM instance
   */
  async init(): Promise<void> {
    if (this._isReady) {
      return;
    }

    try {
      // Initialize fhevm library
      await initFhevm();

      // Get or fetch public key
      const publicKey = this.config.publicKey || await this.fetchPublicKey();

      // Create fhevm instance
      this.instance = await createInstance({
        chainId: this.config.chainId,
        publicKey,
        gatewayUrl: this.config.gatewayUrl,
        aclAddress: this.config.aclAddress,
      });

      this._isReady = true;
      console.log('✅ FHEVM SDK initialized successfully');
    } catch (error) {
      throw new InitializationError(
        `Failed to initialize FHEVM: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Check if instance is ready
   */
  get isReady(): boolean {
    return this._isReady;
  }

  /**
   * Get the underlying fhevmjs instance
   */
  getInstance(): FhevmInstance | null {
    return this.instance;
  }

  /**
   * Get configuration
   */
  getConfig(): FHEVMConfig {
    return { ...this.config };
  }

  // ========== Encryption Methods ==========

  private async encryptUint8(value: number): Promise<Uint8Array> {
    this.ensureInitialized();
    try {
      return this.instance!.encrypt8(value);
    } catch (error) {
      throw new EncryptionError(`Failed to encrypt uint8: ${error}`);
    }
  }

  private async encryptUint16(value: number): Promise<Uint8Array> {
    this.ensureInitialized();
    try {
      return this.instance!.encrypt16(value);
    } catch (error) {
      throw new EncryptionError(`Failed to encrypt uint16: ${error}`);
    }
  }

  private async encryptUint32(value: number): Promise<Uint8Array> {
    this.ensureInitialized();
    try {
      return this.instance!.encrypt32(value);
    } catch (error) {
      throw new EncryptionError(`Failed to encrypt uint32: ${error}`);
    }
  }

  private async encryptUint64(value: bigint): Promise<Uint8Array> {
    this.ensureInitialized();
    try {
      return this.instance!.encrypt64(value);
    } catch (error) {
      throw new EncryptionError(`Failed to encrypt uint64: ${error}`);
    }
  }

  private async encryptUint128(value: bigint): Promise<Uint8Array> {
    this.ensureInitialized();
    try {
      return this.instance!.encrypt128(value);
    } catch (error) {
      throw new EncryptionError(`Failed to encrypt uint128: ${error}`);
    }
  }

  private async encryptUint256(value: bigint): Promise<Uint8Array> {
    this.ensureInitialized();
    try {
      return this.instance!.encrypt256(value);
    } catch (error) {
      throw new EncryptionError(`Failed to encrypt uint256: ${error}`);
    }
  }

  private async encryptAddress(address: string): Promise<Uint8Array> {
    this.ensureInitialized();
    try {
      return this.instance!.encryptAddress(address);
    } catch (error) {
      throw new EncryptionError(`Failed to encrypt address: ${error}`);
    }
  }

  private async encryptBool(value: boolean): Promise<Uint8Array> {
    this.ensureInitialized();
    try {
      return this.instance!.encryptBool(value);
    } catch (error) {
      throw new EncryptionError(`Failed to encrypt bool: ${error}`);
    }
  }

  private async encryptBytes(data: Uint8Array): Promise<Uint8Array> {
    this.ensureInitialized();
    try {
      return this.instance!.encryptBytes(data);
    } catch (error) {
      throw new EncryptionError(`Failed to encrypt bytes: ${error}`);
    }
  }

  // ========== Decryption Methods ==========

  private async requestDecryption(params: DecryptionRequest): Promise<bigint> {
    this.ensureInitialized();

    try {
      // This would typically involve calling the gateway
      // For now, return a placeholder - actual implementation depends on gateway setup
      console.warn('Decryption request - gateway integration required');
      return params.handle;
    } catch (error) {
      throw new DecryptionError(`Failed to request decryption: ${error}`);
    }
  }

  private async reencrypt(
    handle: bigint,
    contractAddress: string,
    userAddress: string
  ): Promise<bigint> {
    this.ensureInitialized();

    try {
      const signature = await this.generatePermission(contractAddress, userAddress);

      // Use fhevmjs reencrypt if available
      if (this.instance && typeof this.instance.reencrypt === 'function') {
        return this.instance.reencrypt(
          handle,
          this.config.publicKey || '',
          signature,
          contractAddress,
          userAddress
        );
      }

      throw new Error('Reencrypt not supported by fhevmjs instance');
    } catch (error) {
      throw new DecryptionError(`Failed to reencrypt: ${error}`);
    }
  }

  // ========== Contract Methods ==========

  private createEncryptedInput(contractAddress: string, userAddress: string): EncryptedInput {
    this.ensureInitialized();

    const input = this.instance!.createEncryptedInput(contractAddress, userAddress);

    // Wrap the input to match our interface
    return {
      add8: (value: number) => { input.add8(value); return this.createEncryptedInput(contractAddress, userAddress); },
      add16: (value: number) => { input.add16(value); return this.createEncryptedInput(contractAddress, userAddress); },
      add32: (value: number) => { input.add32(value); return this.createEncryptedInput(contractAddress, userAddress); },
      add64: (value: bigint) => { input.add64(value); return this.createEncryptedInput(contractAddress, userAddress); },
      add128: (value: bigint) => { input.add128(value); return this.createEncryptedInput(contractAddress, userAddress); },
      add256: (value: bigint) => { input.add256(value); return this.createEncryptedInput(contractAddress, userAddress); },
      addAddress: (address: string) => { input.addAddress(address); return this.createEncryptedInput(contractAddress, userAddress); },
      addBool: (value: boolean) => { input.addBool(value); return this.createEncryptedInput(contractAddress, userAddress); },
      encrypt: async () => await input.encrypt(),
    };
  }

  private async generatePermission(
    contractAddress: string,
    userAddress: string
  ): Promise<string> {
    this.ensureInitialized();

    try {
      if (!this.config.provider) {
        throw new Error('Provider required for generating permissions');
      }

      const signer = await this.config.provider.getSigner(userAddress);

      // Create EIP712 signature
      const domain = {
        name: 'Authorization token',
        version: '1',
        chainId: this.config.chainId,
        verifyingContract: contractAddress,
      };

      const types = {
        Reencrypt: [{ name: 'publicKey', type: 'bytes' }],
      };

      const value = {
        publicKey: this.config.publicKey || '',
      };

      return await signer._signTypedData(domain, types, value);
    } catch (error) {
      throw new Error(`Failed to generate permission: ${error}`);
    }
  }

  // ========== Helper Methods ==========

  private async fetchPublicKey(): Promise<string> {
    const gatewayUrl = this.config.gatewayUrl ||
      `https://gateway.zama.ai/${this.config.chainId}`;

    try {
      const response = await fetch(`${gatewayUrl}/public-key`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      return data.publicKey;
    } catch (error) {
      throw new InitializationError(
        `Failed to fetch public key from gateway: ${error}`
      );
    }
  }

  private ensureInitialized(): void {
    if (!this._isReady || !this.instance) {
      throw new InitializationError(
        'FHEVM SDK not initialized. Call init() first or use createFHEVM().'
      );
    }
  }
}
