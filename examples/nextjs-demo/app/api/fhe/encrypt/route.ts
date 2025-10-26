/**
 * Encryption API Route
 * Server-side encryption endpoint
 */

import { NextRequest, NextResponse } from 'next/server';
import { serverEncrypt, batchEncrypt } from '@/lib/fhe/server';
import { validateRequest, validateValueForType } from '@/lib/utils/validation';
import type { FHEDataType } from '@/types/fhe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Batch encryption
    if (body.batch && Array.isArray(body.items)) {
      const results = await batchEncrypt(body.items);
      return NextResponse.json({
        success: true,
        results,
        count: results.length
      });
    }

    // Single value encryption
    const validation = validateRequest(body, ['value', 'type']);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const { value, type } = body as { value: any; type: FHEDataType };

    // Validate value for type
    const typeValidation = validateValueForType(value, type);
    if (!typeValidation.valid) {
      return NextResponse.json(
        { success: false, error: typeValidation.error },
        { status: 400 }
      );
    }

    const encrypted = await serverEncrypt(value, type);

    return NextResponse.json({
      success: true,
      encrypted: {
        dataLength: encrypted.data.length,
        handlesCount: encrypted.handles.length,
        type
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
