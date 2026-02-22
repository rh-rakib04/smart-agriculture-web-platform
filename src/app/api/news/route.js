import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/mongodb';
import { COLLECTIONS, getCollection } from '@/lib/db/collections';

export async function GET(request) {
  try {
    const db = await getDatabase();
    const newsCollection = getCollection(db, COLLECTIONS.NEWS);
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = parseInt(url.searchParams.get('skip') || '0');

    const news = await newsCollection
      .find({})
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ news, count: news.length });
  } catch (error) {
    console.error('News API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const db = await getDatabase();
    const newsCollection = getCollection(db, COLLECTIONS.NEWS);

    const result = await newsCollection.insertOne({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { success: true, id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create news error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


