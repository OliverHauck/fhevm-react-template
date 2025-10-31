# FHEVM React Template

A React template for building confidential dApps with Zama's fhEVM using the Universal FHEVM SDK.

## Features

- ⚛️ React 18
- 🔒 Full FHE encryption support
- 🎨 Modern UI components
- 📦 Ready to use SDK integration
- 🔧 TypeScript support

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Build

```bash
npm run build
```

Builds the app for production to the `build` folder.

## Usage

### Basic Encryption

```tsx
import { FHEVMProvider, useFHEVM } from '@astral/fhevm-sdk/react';

function App() {
  return (
    <FHEVMProvider config={{ chainId: 11155111 }}>
      <MyComponent />
    </FHEVMProvider>
  );
}

function MyComponent() {
  const fhevm = useFHEVM();

  const handleEncrypt = async () => {
    const encrypted = await fhevm.encrypt.uint8(42);
    console.log('Encrypted:', encrypted);
  };

  return <button onClick={handleEncrypt}>Encrypt</button>;
}
```

## Learn More

- [FHEVM SDK Documentation](https://docs.zama.ai/fhevm)
- [React Documentation](https://reactjs.org/)

## License

MIT
