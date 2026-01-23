import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const username = await getSession();
    if (!username) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { profilePicture } = body;

    if (!profilePicture) {
      return NextResponse.json(
        { success: false, error: 'Profile picture path is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const database = client.db('twitter');
    const users = database.collection('users');

    const result = await users.updateOne(
      { username },
      { $set: { profilePicture } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      profilePicture 
    });
  } catch (error: any) {
    console.error('Error updating profile picture:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update profile picture' },
      { status: 500 }
    );
  }
}
