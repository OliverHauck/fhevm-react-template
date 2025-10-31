# Vue 3 FHEVM SDK Demo

This example demonstrates how to integrate the FHEVM SDK into a Vue 3 application using the Composition API.

## Features

- Vue 3 Composition API
- SDK core integration
- Reactive encryption workflows
- Vite development server
- TypeScript support

## SDK Integration

The SDK is integrated in just 4 lines:

```vue
<script setup>
import { createFHEVM } from '@astral/fhevm-sdk';

// Initialize SDK
await createFHEVM({ chainId: 11155111 });

// Use SDK
const fhevm = await createFHEVM({ chainId: 11155111 });
const encrypted = await fhevm.encrypt.uint8(42);
</script>
```

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the demo.

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── main.ts              # App entry with SDK initialization
├── App.vue              # Main app component
├── style.css            # Global styles
└── components/
    ├── EncryptionDemo.vue
    └── ComputationDemo.vue
```

## SDK Usage Examples

### Encryption

```typescript
import { createFHEVM } from '@astral/fhevm-sdk';

const fhevm = await createFHEVM({ chainId: 11155111 });
const encrypted = await fhevm.encrypt.uint8(42);
```

### Contract Input

```typescript
const input = fhevm.contract.createInput(contractAddress, userAddress);
input.add8(42);
const { handles, inputProof } = await input.encrypt();
```

## Learn More

- [FHEVM SDK Documentation](../../lib/fhevm-sdk/README.md)
- [Vue 3 Documentation](https://vuejs.org/)
- [Zama FHEVM](https://docs.zama.ai/fhevm)
