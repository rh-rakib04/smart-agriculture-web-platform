import { NextResponse } from 'next/server';
import { getCropRecommendations } from '@/lib/services/ai';

export async function POST(request) {
  try {
    const conditions = await request.json();

    if (!conditions.latitude || !conditions.longitude) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    const recommendations = await getCropRecommendations(conditions);

    return NextResponse.json({
      success: true,
      recommendations,
    });
  } catch (error) {
    console.error('Crop recommendations error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

