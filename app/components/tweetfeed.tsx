"use client";
import { useState } from "react";
import Yourpost from './yourpost';
import Otherpost from './otherpost';
import WritePost from './writepost';

interface TweetFeedProps {
  tweets: any[];
  username: string;
}

export default function TweetFeed({ tweets, username }: TweetFeedProps) {
  const [editingPost, setEditingPost] = useState<any | null>(null);

  const startEditing = (post: any) => {
    const cleanPost = {
      ...post,
      _id: post._id?.toString(),
      createdAt: post.createdAt?.toString(),
      updatedAt: post.updatedAt?.toString(),
    };
    setEditingPost(cleanPost);
  };

  const stopEditing = () => {
    setEditingPost(null);
  };

  return (
    <div>
      {/* Show WritePost for creating new posts */}
      {!editingPost && <WritePost onFinish={() => {}} />}
      
      {/* Show WritePost for editing */}
      {editingPost && (
        <WritePost
          initialContent={editingPost.content}
          initialImageUrl={editingPost.imageUrl}
          postId={editingPost._id}
          onFinish={stopEditing}
        />
      )}

      {/* Show tweets */}
      {tweets.map((tweet: any) =>
        tweet.authorName === username ? (
          <Yourpost
            key={tweet._id.toString()}
            postId={tweet._id.toString()}
            _id={tweet._id.toString()}
            content={tweet.content}
            imageUrl={tweet.imageUrl}
            createdAt={tweet.createdAt}
            authorName={tweet.authorName}
            authorAvatar={tweet.authorAvatar}
            onEdit={() => startEditing(tweet)}
            likes={tweet.likes}
            isLiked={tweet.isLiked}
            reposts={tweet.reposts}
            isReposted={tweet.isReposted}
          />
        ) : (
          <Otherpost
            key={tweet._id.toString()}
            _id={tweet._id.toString()}
            content={tweet.content}
            imageUrl={tweet.imageUrl}
            createdAt={tweet.createdAt}
            authorName={tweet.authorName}
            authorAvatar={tweet.authorAvatar}
            likes={tweet.likes}
            isLiked={tweet.isLiked}
            reposts={tweet.reposts}
            isReposted={tweet.isReposted}
          />
        ),
      )}
    </div>
  );
}
