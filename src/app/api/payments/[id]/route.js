import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/mongodb';
import { COLLECTIONS, getCollection } from '@/lib/db/collections';
import { ObjectId } from 'mongodb';
import { withAuth } from '@/lib/auth/middleware';

async function handler(request, { params }) {
  try {
    const { id } = params;
    const db = await getDatabase();
    const paymentsCollection = getCollection(db, COLLECTIONS.PAYMENTS);

    if (request.method === 'GET') {
      const payment = await paymentsCollection.findOne({ _id: new ObjectId(id) });

      if (!payment) {
        return NextResponse.json(
          { error: 'Payment not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ payment });
    }

    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  } catch (error) {
    console.error('Payment API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler);


