import { NextResponse } from 'next/server';
import { deleteSession } from '@/lib/auth/session';

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      await deleteSession(token);
    }

    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    // Clear the httpOnly cookie that middleware uses for route protection
    response.cookies.set("authToken", "", {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge:   0,   // immediately expire
      path:     "/",
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}