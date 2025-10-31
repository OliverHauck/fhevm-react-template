/**
 * FHE Main Route
 * General FHE operations endpoint
 */

import { NextRequest, NextResponse } from 'next/server';
import { initServerFHEVM } from '@/lib/fhe/server';

export async function GET(request: NextRequest) {
  try {
    const fhevm = await initServerFHEVM();

    return NextResponse.json({
      success: true,
      message: 'FHE service is running',
      status: 'initialized'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'init':
        await initServerFHEVM();
        return NextResponse.json({
          success: true,
          message: 'FHE initialized successfully'
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Unknown action' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
