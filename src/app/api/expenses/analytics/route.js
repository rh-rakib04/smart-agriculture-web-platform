import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/mongodb';
import { COLLECTIONS, getCollection } from '@/lib/db/collections';
import { withAuth } from '@/lib/auth/middleware';

async function handler(request) {
  try {
    const url = new URL(request.url);
    const farmerId = url.searchParams.get('farmerId');

    if (!farmerId) {
      return NextResponse.json(
        { error: 'Farmer ID is required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const expensesCollection = getCollection(db, COLLECTIONS.EXPENSES);

    // Get all expenses for the farmer
    const expenses = await expensesCollection
      .find({ farmerId })
      .toArray();

    // Calculate analytics
    const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
    
    // Group by category
    const byCategory = expenses.reduce((acc, exp) => {
      const category = exp.category || 'other';
      acc[category] = (acc[category] || 0) + (exp.amount || 0);
      return acc;
    }, {});

    // Group by month
    const byMonth = expenses.reduce((acc, exp) => {
      const month = new Date(exp.date).toISOString().slice(0, 7);
      acc[month] = (acc[month] || 0) + (exp.amount || 0);
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      analytics: {
        totalExpenses,
        count: expenses.length,
        byCategory,
        byMonth,
      },
    });
  } catch (error) {
    console.error('Expenses analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler);


