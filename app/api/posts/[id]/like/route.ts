import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log("--- LIKE ROUTE HIT ---"); // NEW LOG
  try {
    const username = await getSession();
    console.log("Current User:", username); // NEW LOG

    if (!username) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    // Extract ID from URL (similar to how PUT route does it)
    // URL format: http://localhost:3000/api/posts/{id}/like
    let id: string | undefined;
    try {
      // Try params first
      const resolvedParams = await params;
      if (resolvedParams?.id) {
        id = resolvedParams.id;
      }
    } catch (error) {
      // Params failed, will try URL extraction
    }

    // Fallback: extract from URL path
    if (!id) {
      try {
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/').filter(Boolean);
        // pathParts should be: ['api', 'posts', '{id}', 'like']
        const postsIndex = pathParts.indexOf('posts');
        if (postsIndex >= 0 && postsIndex + 1 < pathParts.length) {
          id = pathParts[postsIndex + 1];
        }
      } catch (error) {
        // URL parsing failed
      }
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const database = client.db('twitter');
    const posts = database.collection('posts');

    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid post ID' },
        { status: 400 }
      );
    }

    const post = await posts.findOne({ _id: objectId });
    if (!post) {
      console.log("Post not found for ID:", id); // NEW LOG
      return NextResponse.json(

        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    const likedBy = post.likedBy || [];
    const isLiked = likedBy.includes(username);

    console.log("Post Author:", post.authorName); // NEW LOG
    console.log("Is Liked (before toggle):", isLiked); // NEW LOG
    const currentLikes = typeof post.likes === 'number' ? post.likes : 0;

    let updateOperation: any;
    if (isLiked) {
      updateOperation = {
        $inc: { likes: -1 },
        $pull: { likedBy: username }
      };
    } else {
      updateOperation = {
        $addToSet: { likedBy: username }
      };
      
      if (typeof post.likes !== 'number') {
        updateOperation.$set = { likes: 1 };
      } else {
        updateOperation.$inc = { likes: 1 };
      }
    }

    const updatedPost = await posts.findOneAndUpdate(
      { _id: objectId },
      updateOperation,
      { returnDocument: 'after' }
    );

    if (!isLiked && post.authorName !== username) {
        console.log("Creating notification for:", post.authorName, "from:", username);
        const notifications = database.collection("notifications");
        await notifications.insertOne({
          recipient: post.authorName, 
            sender: username,
            type: "like",
            postId: id,
            isRead: false,
            createdAt: new Date()
        });
        console.log("Notification created successfully");
      } else {
        console.log("Skipping notification. isLiked:", isLiked, "author:", post.authorName, "user:", username);
      }

    let finalLikes: number;
    if (updatedPost && updatedPost.value && typeof updatedPost.value.likes === 'number') {
      finalLikes = updatedPost.value.likes;
    } else {
      finalLikes = isLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1;
    }

    return NextResponse.json({
      success: true,
      likes: finalLikes,
      isLiked: !isLiked
    });
  } catch (error: any) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to toggle like' },
      { status: 500 }
    );
  }
}
