import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/mongodb';
import { COLLECTIONS, getCollection } from '@/lib/db/collections';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const db = await getDatabase();
    const cropsCollection = getCollection(db, COLLECTIONS.CROPS);

    const crop = await cropsCollection.findOne({ _id: new ObjectId(id) });

    if (!crop) {
      return NextResponse.json(
        { error: 'Crop not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ crop });
  } catch (error) {
    console.error('Get crop error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    const db = await getDatabase();
    const cropsCollection = getCollection(db, COLLECTIONS.CROPS);

    const result = await cropsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Crop not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update crop error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const db = await getDatabase();
    const cropsCollection = getCollection(db, COLLECTIONS.CROPS);

    const result = await cropsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Crop not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete crop error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


