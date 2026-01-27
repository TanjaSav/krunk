import { NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";
import { getSession } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // 1. Check authentication
    const username = await getSession();
    if (!username) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // 2. Get and validate ID
    const { id } = await params;
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid post ID" },
        { status: 400 }
      );
    }

    // 3. Connect to database
    const client = await clientPromise;
    const database = client.db("twitter");
    const collection = database.collection("posts");

    // 4. Fetch post to check existence and ownership
    const post = await collection.findOne({ _id: new ObjectId(id) });
    
    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    // 5. Check authorization - user must own the post
    if (post.authorName !== username) {
      return NextResponse.json(
        { success: false, error: "Forbidden. You can only delete your own posts." },
        { status: 403 }
      );
    }

    // 6. Perform deletion
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    
    // 7. Verify deletion succeeded
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Failed to delete post" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete post" },
      { status: 500 }
    );
  }
}
