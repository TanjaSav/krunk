import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const username = await getSession();
    if (!username) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const { postId } = await params;
    if (!postId) {
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
      objectId = new ObjectId(postId);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid post ID' },
        { status: 400 }
      );
    }

    const post = await posts.findOne({ _id: objectId });
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    const repostedBy = post.repostedBy || [];
    const currentReposts = typeof post.reposts === 'number' ? post.reposts : 0;
    const isReposted = repostedBy.includes(username);

    let updateOperation: any;
    if (isReposted) {
      updateOperation = {
        $inc: { reposts: -1 },
        $pull: { repostedBy: username }
      };
    } else {
      updateOperation = {
        $addToSet: { repostedBy: username }
      };
      
      if (typeof post.reposts !== 'number') {
        updateOperation.$set = { reposts: 1 };
      } else {
        updateOperation.$inc = { reposts: 1 };
      }
    }

    const updatedPost = await posts.findOneAndUpdate(
      { _id: objectId },
      updateOperation,
      { returnDocument: 'after' }
    );

    let finalReposts: number;
    if (updatedPost && typeof updatedPost.value?.reposts === 'number') {
      finalReposts = updatedPost.value.reposts;
    } else {
      finalReposts = isReposted ? Math.max(0, currentReposts - 1) : currentReposts + 1;
    }

    return NextResponse.json({
      success: true,
      reposts: finalReposts,
      isReposted: !isReposted
    });
  } catch (error: any) {
    console.error('Error toggling repost:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to toggle repost' },
      { status: 500 }
    );
  }
}
