import { createFHEVM } from '@astral/fhevm-sdk';

async function main() {
  console.log('🌟 Universal FHEVM SDK - Node.js Example\n');

  // Initialize SDK
  console.log('📦 Initializing FHEVM SDK...');
  const fhevm = await createFHEVM({ chainId: 11155111 });
  console.log('✅ SDK initialized!\n');

  // Example 1: Encrypt uint8
  console.log('🔒 Example 1: Encrypting uint8...');
  const encrypted8 = await fhevm.encrypt.uint8(42);
  console.log('✅ Encrypted uint8(42)');
  console.log('   Data length:', encrypted8.data.length, 'bytes');
  console.log('   Handles:', encrypted8.handles.length, '\n');

  // Example 2: Encrypt uint16
  console.log('🔒 Example 2: Encrypting uint16...');
  const encrypted16 = await fhevm.encrypt.uint16(1000);
  console.log('✅ Encrypted uint16(1000)');
  console.log('   Data length:', encrypted16.data.length, 'bytes');
  console.log('   Handles:', encrypted16.handles.length, '\n');

  // Example 3: Encrypt boolean
  console.log('🔒 Example 3: Encrypting boolean...');
  const encryptedBool = await fhevm.encrypt.bool(true);
  console.log('✅ Encrypted bool(true)');
  console.log('   Data length:', encryptedBool.data.length, 'bytes');
  console.log('   Handles:', encryptedBool.handles.length, '\n');

  // Example 4: Contract input
  console.log('📝 Example 4: Creating contract input...');
  const contractAddr = '0x3897f97Cdfa21926450B05329B55AC7F85F7F066';
  const userAddr = '0x1234567890123456789012345678901234567890';

  const input = fhevm.contract.createInput(contractAddr, userAddr);

  // Chain multiple values
  input
    .add8(42)
    .add16(1000)
    .addBool(true);

  console.log('✅ Added 3 encrypted values');

  // Generate proof
  console.log('🔐 Generating proof...');
  const { handles, inputProof } = await input.encrypt();
  console.log('✅ Proof generated!');
  console.log('   Handles:', handles.length);
  console.log('   Proof length:', inputProof.length, 'characters\n');

  // Example 5: All encryption types
  console.log('🔒 Example 5: All encryption types...');
  const types = [
    { name: 'uint8', value: 255, method: 'uint8' },
    { name: 'uint16', value: 65535, method: 'uint16' },
    { name: 'uint32', value: 4294967295, method: 'uint32' },
    { name: 'uint64', value: 18446744073709551615n, method: 'uint64' },
    { name: 'bool', value: false, method: 'bool' },
    { name: 'address', value: '0x1234567890123456789012345678901234567890', method: 'address' },
  ];

  for (const { name, value, method } of types) {
    const encrypted = await fhevm.encrypt[method](value);
    console.log(`   ✅ ${name}(${value}) - ${encrypted.data.length} bytes`);
  }

  console.log('\n🎉 All examples completed successfully!');
  console.log('\n📚 Next steps:');
  console.log('   - Run: npm run encrypt');
  console.log('   - Run: npm run contract');
  console.log('   - Run: npm run server');
}

main().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
