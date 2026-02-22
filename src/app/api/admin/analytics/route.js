import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/mongodb';
import { COLLECTIONS, getCollection } from '@/lib/db/collections';
import { withAuth } from '@/lib/auth/middleware';

async function handler(request) {
  try {
    const db = await getDatabase();
    
    // Get counts for different entities
    const usersCount = await getCollection(db, COLLECTIONS.USERS).countDocuments();
    const farmersCount = await getCollection(db, COLLECTIONS.FARMERS).countDocuments();
    const buyersCount = await getCollection(db, COLLECTIONS.BUYERS).countDocuments();
    const cropsCount = await getCollection(db, COLLECTIONS.CROPS).countDocuments();
    const paymentsCount = await getCollection(db, COLLECTIONS.PAYMENTS).countDocuments();

    // Get total revenue
    const payments = await getCollection(db, COLLECTIONS.PAYMENTS)
      .find({ status: 'completed' })
      .toArray();
    
    const totalRevenue = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);

    return NextResponse.json({
      success: true,
      analytics: {
        users: {
          total: usersCount,
          farmers: farmersCount,
          buyers: buyersCount,
        },
        crops: {
          total: cropsCount,
        },
        payments: {
          total: paymentsCount,
          revenue: totalRevenue,
        },
      },
    });
  } catch (error) {
    console.error('Admin analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler, ['admin']);


