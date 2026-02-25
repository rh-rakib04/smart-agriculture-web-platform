import { NextResponse } from 'next/server';
import { getCurrentWeather } from '@/lib/services/weather';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const lat = parseFloat(url.searchParams.get('lat'));
    const lon = parseFloat(url.searchParams.get('lon'));

    if (!lat || !lon) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    const weather = await getCurrentWeather(lat, lon);

    return NextResponse.json({
      success: true,
      weather,
    });
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}

