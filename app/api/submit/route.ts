import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // Check if user is authenticated
    const username = await getSession();
    if (!username) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Override authorName with authenticated username for security
    const client = await clientPromise;
    const database = client.db("twitter");
    const collection = database.collection("posts");
    
    const result = await collection.insertOne({
      ...body,
      authorName: username, // Use authenticated username
      createdAt: new Date()
    });
    
    return NextResponse.json({ 
      success: true, 
      id: result.insertedId 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}