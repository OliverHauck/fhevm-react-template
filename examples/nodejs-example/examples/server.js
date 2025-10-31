import express from 'express';
import { createFHEVM } from '@astral/fhevm-sdk';

const app = express();
const PORT = 3000;

app.use(express.json());

let fhevm;

async function initFHEVM() {
  console.log('Initializing FHEVM SDK...');
  fhevm = await createFHEVM({ chainId: 11155111 });
  console.log('SDK initialized');
}

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    sdkReady: fhevm?.isReady || false,
    timestamp: new Date().toISOString()
  });
});

app.post('/api/encrypt', async (req, res) => {
  try {
    const { value, type = 'uint8' } = req.body;
    
    if (!fhevm) {
      return res.status(503).json({ error: 'SDK not initialized' });
    }
    
    if (value === undefined) {
      return res.status(400).json({ error: 'Value is required' });
    }
    
    const encrypted = await fhevm.encrypt[type](parseInt(value));
    
    res.json({
      success: true,
      encrypted: Buffer.from(encrypted).toString('hex'),
      type,
      originalValue: value
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/encrypt/batch', async (req, res) => {
  try {
    const { values } = req.body;
    
    if (!fhevm) {
      return res.status(503).json({ error: 'SDK not initialized' });
    }
    
    if (!Array.isArray(values)) {
      return res.status(400).json({ error: 'Values must be an array' });
    }
    
    const results = await Promise.all(
      values.map(async ({ value, type = 'uint8' }) => {
        const encrypted = await fhevm.encrypt[type](parseInt(value));
        return {
          value,
          type,
          encrypted: Buffer.from(encrypted).toString('hex').substring(0, 32) + '...'
        };
      })
    );
    
    res.json({
      success: true,
      count: results.length,
      results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/contract/input', async (req, res) => {
  try {
    const { contractAddress, userAddress, inputs } = req.body;
    
    if (!fhevm) {
      return res.status(503).json({ error: 'SDK not initialized' });
    }
    
    const input = fhevm.contract.createInput(
      contractAddress || '0x0000000000000000000000000000000000000000',
      userAddress || '0x0000000000000000000000000000000000000000'
    );
    
    if (inputs && Array.isArray(inputs)) {
      for (const item of inputs) {
        const typeNum = item.type.replace('uint', '');
        const method = 'add' + typeNum;
        input[method](parseInt(item.value));
      }
    }
    
    const { handles, inputProof } = await input.encrypt();
    
    res.json({
      success: true,
      handlesCount: handles.length,
      proofLength: inputProof.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

async function start() {
  try {
    await initFHEVM();
    
    app.listen(PORT, () => {
      console.log('\nFHEVM Express Server running on http://localhost:' + PORT);
      console.log('\nAvailable endpoints:');
      console.log('  GET  /health                - Health check');
      console.log('  POST /api/encrypt          - Encrypt a single value');
      console.log('  POST /api/encrypt/batch    - Encrypt multiple values');
      console.log('  POST /api/contract/input   - Create contract input\n');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
