import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/mongodb';
import { COLLECTIONS, getCollection } from '@/lib/db/collections';
import { processPayment } from '@/lib/services/payment';
import { withAuth } from '@/lib/auth/middleware';

async function handler(request) {
  try {
    const db = await getDatabase();
    const paymentsCollection = getCollection(db, COLLECTIONS.PAYMENTS);

    if (request.method === 'GET') {
      const url = new URL(request.url);
      const buyerId = url.searchParams.get('buyerId');
      const farmerId = url.searchParams.get('farmerId');
      const limit = parseInt(url.searchParams.get('limit') || '20');

      const query = {};
      if (buyerId) query.buyerId = buyerId;
      if (farmerId) query.farmerId = farmerId;

      const payments = await paymentsCollection
        .find(query)
        .limit(limit)
        .sort({ createdAt: -1 })
        .toArray();

      return NextResponse.json({ payments, count: payments.length });
    }

    if (request.method === 'POST') {
      const paymentData = await request.json();

      // Process payment
      const paymentResult = await processPayment(paymentData);

      // Save payment record
      const result = await paymentsCollection.insertOne({
        ...paymentData,
        transactionId: paymentResult.transactionId,
        status: paymentResult.status,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return NextResponse.json(
        {
          success: true,
          payment: {
            id: result.insertedId,
            ...paymentResult,
          },
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  } catch (error) {
    console.error('Payments API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler);
export const POST = withAuth(handler);


