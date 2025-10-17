'use client';

import { useState } from 'react';
import { useContract } from '@astral/fhevm-sdk/react';
import { ethers } from 'ethers';

export default function ContractDemo() {
  const { createInput } = useContract();
  const [contractAddr, setContractAddr] = useState('0x3897f97Cdfa21926450B05329B55AC7F85F7F066');
  const [value, setValue] = useState('42');
  const [wallet, setWallet] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState('');

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        setResult('❌ Please install MetaMask!');
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setWallet(address);
      setResult('✅ Wallet connected!');
    } catch (err: any) {
      setResult(`❌ ${err.message}`);
    }
  };

  const handleSubmit = async () => {
    if (!wallet) {
      setResult('❌ Please connect wallet first');
      return;
    }

    try {
      setSubmitting(true);
      setResult('');

      // Create encrypted input
      const input = createInput(contractAddr, wallet);
      input.add8(parseInt(value));

      // Generate proof
      const { handles, inputProof } = await input.encrypt();

      setResult(
        `✅ Proof generated!\nHandles: ${handles.length}\nProof: ${inputProof.substring(0, 20)}...`
      );
    } catch (err: any) {
      setResult(`❌ Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h2>📝 Contract Interaction</h2>
      <p className="description">Submit encrypted data to smart contract</p>

      <div className="form-group">
        <label>Contract Address:</label>
        <input
          type="text"
          value={contractAddr}
          onChange={(e) => setContractAddr(e.target.value)}
          placeholder="0x..."
          disabled={submitting}
        />
      </div>

      <div className="form-group">
        <label>Value:</label>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter value"
          disabled={submitting}
        />
      </div>

      {!wallet ? (
        <button onClick={connectWallet} className="btn-primary">
          🔗 Connect Wallet
        </button>
      ) : (
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="btn-primary"
        >
          {submitting ? '⏳ Submitting...' : '📤 Create Encrypted Input'}
        </button>
      )}

      {wallet && (
        <div className="info-box">
          🔗 Connected: {wallet.substring(0, 6)}...{wallet.substring(38)}
        </div>
      )}

      {result && (
        <div className={result.startsWith('❌') ? 'error-box' : 'success-box'}>
          <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{result}</pre>
        </div>
      )}
    </div>
  );
}
