'use client';

import { useState } from 'react';
import { useDecrypt } from '@astral/fhevm-sdk/react';

export default function DecryptionDemo() {
  const { requestDecryption, decrypting, error } = useDecrypt();
  const [handle, setHandle] = useState('');
  const [contractAddr, setContractAddr] = useState('0x3897f97Cdfa21926450B05329B55AC7F85F7F066');
  const [decrypted, setDecrypted] = useState<number | null>(null);

  const handleDecrypt = async () => {
    try {
      setDecrypted(null);
      const result = await requestDecryption(handle, contractAddr);
      setDecrypted(result);
    } catch (err: any) {
      console.error('Decryption error:', err);
    }
  };

  return (
    <div className="card">
      <h2>🔓 Decryption Demo</h2>
      <p className="description">Request decryption of encrypted values</p>

      <div className="form-group">
        <label>Encrypted Handle:</label>
        <input
          type="text"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="0x..."
          disabled={decrypting}
        />
      </div>

      <div className="form-group">
        <label>Contract Address:</label>
        <input
          type="text"
          value={contractAddr}
          onChange={(e) => setContractAddr(e.target.value)}
          placeholder="0x..."
          disabled={decrypting}
        />
      </div>

      <button
        onClick={handleDecrypt}
        disabled={decrypting || !handle}
        className="btn-primary"
      >
        {decrypting ? '⏳ Decrypting...' : '🔓 Decrypt'}
      </button>

      <div className="info-box">
        ℹ️ Note: Decryption requires permission from the contract owner
      </div>

      {error && (
        <div className="error-box">❌ {error.message}</div>
      )}

      {decrypted !== null && (
        <div className="success-box">
          ✅ Decrypted Value: <strong>{decrypted}</strong>
        </div>
      )}
    </div>
  );
}
