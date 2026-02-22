import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/mongodb';
import { COLLECTIONS, getCollection } from '@/lib/db/collections';
import { ObjectId } from 'mongodb';
import { withAuth } from '@/lib/auth/middleware';

async function handler(request, { params }) {
  try {
    const { id } = params;
    const db = await getDatabase();
    const farmersCollection = getCollection(db, COLLECTIONS.FARMERS);

    if (request.method === 'GET') {
      const farmer = await farmersCollection.findOne({ _id: new ObjectId(id) });
      
      if (!farmer) {
        return NextResponse.json(
          { error: 'Farmer not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ farmer });
    }

    if (request.method === 'PUT') {
      const data = await request.json();
      const result = await farmersCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...data, updatedAt: new Date() } }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json(
          { error: 'Farmer not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true });
    }

    if (request.method === 'DELETE') {
      const result = await farmersCollection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return NextResponse.json(
          { error: 'Farmer not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  } catch (error) {
    console.error('Farmer API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler);
export const PUT = withAuth(handler);
export const DELETE = withAuth(handler, ['admin']);


