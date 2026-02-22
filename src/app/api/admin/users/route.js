import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/mongodb';
import { COLLECTIONS, getCollection } from '@/lib/db/collections';
import { withAuth } from '@/lib/auth/middleware';

async function handler(request) {
  try {
    const db = await getDatabase();
    const usersCollection = getCollection(db, COLLECTIONS.USERS);

    if (request.method === 'GET') {
      const url = new URL(request.url);
      const limit = parseInt(url.searchParams.get('limit') || '20');
      const skip = parseInt(url.searchParams.get('skip') || '0');
      const role = url.searchParams.get('role');

      const query = {};
      if (role) {
        query.role = role;
      }

      const users = await usersCollection
        .find(query)
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 })
        .toArray();

      // Remove sensitive data
      const sanitizedUsers = users.map(user => ({
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
      }));

      return NextResponse.json({ users: sanitizedUsers, count: sanitizedUsers.length });
    }

    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  } catch (error) {
    console.error('Admin users API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler, ['admin']);

