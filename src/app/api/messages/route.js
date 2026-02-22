import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/mongodb';
import { COLLECTIONS, getCollection } from '@/lib/db/collections';
import { withAuth } from '@/lib/auth/middleware';

async function handler(request) {
  try {
    const db = await getDatabase();
    const messagesCollection = getCollection(db, COLLECTIONS.MESSAGES);

    if (request.method === 'GET') {
      const url = new URL(request.url);
      const userId = url.searchParams.get('userId');
      const limit = parseInt(url.searchParams.get('limit') || '50');

      const query = {};
      if (userId) {
        query.participants = { $in: [userId] };
      }

      const messages = await messagesCollection
        .find(query)
        .limit(limit)
        .sort({ createdAt: -1 })
        .toArray();

      return NextResponse.json({ messages, count: messages.length });
    }

    if (request.method === 'POST') {
      const data = await request.json();
      const result = await messagesCollection.insertOne({
        ...data,
        createdAt: new Date(),
        read: false,
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
    console.error('Messages API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler);
export const POST = withAuth(handler);


