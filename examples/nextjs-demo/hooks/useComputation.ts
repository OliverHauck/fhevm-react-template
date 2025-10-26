/**
 * useComputation Hook
 * Hook for homomorphic computation operations
 */

'use client';

import { useState } from 'react';

type Operation = 'add' | 'sub' | 'mul' | 'div' | 'eq' | 'ne' | 'lt' | 'lte' | 'gt' | 'gte';

export function useComputation() {
  const [computing, setComputing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const compute = async (
    operation: Operation,
    operand1: string,
    operand2: string
  ) => {
    try {
      setComputing(true);
      setError(null);

      const response = await fetch('/api/fhe/compute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation, operand1, operand2 })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Computation failed');
      }

      setResult(data.result || 'computed');
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setComputing(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return {
    compute,
    computing,
    error,
    result,
    reset
  };
}
