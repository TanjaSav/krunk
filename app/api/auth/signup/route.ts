import { NextResponse } from 'next/server';
import { createUser, getUserByUsername, hashPassword, createSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email, password, captchaToken } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (!captchaToken) {
      return NextResponse.json(
        { success: false, error: 'Please complete the captcha' },
        { status: 400 }
      );
    }

    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Username already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    await createUser(username, email, hashedPassword);
    await createSession(username);

    return NextResponse.json({ 
      success: true,
      message: 'User created successfully'
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}
