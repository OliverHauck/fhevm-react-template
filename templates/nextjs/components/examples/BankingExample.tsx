/**
 * Banking Example Component
 * Demonstrates FHE for confidential financial transactions
 */

'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useEncryption } from '@/hooks/useEncryption';

export function BankingExample() {
  const { encrypt, encrypting, error } = useEncryption();
  const [balance, setBalance] = useState('');
  const [amount, setAmount] = useState('');
  const [success, setSuccess] = useState(false);

  const handleTransaction = async () => {
    if (!balance || !amount) {
      alert('Please enter both balance and transaction amount');
      return;
    }

    try {
      setSuccess(false);

      // Encrypt balance
      await encrypt(parseInt(balance), 'uint32');

      // Encrypt transaction amount
      await encrypt(parseInt(amount), 'uint32');

      setSuccess(true);
    } catch (err) {
      console.error('Transaction failed:', err);
    }
  };

  return (
    <Card
      title="🏦 Confidential Banking"
      description="Private financial transactions using FHE"
    >
      <div className="space-y-4">
        <div className="bg-gray-800 p-4 rounded-md text-sm text-gray-300">
          <p className="font-semibold mb-2">Use Case:</p>
          <p>
            Process financial transactions without revealing account balances or
            transaction amounts. The bank can verify sufficient funds and process
            transfers entirely on encrypted data.
          </p>
        </div>

        <Input
          label="Account Balance ($)"
          type="number"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          placeholder="10000"
          disabled={encrypting}
        />

        <Input
          label="Transaction Amount ($)"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="500"
          disabled={encrypting}
        />

        <Button
          onClick={handleTransaction}
          loading={encrypting}
          className="w-full"
        >
          {encrypting ? 'Processing...' : 'Process Confidential Transaction'}
        </Button>

        {error && (
          <div className="bg-red-900/20 text-red-400 p-3 rounded-md text-sm">
            ❌ {error}
          </div>
        )}

        {success && !error && (
          <div className="bg-green-900/20 text-green-400 p-3 rounded-md text-sm">
            ✅ Transaction encrypted successfully!
            <div className="mt-2">
              Balance and transaction amount are now encrypted and can be
              processed confidentially on-chain.
            </div>
          </div>
        )}

        <div className="bg-blue-900/20 text-blue-300 p-3 rounded-md text-sm">
          🔒 <strong>Privacy Guarantee:</strong> Neither the account balance nor
          transaction amount is ever revealed during processing.
        </div>
      </div>
    </Card>
  );
}
