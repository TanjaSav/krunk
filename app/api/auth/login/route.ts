import { NextResponse } from 'next/server';
import { getUserByUsername, verifyPassword, createSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, captchaToken } = body;

    // 1. Validate required fields
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    if (!captchaToken) {
      return NextResponse.json(
        { success: false, error: 'Please complete the captcha' },
        { status: 400 }
      );
    }

    // 2. Sanitize username input
    const sanitizedUsername = username.trim();

    // 3. Validate username format
    if (!sanitizedUsername || sanitizedUsername.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid username format' },
        { status: 400 }
      );
    }

    // 4. Check if user exists
    const user = await getUserByUsername(sanitizedUsername);
    if (!user || !user.password) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // 5. Verify password
    const isValidPassword = await verifyPassword(password, user.password as string);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // 6. Create session with sanitized username
    await createSession(sanitizedUsername);

    return NextResponse.json({ 
      success: true,
      message: 'Login successful'
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to login' },
      { status: 500 }
    );
  }
}
