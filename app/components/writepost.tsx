"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface WritePostProps {
  postId?: string;
  initialContent?: string;
  initialImageUrl?: string;
  initialAuthorName?: string;
  initialAuthorAvatar?: string;
  onFinish?: () => void;
}

// Renders the post input form for creating or editing
export default function WritePost({
  postId,
  initialContent = "",
  initialImageUrl = "",
  initialAuthorName = "óli",
  initialAuthorAvatar = "/images/avatar.png",
  onFinish,
}: WritePostProps) {
  const [postContent, setPostContent] = useState(initialContent);
  const router = useRouter();

  // Update input when editing a different post
  useEffect(() => {
    setPostContent(initialContent);
  }, [initialContent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      content: postContent,
      imageUrl: initialImageUrl,
      authorName: initialAuthorName,
      authorAvatar: initialAuthorAvatar,
      updatedAt: new Date(),
    };

    const method = postId ? "PUT" : "POST";
    const url = postId ? `/api/posts/${postId}` : "/api/submit";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setPostContent("");
        onFinish?.();
        router.refresh();
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      alert("Failed to submit");
    }
  };

  return (
    <div className="border-[#313F4C] border px-12 py-5 m-4 font-normal w-2/3">
      <input
        type="text"
        placeholder="Hvað er að gerast?"
        className="w-full pt-4 pb-8 bg-transparent text-white border-none outline-none focus:outline-none focus:ring-0"
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
      />
      <div className="border-t border-[#313F4C] pt-4 flex justify-between items-center">
        <Image
          src="/images/addimageicon.svg"
          alt="Add image"
          width={24}
          height={24}
        />
        <button
          className={
            postContent
              ? "border-blue-600 border-2 px-4 py-2 bg-blue-600 rounded-3xl text-white"
              : "border-blue-400 text-white border-2 bg-blue-400 px-4 py-2 rounded-3xl"
          }
          type="button"
          onClick={handleSubmit}
          disabled={!postContent}
        >
          {postId ? "Save" : "Post"}
        </button>
      </div>
    </div>
  );
}