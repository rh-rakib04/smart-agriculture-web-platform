import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/mongodb';
import { COLLECTIONS, getCollection } from '@/lib/db/collections';

export async function GET(request) {
  try {
    const db = await getDatabase();
    const cropsCollection = getCollection(db, COLLECTIONS.CROPS);
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const skip = parseInt(url.searchParams.get('skip') || '0');
    const status = url.searchParams.get('status');

    const query = {};
    if (status) {
      query.status = status;
    }

    const crops = await cropsCollection
      .find(query)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ crops, count: crops.length });
  } catch (error) {
    console.error('Crops API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const db = await getDatabase();
    const cropsCollection = getCollection(db, COLLECTIONS.CROPS);

    const result = await cropsCollection.insertOne({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { success: true, id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create crop error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


