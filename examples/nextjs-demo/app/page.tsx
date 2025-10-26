'use client';

import { FHEVMProvider } from '@astral/fhevm-sdk/react';
import EncryptionDemo from './components/EncryptionDemo';
import ContractDemo from './components/ContractDemo';
import DecryptionDemo from './components/DecryptionDemo';
import { ComputationDemo } from '@/components/fhe/ComputationDemo';
import { KeyManager } from '@/components/fhe/KeyManager';
import { BankingExample } from '@/components/examples/BankingExample';
import { MedicalExample } from '@/components/examples/MedicalExample';

export default function Home() {
  return (
    <FHEVMProvider config={{ chainId: 11155111 }}>
      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-4">
            🌟 FHEVM SDK - Next.js Demo
          </h1>
          <p className="text-gray-400 text-lg">
            Privacy-preserving encryption with Zama's FHE technology
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Complete demonstration of Fully Homomorphic Encryption in Next.js 14
          </p>
        </header>

        {/* Core SDK Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            🔧 Core SDK Features
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EncryptionDemo />
            <ContractDemo />
            <DecryptionDemo />
            <ComputationDemo />
          </div>
        </section>

        {/* System Management */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            ⚙️ System Management
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <KeyManager />
          </div>
        </section>

        {/* Real-World Examples */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            💼 Real-World Use Cases
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BankingExample />
            <MedicalExample />
          </div>
        </section>

        {/* API Documentation */}
        <section className="mb-12">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              📚 API Endpoints
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <APIEndpoint
                method="GET"
                path="/api/fhe"
                description="Check FHE service status"
              />
              <APIEndpoint
                method="POST"
                path="/api/fhe/encrypt"
                description="Encrypt values server-side"
              />
              <APIEndpoint
                method="POST"
                path="/api/fhe/decrypt"
                description="Request decryption"
              />
              <APIEndpoint
                method="POST"
                path="/api/fhe/compute"
                description="Homomorphic computation"
              />
              <APIEndpoint
                method="GET"
                path="/api/keys"
                description="Get public encryption keys"
              />
              <APIEndpoint
                method="POST"
                path="/api/keys"
                description="Manage encryption keys"
              />
            </div>
          </div>
        </section>

        <footer className="text-center py-8 border-t border-gray-800">
          <p className="text-gray-400">
            Built with{' '}
            <a
              href="https://github.com/OliverHauck/fheAstralCompatibility"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Universal FHEVM SDK
            </a>
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Next.js 14 • App Router • TypeScript • Tailwind CSS
          </p>
        </footer>
      </main>
    </FHEVMProvider>
  );
}

function APIEndpoint({
  method,
  path,
  description
}: {
  method: string;
  path: string;
  description: string;
}) {
  const methodColors: Record<string, string> = {
    GET: 'bg-blue-600',
    POST: 'bg-green-600',
    PUT: 'bg-yellow-600',
    DELETE: 'bg-red-600'
  };

  return (
    <div className="bg-gray-800 p-4 rounded-md">
      <div className="flex items-center gap-2 mb-2">
        <span className={`${methodColors[method]} text-white text-xs px-2 py-1 rounded font-mono`}>
          {method}
        </span>
        <code className="text-blue-400 text-sm">{path}</code>
      </div>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}
