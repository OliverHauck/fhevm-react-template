'use client';

import { useState } from 'react';
import { useContract, useFHEVM } from '@astral/fhevm-sdk/react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export default function ComputationDemo() {
  const fhevm = useFHEVM();
  const { createInput } = useContract();
  const [address, setAddress] = useState('');
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [result, setResult] = useState<string>('');

  const handleCompute = async () => {
    try {
      const input = createInput(
        '0x0000000000000000000000000000000000000000',
        address || '0x0000000000000000000000000000000000000000'
      );
      
      input.add8(parseInt(value1));
      input.add8(parseInt(value2));
      
      const { handles } = await input.encrypt();
      setResult(`Created encrypted inputs: ${handles.length} handles`);
    } catch (err) {
      console.error('Computation failed:', err);
      setResult('Computation failed');
    }
  };

  return (
    <Card title="Computation Demo">
      <div className="space-y-4">
        <Input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Wallet address (optional)"
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            value={value1}
            onChange={(e) => setValue1(e.target.value)}
            placeholder="Value 1"
          />
          <Input
            type="number"
            value={value2}
            onChange={(e) => setValue2(e.target.value)}
            placeholder="Value 2"
          />
        </div>
        <Button
          onClick={handleCompute}
          disabled={!value1 || !value2}
        >
          Create Encrypted Input
        </Button>
        {result && (
          <div className="p-4 bg-gray-800 rounded-lg">
            <p className="text-sm text-green-400">{result}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
