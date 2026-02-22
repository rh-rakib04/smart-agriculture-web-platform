import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/mongodb';
import { COLLECTIONS, getCollection } from '@/lib/db/collections';
import { predictHarvestYield } from '@/lib/services/ai';
import { withAuth } from '@/lib/auth/middleware';

async function handler(request) {
  try {
    const data = await request.json();

    // Get AI prediction
    const prediction = await predictHarvestYield(data);

    // Save prediction to database
    const db = await getDatabase();
    const predictionsCollection = getCollection(db, COLLECTIONS.HARVEST_PREDICTIONS);

    const result = await predictionsCollection.insertOne({
      ...prediction,
      ...data,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      prediction: {
        ...prediction,
        id: result.insertedId,
      },
    });
  } catch (error) {
    console.error('Harvest prediction error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const POST = withAuth(handler);


