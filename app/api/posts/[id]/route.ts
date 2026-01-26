import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

//PUT METHOD TO UPDATE A POST BY ID
export async function PUT(request: Request) {
  try {
    // Extract post ID from the URL
    const id = request.url.split("/").pop();
    // Validate ID format
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing post ID" },
        { status: 400 }
      );
    }
    // Parse request body
    const body = await request.json();
    // Validate content (prevent empty updates)
    if (!body.content || body.content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Post content cannot be empty" },
        { status: 400 }
      );
    }
    // Connect to database
    const client = await clientPromise;
    const db = client.db("twitter");
    // Update the post
    const result = await db.collection("posts").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          content: body.content,
          imageUrl: body.imageUrl,
          authorName: body.authorName,
          authorAvatar: body.authorAvatar,
          updatedAt: new Date(),
        },
      }
    );
    // If no post was found
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }
    // Success response
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("PUT /api/posts/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}