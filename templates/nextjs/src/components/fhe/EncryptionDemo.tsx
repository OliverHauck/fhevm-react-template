'use client';

import { useState } from 'react';
import { useEncrypt, useFHEVM } from '@astral/fhevm-sdk/react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export default function EncryptionDemo() {
  const fhevm = useFHEVM();
  const { encrypt, encrypting, error } = useEncrypt();
  const [value, setValue] = useState('');
  const [encrypted, setEncrypted] = useState<string>('');

  const handleEncrypt = async () => {
    try {
      const result = await fhevm.encrypt.uint8(parseInt(value));
      setEncrypted(Buffer.from(result).toString('hex').substring(0, 32) + '...');
    } catch (err) {
      console.error('Encryption failed:', err);
    }
  };

  return (
    <Card title="Encryption Demo">
      <div className="space-y-4">
        <Input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter a number (0-255)"
        />
        <Button
          onClick={handleEncrypt}
          disabled={encrypting || !value}
          loading={encrypting}
        >
          {encrypting ? 'Encrypting...' : 'Encrypt Value'}
        </Button>
        {encrypted && (
          <div className="p-4 bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-300">Encrypted:</p>
            <p className="text-xs text-green-400 font-mono break-all">{encrypted}</p>
          </div>
        )}
        {error && (
          <div className="p-4 bg-red-900/50 rounded-lg">
            <p className="text-sm text-red-300">{error.message}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
