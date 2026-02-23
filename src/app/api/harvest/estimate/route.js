import { NextResponse } from 'next/server';
import { calculateHarvestEstimate } from '@/lib/utils/calculations';
import { withAuth } from '@/lib/auth/middleware';

async function handler(request) {
  try {
    const data = await request.json();

    if (!data.landSize || !data.expectedYieldPerUnit) {
      return NextResponse.json(
        { error: 'Land size and expected yield per unit are required' },
        { status: 400 }
      );
    }

    const estimate = calculateHarvestEstimate(data);

    return NextResponse.json({
      success: true,
      estimate,
      inputs: data,
    });
  } catch (error) {
    console.error('Harvest estimate error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const POST = withAuth(handler);

