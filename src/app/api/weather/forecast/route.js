import { NextResponse } from 'next/server';
import { getWeatherForecast } from '@/lib/services/weather';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const lat = parseFloat(url.searchParams.get('lat'));
    const lon = parseFloat(url.searchParams.get('lon'));
    const days = parseInt(url.searchParams.get('days') || '5');

    if (!lat || !lon) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    const forecast = await getWeatherForecast(lat, lon, days);

    return NextResponse.json({
      success: true,
      forecast,
    });
  } catch (error) {
    console.error('Weather forecast error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather forecast' },
      { status: 500 }
    );
  }
}

