import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/mongodb';
import { COLLECTIONS, getCollection } from '@/lib/db/collections';

export async function POST(request) {
  try {
    const webhookData = await request.json();
    const db = await getDatabase();
    const paymentsCollection = getCollection(db, COLLECTIONS.PAYMENTS);

    // Update payment status based on webhook
    if (webhookData.transactionId) {
      await paymentsCollection.updateOne(
        { transactionId: webhookData.transactionId },
        {
          $set: {
            status: webhookData.status,
            webhookData,
            updatedAt: new Date(),
          },
        }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Payment webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

