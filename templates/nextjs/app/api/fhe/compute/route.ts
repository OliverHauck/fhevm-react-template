/**
 * Homomorphic Computation API Route
 * Server-side FHE computation endpoint
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/utils/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = validateRequest(body, ['operation', 'operand1', 'operand2']);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const { operation, operand1, operand2 } = body;

    // Validate operation type
    const validOperations = ['add', 'sub', 'mul', 'div', 'eq', 'ne', 'lt', 'lte', 'gt', 'gte'];
    if (!validOperations.includes(operation)) {
      return NextResponse.json(
        { success: false, error: `Invalid operation: ${operation}` },
        { status: 400 }
      );
    }

    // Note: Actual computation would be performed on-chain
    // This endpoint documents the computation request

    return NextResponse.json({
      success: true,
      message: 'Computation request received',
      operation,
      operands: [operand1, operand2],
      note: 'Homomorphic computation performed on-chain'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
