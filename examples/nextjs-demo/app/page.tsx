'use client';

import { FHEVMProvider } from '@astral/fhevm-sdk/react';
import EncryptionDemo from './components/EncryptionDemo';
import ContractDemo from './components/ContractDemo';
import DecryptionDemo from './components/DecryptionDemo';

export default function Home() {
  return (
    <FHEVMProvider config={{ chainId: 11155111 }}>
      <main className="container">
        <header className="header">
          <h1>🌟 FHEVM SDK - Next.js Demo</h1>
          <p>Privacy-preserving encryption with Zama's FHE technology</p>
        </header>

        <div className="grid">
          <EncryptionDemo />
          <ContractDemo />
          <DecryptionDemo />
        </div>

        <footer className="footer">
          <p>
            Built with{' '}
            <a href="https://github.com/OliverHauck/fheAstralCompatibility">
              Universal FHEVM SDK
            </a>
          </p>
        </footer>
      </main>
    </FHEVMProvider>
  );
}
