# Vue 3 + FHEVM SDK Example

Complete example of using the Universal FHEVM SDK with Vue 3.

## Features

- ✅ **Encryption Demo** - Encrypt different data types
- ✅ **Contract Interaction** - Submit encrypted data to smart contracts
- ✅ **Decryption Demo** - Request and display decrypted values
- ✅ **TypeScript Support** - Full type safety
- ✅ **Reactive Composables** - Vue 3 Composition API
- ✅ **Modern UI** - Beautiful gradient design

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

### 3. Open Browser

Navigate to `http://localhost:5173`

## Project Structure

```
vue-example/
├── src/
│   ├── components/
│   │   ├── EncryptionDemo.vue    # Encryption examples
│   │   ├── ContractDemo.vue      # Contract interaction
│   │   └── DecryptionDemo.vue    # Decryption examples
│   ├── App.vue                   # Main app component
│   └── main.ts                   # App entry point
├── package.json
└── README.md
```

## SDK Usage Examples

### Encryption

```vue
<script setup>
import { ref } from 'vue';
import { useEncrypt } from '@astral/fhevm-sdk/vue';

const { encrypt, encrypting, error } = useEncrypt();
const value = ref(42);

const handleEncrypt = async () => {
  await encrypt(value.value, 'uint8');
};
</script>

<template>
  <button @click="handleEncrypt" :disabled="encrypting">
    {{ encrypting ? 'Encrypting...' : 'Encrypt' }}
  </button>
</template>
```

### Contract Interaction

```vue
<script setup>
import { useContract } from '@astral/fhevm-sdk/vue';

const { createInput } = useContract();

const submitToContract = async () => {
  const input = createInput(contractAddr, userAddr);
  input.add8(42);
  const { handles, inputProof } = await input.encrypt();
  await contract.submit(handles, inputProof);
};
</script>
```

### Decryption

```vue
<script setup>
import { ref } from 'vue';
import { useDecrypt } from '@astral/fhevm-sdk/vue';

const { requestDecryption, decrypting } = useDecrypt();
const value = ref(null);

const handleDecrypt = async () => {
  value.value = await requestDecryption(handle, contractAddr);
};
</script>
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Technologies

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **FHEVM SDK** - Fully Homomorphic Encryption
- **Ethers.js** - Ethereum library

## Learn More

- [FHEVM SDK Documentation](../../lib/fhevm-sdk/README.md)
- [API Reference](../../lib/fhevm-sdk/docs/API.md)
- [Vue Documentation](https://vuejs.org/)

## Support

- 💬 [Discord Community](https://discord.gg/zama)
- 🐛 [Report Issues](https://github.com/OliverHauck/fheAstralCompatibility/issues)
- 📚 [Full Documentation](https://github.com/OliverHauck/fheAstralCompatibility)

---

**Built with ❤️ using Universal FHEVM SDK**
