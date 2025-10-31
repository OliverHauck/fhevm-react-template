#!/usr/bin/env node

import { createFHEVM } from '@astral/fhevm-sdk';

console.log('🔐 FHEVM SDK - Node.js CLI Demo\n');

async function main() {
  try {
    // Initialize SDK
    console.log('Initializing FHEVM SDK...');
    const fhevm = await createFHEVM({ chainId: 11155111 });
    console.log('✅ SDK initialized\n');

    // Example 1: Encrypt uint8
    console.log('📦 Example 1: Encrypting uint8 value');
    const value1 = 42;
    const encrypted1 = await fhevm.encrypt.uint8(value1);
    console.log(`Value: ${value1}`);
    console.log(`Encrypted (hex): ${Buffer.from(encrypted1).toString('hex').substring(0, 32)}...\n`);

    // Example 2: Encrypt uint16
    console.log('📦 Example 2: Encrypting uint16 value');
    const value2 = 1000;
    const encrypted2 = await fhevm.encrypt.uint16(value2);
    console.log(`Value: ${value2}`);
    console.log(`Encrypted (hex): ${Buffer.from(encrypted2).toString('hex').substring(0, 32)}...\n`);

    // Example 3: Encrypt uint32
    console.log('📦 Example 3: Encrypting uint32 value');
    const value3 = 1000000;
    const encrypted3 = await fhevm.encrypt.uint32(value3);
    console.log(`Value: ${value3}`);
    console.log(`Encrypted (hex): ${Buffer.from(encrypted3).toString('hex').substring(0, 32)}...\n`);

    // Example 4: Create contract input
    console.log('📦 Example 4: Creating contract input');
    const input = fhevm.contract.createInput(
      '0x0000000000000000000000000000000000000000',
      '0x0000000000000000000000000000000000000000'
    );
    input.add8(10);
    input.add16(500);
    input.add32(100000);
    
    const { handles, inputProof } = await input.encrypt();
    console.log(`Created ${handles.length} encrypted inputs`);
    console.log(`Input proof length: ${inputProof.length} bytes\n`);

    console.log('✨ All examples completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
