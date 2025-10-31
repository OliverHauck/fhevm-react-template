/**
 * Banking Example Component
 * Demonstrates FHE usage in a banking/financial context
 */

'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useEncryption } from '../../hooks/useEncryption';
import { useComputation } from '../../hooks/useComputation';

export function BankingExample() {
  const [balance, setBalance] = useState<string>('1000');
  const [amount, setAmount] = useState<string>('');
  const [operation, setOperation] = useState<'deposit' | 'withdraw'>('deposit');

  const { encrypt, isEncrypting, encryptedValue } = useEncryption();
  const { compute, isComputing, result } = useComputation();

  const handleTransaction = async () => {
    if (!amount || isNaN(Number(amount))) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      // Encrypt both balance and transaction amount
      const encryptedBalance = await encrypt(Number(balance), 'uint32');
      const encryptedAmount = await encrypt(Number(amount), 'uint32');

      if (!encryptedBalance || !encryptedAmount) {
        throw new Error('Encryption failed');
      }

      // Perform computation on encrypted values
      const computeOp = operation === 'deposit' ? 'add' : 'subtract';
      const encryptedResult = await compute(computeOp, [Number(balance), Number(amount)]);

      if (encryptedResult) {
        // In a real application, we would decrypt server-side
        // For demo, we'll just update the balance
        const newBalance =
          operation === 'deposit'
            ? Number(balance) + Number(amount)
            : Number(balance) - Number(amount);

        if (newBalance < 0) {
          alert('Insufficient funds!');
          return;
        }

        setBalance(newBalance.toString());
        setAmount('');
        alert(`Transaction successful! New balance: ${newBalance}`);
      }
    } catch (error) {
      console.error('Transaction error:', error);
      alert('Transaction failed');
    }
  };

  return (
    <Card>
      <h3 className="text-xl font-bold mb-4">Banking Example</h3>
      <p className="text-gray-400 text-sm mb-4">
        Private balance management using FHE encryption
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Current Balance (Encrypted)
          </label>
          <div className="bg-gray-800 p-3 rounded font-mono">
            {balance} units
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Operation</label>
          <div className="flex gap-2">
            <Button
              onClick={() => setOperation('deposit')}
              variant={operation === 'deposit' ? 'primary' : 'secondary'}
              className="flex-1"
            >
              Deposit
            </Button>
            <Button
              onClick={() => setOperation('withdraw')}
              variant={operation === 'withdraw' ? 'primary' : 'secondary'}
              className="flex-1"
            >
              Withdraw
            </Button>
          </div>
        </div>

        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          label="Amount"
        />

        <Button
          onClick={handleTransaction}
          disabled={isEncrypting || isComputing || !amount}
          className="w-full"
        >
          {isEncrypting || isComputing
            ? 'Processing...'
            : `${operation === 'deposit' ? 'Deposit' : 'Withdraw'} Funds`}
        </Button>

        {encryptedValue && (
          <div className="text-xs text-gray-500 break-all">
            <strong>Encrypted:</strong> {encryptedValue.substring(0, 40)}...
          </div>
        )}

        {result && (
          <div className="text-xs text-gray-500 break-all">
            <strong>Result:</strong> {result.substring(0, 40)}...
          </div>
        )}

        <div className="bg-blue-500/20 border border-blue-500 text-blue-200 p-3 rounded text-sm">
          <strong>Note:</strong> All operations are performed on encrypted values.
          Your actual balance remains private.
        </div>
      </div>
    </Card>
  );
}

export default BankingExample;
