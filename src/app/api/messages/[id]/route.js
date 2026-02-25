import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/mongodb';
import { COLLECTIONS, getCollection } from '@/lib/db/collections';
import { ObjectId } from 'mongodb';
import { withAuth } from '@/lib/auth/middleware';

async function handler(request, { params }) {
  try {
    const { id } = params;
    const db = await getDatabase();
    const messagesCollection = getCollection(db, COLLECTIONS.MESSAGES);

    if (request.method === 'GET') {
      const message = await messagesCollection.findOne({ _id: new ObjectId(id) });

      if (!message) {
        return NextResponse.json(
          { error: 'Message not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ message });
    }

    if (request.method === 'PUT') {
      const data = await request.json();
      const result = await messagesCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: data }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json(
          { error: 'Message not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true });
    }

    if (request.method === 'DELETE') {
      const result = await messagesCollection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return NextResponse.json(
          { error: 'Message not found' },
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
    console.error('Message API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler);
export const PUT = withAuth(handler);
export const DELETE = withAuth(handler);

