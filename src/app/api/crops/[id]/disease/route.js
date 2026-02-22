import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/mongodb';
import { COLLECTIONS, getCollection } from '@/lib/db/collections';
import { ObjectId } from 'mongodb';
import { detectPlantDisease } from '@/lib/services/ai';

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const { image, cropType } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: 'Image is required' },
        { status: 400 }
      );
    }

    // Detect disease using AI service
    const detection = await detectPlantDisease(image, cropType);

    // Save detection to database
    const db = await getDatabase();
    const diseasesCollection = getCollection(db, COLLECTIONS.DISEASE_DETECTIONS);

    const result = await diseasesCollection.insertOne({
      cropId: id,
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


