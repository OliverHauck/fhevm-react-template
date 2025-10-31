# Node.js FHEVM SDK Demo

This example demonstrates how to integrate the FHEVM SDK into Node.js applications, including a CLI tool and an Express REST API server.

## Features

- CLI encryption tool
- Express REST API server (4 endpoints)
- Backend integration patterns
- Server-side encryption workflows
- Direct SDK core API usage

## SDK Integration

The SDK is integrated in just 3 lines:

```javascript
import { createFHEVM } from '@astral/fhevm-sdk';

const fhevm = await createFHEVM({ chainId: 11155111 });
const encrypted = await fhevm.encrypt.uint8(42);
```

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run CLI Tool

```bash
npm run cli
```

This will run various encryption examples and demonstrate SDK capabilities.

### Run Express Server

```bash
npm run server
```

The server will start on `http://localhost:3000`

## API Endpoints

### Health Check
```bash
GET /health
```

### Encrypt Single Value
```bash
POST /api/encrypt
Content-Type: application/json

{
  "value": 42,
  "type": "uint8"
}
```

### Encrypt Multiple Values
```bash
POST /api/encrypt/batch
Content-Type: application/json

{
  "values": [
    { "value": 42, "type": "uint8" },
    { "value": 1000, "type": "uint16" }
  ]
}
```

### Create Contract Input
```bash
POST /api/contract/input
Content-Type: application/json

{
  "contractAddress": "0x...",
  "userAddress": "0x...",
  "inputs": [
    { "value": 10, "type": "uint8" },
    { "value": 500, "type": "uint16" }
  ]
}
```

## Project Structure

```
nodejs-example/
├── index.js              # CLI tool
├── examples/
│   └── server.js         # Express API server
├── package.json
└── README.md
```

## SDK Usage Examples

### CLI Encryption

```javascript
import { createFHEVM } from '@astral/fhevm-sdk';

const fhevm = await createFHEVM({ chainId: 11155111 });
const encrypted = await fhevm.encrypt.uint8(42);
```

### Express API Endpoint

```javascript
app.post('/api/encrypt', async (req, res) => {
  const fhevm = await createFHEVM({ chainId: 11155111 });
  const encrypted = await fhevm.encrypt.uint8(req.body.value);
  res.json({ encrypted });
});
```

## Learn More

- [FHEVM SDK Documentation](../../lib/fhevm-sdk/README.md)
- [Express.js Documentation](https://expressjs.com/)
- [Zama FHEVM](https://docs.zama.ai/fhevm)
