'use client';

import { useState } from 'react';
import { useEncrypt } from '@astral/fhevm-sdk/react';

export default function EncryptionDemo() {
  const { encrypt, encrypting, error } = useEncrypt();
  const [value, setValue] = useState('42');
  const [type, setType] = useState<'uint8' | 'uint16' | 'uint32' | 'bool'>('uint8');
  const [result, setResult] = useState('');

  const handleEncrypt = async () => {
    try {
      setResult('');
      let val: any = type === 'bool' ? value === 'true' : parseInt(value);
      await encrypt(val, type);
      setResult(`✅ Successfully encrypted ${val} as ${type}!`);
    } catch (err: any) {
      setResult(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className="card">
      <h2>🔒 Encryption Demo</h2>
      <p className="description">Encrypt data using FHE technology</p>

      <div className="form-group">
        <label>Value:</label>
        <input
          type={type === 'bool' ? 'text' : 'number'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={type === 'bool' ? 'true or false' : 'Enter a value'}
          disabled={encrypting}
        />
      </div>

      <div className="form-group">
        <label>Type:</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as any)}
          disabled={encrypting}
        >
          <option value="uint8">uint8 (0-255)</option>
          <option value="uint16">uint16 (0-65535)</option>
          <option value="uint32">uint32</option>
          <option value="bool">boolean</option>
        </select>
      </div>

      <button
        onClick={handleEncrypt}
        disabled={encrypting}
        className="btn-primary"
      >
        {encrypting ? '⏳ Encrypting...' : '🔒 Encrypt'}
      </button>

      {error && (
        <div className="error-box">❌ {error.message}</div>
      )}

      {result && !error && (
        <div className="success-box">{result}</div>
      )}
    </div>
  );
}
