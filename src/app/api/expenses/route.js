import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/mongodb';
import { COLLECTIONS, getCollection } from '@/lib/db/collections';
import { withAuth } from '@/lib/auth/middleware';

async function handler(request) {
  try {
    const db = await getDatabase();
    const expensesCollection = getCollection(db, COLLECTIONS.EXPENSES);

    if (request.method === 'GET') {
      const url = new URL(request.url);
      const farmerId = url.searchParams.get('farmerId');
      const limit = parseInt(url.searchParams.get('limit') || '20');
      const skip = parseInt(url.searchParams.get('skip') || '0');

      const query = {};
      if (farmerId) {
        query.farmerId = farmerId;
      }

      const expenses = await expensesCollection
        .find(query)
        .limit(limit)
        .skip(skip)
        .sort({ date: -1 })
        .toArray();

      return NextResponse.json({ expenses, count: expenses.length });
    }

    if (request.method === 'POST') {
      const data = await request.json();
      const result = await expensesCollection.insertOne({
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
    console.error('Expenses API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler);
export const POST = withAuth(handler);


