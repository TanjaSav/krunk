import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

//PUT METHOD TO UPDATE A POST BY ID
export async function PUT(request: Request) {
  try {
    // 1. Check authentication
    const username = await getSession();
    if (!username) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // 2. Extract and validate post ID
    const id = request.url.split("/").pop();
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing post ID" },
        { status: 400 }
      );
    }

    // 3. Parse and validate request body
    const body = await request.json();
    
    // Sanitize content - trim whitespace
    const sanitizedContent = body.content?.trim() || "";
    
    if (!sanitizedContent || sanitizedContent.length === 0) {
      return NextResponse.json(
        { success: false, error: "Post content cannot be empty" },
        { status: 400 }
      );
    }

    // Validate content length (prevent extremely long posts)
    if (sanitizedContent.length > 10000) {
      return NextResponse.json(
        { success: false, error: "Post content is too long (max 10000 characters)" },
        { status: 400 }
      );
    }

    // Sanitize imageUrl if provided
    const sanitizedImageUrl = body.imageUrl?.trim() || "";

    // 4. Connect to database
    const client = await clientPromise;
    const db = client.db("twitter");
    
    // 5. Fetch post to check existence and ownership
    const post = await db.collection("posts").findOne({ _id: new ObjectId(id) });
    
    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    // 6. Check authorization - user must own the post
    if (post.authorName !== username) {
      return NextResponse.json(
        { success: false, error: "Forbidden. You can only edit your own posts." },
        { status: 403 }
      );
    }

    // 7. Update the post with sanitized data
    const result = await db.collection("posts").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          content: sanitizedContent,
          imageUrl: sanitizedImageUrl || post.imageUrl,
          updatedAt: new Date(),
        },
      }
    );

    // 8. Verify update succeeded
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
