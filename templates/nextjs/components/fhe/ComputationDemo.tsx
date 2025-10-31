/**
 * Computation Demo Component
 * Demonstrate homomorphic computation
 */

'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useComputation } from '@/hooks/useComputation';

export function ComputationDemo() {
  const { compute, computing, error, result } = useComputation();
  const [operation, setOperation] = useState<string>('add');
  const [operand1, setOperand1] = useState('');
  const [operand2, setOperand2] = useState('');

  const handleCompute = async () => {
    if (!operand1 || !operand2) {
      alert('Please enter both operands (handles)');
      return;
    }

    try {
      await compute(operation as any, operand1, operand2);
    } catch (err) {
      console.error('Computation failed:', err);
    }
  };

  return (
    <Card
      title="⚡ Homomorphic Computation"
      description="Perform computations on encrypted data"
    >
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">
            Operation
          </label>
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
            disabled={computing}
          >
            <option value="add">Addition (+)</option>
            <option value="sub">Subtraction (-)</option>
            <option value="mul">Multiplication (×)</option>
            <option value="div">Division (÷)</option>
            <option value="eq">Equal (==)</option>
            <option value="ne">Not Equal (!=)</option>
            <option value="lt">Less Than (&lt;)</option>
            <option value="lte">Less Than or Equal (&lt;=)</option>
            <option value="gt">Greater Than (&gt;)</option>
            <option value="gte">Greater Than or Equal (&gt;=)</option>
          </select>
        </div>

        <Input
          label="Operand 1 (encrypted handle)"
          value={operand1}
          onChange={(e) => setOperand1(e.target.value)}
          placeholder="0x..."
          disabled={computing}
        />

        <Input
          label="Operand 2 (encrypted handle)"
          value={operand2}
          onChange={(e) => setOperand2(e.target.value)}
          placeholder="0x..."
          disabled={computing}
        />

        <Button
          onClick={handleCompute}
          loading={computing}
          className="w-full"
        >
          {computing ? 'Computing...' : 'Compute on Encrypted Data'}
        </Button>

        {error && (
          <div className="bg-red-900/20 text-red-400 p-3 rounded-md text-sm">
            ❌ {error}
          </div>
        )}

        {result && !error && (
          <div className="bg-green-900/20 text-green-400 p-3 rounded-md text-sm">
            ✅ Computation successful!
            <div className="mt-2 font-mono text-xs">
              Result handle: {result}
            </div>
          </div>
        )}

        <div className="bg-blue-900/20 text-blue-300 p-3 rounded-md text-sm">
          💡 <strong>Note:</strong> Homomorphic computations are performed on-chain
          without decrypting the data. The result remains encrypted.
        </div>
      </div>
    </Card>
  );
}
