import React, { useState } from 'react';
import { useFHEVM } from '@astral/fhevm-sdk/react';

function EncryptionDemo() {
  const fhevm = useFHEVM();
  const [value, setValue] = useState('');
  const [encrypted, setEncrypted] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEncrypt = async () => {
    if (!value) {
      setError('Please enter a value');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fhevm.encrypt.uint8(Number(value));
      setEncrypted(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Encryption failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="encryption-demo">
      <h2>Encryption Demo</h2>

      <div className="input-group">
        <label htmlFor="value-input">Enter a value (0-255):</label>
        <input
          id="value-input"
          type="number"
          min="0"
          max="255"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter a number..."
        />
      </div>

      <button
        onClick={handleEncrypt}
        disabled={loading || !value}
        className="encrypt-button"
      >
        {loading ? 'Encrypting...' : 'Encrypt Value'}
      </button>

      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}

      {encrypted && (
        <div className="result">
          <h3>Encrypted Result:</h3>
          <div className="encrypted-value">
            {encrypted.substring(0, 60)}...
          </div>
          <p className="info-text">
            Your data has been encrypted using Fully Homomorphic Encryption!
          </p>
        </div>
      )}
    </div>
  );
}

export default EncryptionDemo;
