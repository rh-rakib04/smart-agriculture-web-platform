import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/mongodb';
import { COLLECTIONS, getCollection } from '@/lib/db/collections';
import { createSession } from '@/lib/auth/session';
import { generateToken } from '@/lib/auth/jwt';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const usersCollection = getCollection(db, COLLECTIONS.USERS);

    // Find user by email
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // TODO: Verify password hash (use bcrypt)
    // For now, placeholder
    // const isValidPassword = await bcrypt.compare(password, user.password);
    // if (!isValidPassword) {
    //   return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    // }

    // Create session
    const { token } = await createSession(user._id.toString(), {
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


