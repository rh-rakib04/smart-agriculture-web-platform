import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/mongodb';
import { COLLECTIONS, getCollection } from '@/lib/db/collections';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const db = await getDatabase();
    const newsCollection = getCollection(db, COLLECTIONS.NEWS);

    const news = await newsCollection.findOne({ _id: new ObjectId(id) });

    if (!news) {
      return NextResponse.json(
        { error: 'News not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ news });
  } catch (error) {
    console.error('Get news error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

