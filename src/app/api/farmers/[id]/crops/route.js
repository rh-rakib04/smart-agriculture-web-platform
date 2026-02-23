import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/mongodb';
import { COLLECTIONS, getCollection } from '@/lib/db/collections';
import { ObjectId } from 'mongodb';
import { withAuth } from '@/lib/auth/middleware';

async function handler(request, { params }) {
  try {
    const { id } = params;
    const db = await getDatabase();
    const cropsCollection = getCollection(db, COLLECTIONS.CROPS);

    if (request.method === 'GET') {
      const crops = await cropsCollection
        .find({ farmerId: id })
        .toArray();

      return NextResponse.json({ crops, count: crops.length });
    }

    if (request.method === 'POST') {
      const data = await request.json();
      const result = await cropsCollection.insertOne({
        ...data,
        farmerId: id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return NextResponse.json(
        { success: true, id: result.insertedId },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  } catch (error) {
    console.error('Farmer crops API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler);
export const POST = withAuth(handler);

