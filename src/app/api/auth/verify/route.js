import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth/middleware';

export async function GET(request) {
  try {
    const user = await authenticateRequest(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.userId,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
}


