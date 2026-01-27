import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { getSession, getUserByUsername } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    // 1. Check authentication
    const username = await getSession();
    if (!username) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in." },
        { status: 401 },
      );
    }

    // 2. Parse and validate request body
    const body = await request.json();

    // Sanitize and validate content
    const sanitizedContent = body.content?.trim() || "";
    
    if (!sanitizedContent || sanitizedContent.length === 0) {
      return NextResponse.json(
        { success: false, error: "Post content is required and cannot be empty" },
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

    // 3. Get user information
    const user = await getUserByUsername(username);
    const userProfilePicture = user?.profilePicture || "/images/circle.png";

    // 4. Create post with sanitized data
    const client = await clientPromise;
    const database = client.db("twitter");
    const collection = database.collection("posts");
    
    const result = await collection.insertOne({
      content: sanitizedContent,
      imageUrl: sanitizedImageUrl,
      authorName: username,
      authorAvatar: userProfilePicture,
      likes: 0,
      likedBy: [],
      reposts: 0,
      repostedBy: [],
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      id: result.insertedId,
    });
  } catch (error: any) {
    console.error("POST /api/submit error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create post",
      },
      { status: 500 },
    );
  }
}
