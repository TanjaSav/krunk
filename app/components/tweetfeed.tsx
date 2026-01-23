"use client";

import { useState } from "react";
import Yourpost from "./yourpost";
import WritePost from "./writepost";

interface TweetFeedProps {
  tweets: any[];
}

// Renders the post editor and list of posts
export default function TweetFeed({ tweets }: TweetFeedProps) {
  const [editingPost, setEditingPost] = useState<any | null>(null);

  // Called when user clicks edit icon
  const startEditing = (post: any) => {
    const cleanPost = {
      ...post,
      _id: post._id?.toString(),
      createdAt: post.createdAt?.toString(),
      updatedAt: post.updatedAt?.toString(),
    };
    setEditingPost(cleanPost);
  };

  // Called after saving or cancelling edit
  const stopEditing = () => {
    setEditingPost(null);
  };

  return (
    <div className="flex flex-col space-y-4 relative">
      <WritePost
        postId={editingPost?._id || null}
        initialContent={editingPost?.content || ""}
        initialImageUrl={editingPost?.imageUrl || ""}
        initialAuthorName={editingPost?.authorName || ""}
        initialAuthorAvatar={editingPost?.authorAvatar || ""}
        onFinish={stopEditing}
      />

      {tweets.map((tweet) => (
        <Yourpost
          key={tweet._id.toString()}
          postId={tweet._id.toString()}
          content={tweet.content}
          imageUrl={tweet.imageUrl}
          createdAt={tweet.createdAt}
          authorName={tweet.authorName}
          authorAvatar={tweet.authorAvatar}
          onEdit={() => startEditing(tweet)}
        />
      ))}
    </div>
  );
}