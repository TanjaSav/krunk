import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const client = await clientPromise;
    const database = client.db("twitter");
    const collection = database.collection("posts");
    
    const result = await collection.insertOne({
      ...body,
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