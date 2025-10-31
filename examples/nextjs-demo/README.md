# Next.js FHEVM SDK Demo

This example demonstrates how to integrate the FHEVM SDK into a Next.js 14 application using the App Router.

## Features

- SDK React Hooks integration (`useEncrypt`, `useContract`, `useDecrypt`)
- FHEVMProvider for context management
- Encryption and computation demos
- Modern UI with Tailwind CSS
- TypeScript support

## SDK Integration

The SDK is integrated in just 5 lines:

```tsx
import { FHEVMProvider, useFHEVM } from '@astral/fhevm-sdk/react';

// 1. Wrap your app
<FHEVMProvider config={{ chainId: 11155111 }}>
  <App />
</FHEVMProvider>

// 2. Use in components
const fhevm = useFHEVM();
const encrypted = await fhevm.encrypt.uint8(42);
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

Open [http://localhost:3000](http://localhost:3000) to view the demo.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page with SDK provider
│   └── globals.css         # Global styles
├── components/
│   ├── fhe/               # FHE components
│   │   ├── EncryptionDemo.tsx
│   │   └── ComputationDemo.tsx
│   └── ui/                # UI components
│       ├── Card.tsx
│       ├── Button.tsx
│       └── Input.tsx
```

## SDK Usage Examples

### Encryption

```tsx
import { useEncrypt } from '@astral/fhevm-sdk/react';

const { encrypt, encrypting } = useEncrypt();
const encrypted = await encrypt(42, 'uint8');
```

### Contract Input

```tsx
import { useContract } from '@astral/fhevm-sdk/react';

const { createInput } = useContract();
const input = createInput(contractAddress, userAddress);
input.add8(42);
const { handles, inputProof } = await input.encrypt();
```

## Learn More

- [FHEVM SDK Documentation](../../lib/fhevm-sdk/README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Zama FHEVM](https://docs.zama.ai/fhevm)
