/**
 * Medical Example Component
 * Demonstrates FHE for confidential health data
 */

'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useEncryption } from '@/hooks/useEncryption';

export function MedicalExample() {
  const { encrypt, encrypting, error } = useEncryption();
  const [heartRate, setHeartRate] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');
  const [glucose, setGlucose] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmitRecords = async () => {
    if (!heartRate || !bloodPressure || !glucose) {
      alert('Please enter all health metrics');
      return;
    }

    try {
      setSuccess(false);

      // Encrypt health data
      await encrypt(parseInt(heartRate), 'uint8');
      await encrypt(parseInt(bloodPressure), 'uint8');
      await encrypt(parseInt(glucose), 'uint8');

      setSuccess(true);
    } catch (err) {
      console.error('Record submission failed:', err);
    }
  };

  return (
    <Card
      title="🏥 Confidential Health Records"
      description="Private medical data processing using FHE"
    >
      <div className="space-y-4">
        <div className="bg-gray-800 p-4 rounded-md text-sm text-gray-300">
          <p className="font-semibold mb-2">Use Case:</p>
          <p>
            Share health metrics for medical analysis without exposing sensitive
            patient data. Healthcare providers can diagnose and analyze conditions
            on encrypted medical records.
          </p>
        </div>

        <Input
          label="Heart Rate (bpm)"
          type="number"
          value={heartRate}
          onChange={(e) => setHeartRate(e.target.value)}
          placeholder="72"
          disabled={encrypting}
        />

        <Input
          label="Blood Pressure (systolic)"
          type="number"
          value={bloodPressure}
          onChange={(e) => setBloodPressure(e.target.value)}
          placeholder="120"
          disabled={encrypting}
        />

        <Input
          label="Blood Glucose (mg/dL)"
          type="number"
          value={glucose}
          onChange={(e) => setGlucose(e.target.value)}
          placeholder="100"
          disabled={encrypting}
        />

        <Button
          onClick={handleSubmitRecords}
          loading={encrypting}
          className="w-full"
        >
          {encrypting ? 'Encrypting...' : 'Submit Encrypted Health Records'}
        </Button>

        {error && (
          <div className="bg-red-900/20 text-red-400 p-3 rounded-md text-sm">
            ❌ {error}
          </div>
        )}

        {success && !error && (
          <div className="bg-green-900/20 text-green-400 p-3 rounded-md text-sm">
            ✅ Health records encrypted successfully!
            <div className="mt-2">
              Your medical data is now encrypted and can be analyzed by healthcare
              providers without revealing sensitive information.
            </div>
          </div>
        )}

        <div className="bg-blue-900/20 text-blue-300 p-3 rounded-md text-sm">
          🔒 <strong>HIPAA Compliant:</strong> Medical data remains encrypted
          during analysis, ensuring patient privacy and regulatory compliance.
        </div>
      </div>
    </Card>
  );
}
