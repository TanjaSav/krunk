import { NextResponse } from 'next/server';
import { getSession, getUserByUsername } from '@/lib/auth';

export async function GET() {
  try {
    const username = await getSession();
    if (!username) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    
    const user = await getUserByUsername(username);
    const avatar = user?.avatar || '/images/circle.png';
    
    return NextResponse.json({ 
      authenticated: true, 
      username,
      avatar 
    });
  } catch (error: any) {
    return NextResponse.json(
      { authenticated: false, error: error.message },
      { status: 500 }
    );
  }
}
