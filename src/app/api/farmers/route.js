import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/mongodb';
import { COLLECTIONS, getCollection } from '@/lib/db/collections';
import { withAuth } from '@/lib/auth/middleware';

async function handler(request) {
  try {
    const db = await getDatabase();
    const farmersCollection = getCollection(db, COLLECTIONS.FARMERS);

    if (request.method === 'GET') {
      const url = new URL(request.url);
      const limit = parseInt(url.searchParams.get('limit') || '10');
      const skip = parseInt(url.searchParams.get('skip') || '0');

      const farmers = await farmersCollection
        .find({})
        .limit(limit)
        .skip(skip)
        .toArray();

      return NextResponse.json({ farmers, count: farmers.length });
    }

    if (request.method === 'POST') {
      const data = await request.json();
      const result = await farmersCollection.insertOne({
        ...data,
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
    console.error('Farmers API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler);
export const POST = withAuth(handler, ['admin']);


