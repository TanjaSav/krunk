import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getUserByUsername } from '@/lib/auth';

export async function GET() {
  try {
    const username = await getSession();
    if (!username) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    
    const user = await getUserByUsername(username);
    const profilePicture = user?.profilePicture || '/images/circle.png';
    
    return NextResponse.json({ 
      authenticated: true, 
      username,
      profilePicture 
    });
  } catch (error: any) {
    return NextResponse.json(
      { authenticated: false, error: error.message },
      { status: 500 }
    );
  }
}
