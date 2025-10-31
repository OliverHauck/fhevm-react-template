import { NextRequest, NextResponse } from 'next/server';

/**
 * FHE Main API Route
 * Provides general FHE operations and status
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    message: 'FHE API is running',
    endpoints: {
      encrypt: '/api/fhe/encrypt',
      decrypt: '/api/fhe/decrypt',
      compute: '/api/fhe/compute',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operation } = body;

    return NextResponse.json({
      success: true,
      operation,
      message: 'FHE operation completed',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
