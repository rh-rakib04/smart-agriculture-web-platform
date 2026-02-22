import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/mongodb';
import { COLLECTIONS, getCollection } from '@/lib/db/collections';
import { detectPlantDisease } from '@/lib/services/ai';
import { withAuth } from '@/lib/auth/middleware';

async function handler(request) {
  try {
    const { image, cropType, cropId, farmerId } = await request.json();

    if (!image || !cropType) {
      return NextResponse.json(
        { error: 'Image and crop type are required' },
        { status: 400 }
      );
    }

    // Detect disease using AI
    const detection = await detectPlantDisease(image, cropType);

    // Save to database
    const db = await getDatabase();
    const diseasesCollection = getCollection(db, COLLECTIONS.DISEASE_DETECTIONS);

    const result = await diseasesCollection.insertOne({
      cropId,
      farmerId,
      cropType,
      ...detection,
      detectedAt: new Date(),
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      detection: {
        ...detection,
        id: result.insertedId,
      },
    });
  } catch (error) {
    console.error('Disease detection error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const POST = withAuth(handler);

