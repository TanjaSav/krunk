import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

<<<<<<< HEAD
// Handles PUT request to update an existing post
=======
//PUT METHOD TO UPDATE A POST BY ID
>>>>>>> b032c3b159ca6e7f1d93c0fe23bffb8f6200b9a7
export async function PUT(request: Request) {
  try {
    // Extract post ID from the URL
    const id = request.url.split("/").pop();
<<<<<<< HEAD

=======
>>>>>>> b032c3b159ca6e7f1d93c0fe23bffb8f6200b9a7
    // Validate ID format
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing post ID" },
        { status: 400 }
      );
    }
<<<<<<< HEAD

    // Parse request body
    const body = await request.json();

=======
    // Parse request body
    const body = await request.json();
>>>>>>> b032c3b159ca6e7f1d93c0fe23bffb8f6200b9a7
    // Validate content (prevent empty updates)
    if (!body.content || body.content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Post content cannot be empty" },
        { status: 400 }
      );
    }
<<<<<<< HEAD

    // Connect to database
    const client = await clientPromise;
    const db = client.db("twitter");

=======
    // Connect to database
    const client = await clientPromise;
    const db = client.db("twitter");
>>>>>>> b032c3b159ca6e7f1d93c0fe23bffb8f6200b9a7
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
<<<<<<< HEAD

=======
>>>>>>> b032c3b159ca6e7f1d93c0fe23bffb8f6200b9a7
    // If no post was found
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }
<<<<<<< HEAD

    // Success response
    return NextResponse.json({ success: true });

=======
    // Success response
    return NextResponse.json({ success: true });
>>>>>>> b032c3b159ca6e7f1d93c0fe23bffb8f6200b9a7
  } catch (error: any) {
    console.error("PUT /api/posts/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}