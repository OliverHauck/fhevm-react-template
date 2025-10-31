/**
 * Key Manager Component
 * Manage FHE encryption keys
 */

'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function KeyManager() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>('');

  const handleRefreshKeys = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'refresh' })
      });

      const data = await response.json();
      setStatus(data.success ? 'Keys refreshed successfully' : data.error);
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="🔑 Key Management"
      description="Manage encryption keys for FHE operations"
    >
      <div className="space-y-4">
        <div className="bg-gray-800 p-4 rounded-md">
          <p className="text-sm text-gray-400">
            Public keys are automatically fetched from the blockchain network.
            Keys are managed by the FHE system and refreshed as needed.
          </p>
        </div>

        <Button
          onClick={handleRefreshKeys}
          loading={loading}
          variant="secondary"
        >
          Refresh Public Key
        </Button>

        {status && (
          <div className={`p-3 rounded-md text-sm ${
            status.includes('Error')
              ? 'bg-red-900/20 text-red-400'
              : 'bg-green-900/20 text-green-400'
          }`}>
            {status}
          </div>
        )}
      </div>
    </Card>
  );
}
