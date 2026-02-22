import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/mongodb';
import { COLLECTIONS, getCollection } from '@/lib/db/collections';
import { createSession } from '@/lib/auth/session';
import { USER_ROLES } from '@/lib/constants/roles';

export async function POST(request) {
  try {
    const { email, password, name, role } = await request.json();

    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'Email, password, name, and role are required' },
        { status: 400 }
      );
    }

    // Validate role
    if (!Object.values(USER_ROLES).includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const usersCollection = getCollection(db, COLLECTIONS.USERS);

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // TODO: Hash password with bcrypt
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = {
      email,
      password, // Replace with hashedPassword
      name,
      role,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    // Create session
    const { token } = await createSession(result.insertedId.toString(), {
      email,
      role,
    });

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: result.insertedId.toString(),
        email,
        role,
        name,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


