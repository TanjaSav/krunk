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

function WritePost({
  postId,
  initialContent = "",
  initialImageUrl = "",
  initialAuthorName = "óli",
  initialAuthorAvatar = "/images/avatar.png",
  onFinish,
}: WritePostProps) {
  const [postContent, setPostContent] = useState("");
  const [username, setUsername] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] =
    useState<string>("/images/circle.png");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setUsername(data.username);
          setProfilePicture(data.profilePicture || "/images/circle.png");
        }
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
      });
  }, []);

  useEffect(() => {
    if (postId && initialContent) {
      setPostContent(initialContent);
    }
  }, [postId, initialContent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostContent(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username) {
      alert("Vinsamlegast bíddu á meðan við staðfestum innskráningu");
      return;
    }

    const formData = {
      content: postContent,
      imageUrl: "", // TODO: add image upload
      authorName: username,
      authorAvatar: profilePicture,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const method = postId ? "PUT" : "POST";
    const url = postId ? `/api/posts/${postId}` : "/api/submit";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (data.success) {
        setPostContent("");
        router.refresh();
        if (onFinish) onFinish();
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to submit");
    }
  };

  return (
    <div className="flex flex-col w-full border-[#313F4C] border px-4 py-5 mt-22 md:m-0 font-normal">
      <div className="flex flex-col">
        <input
          type="text"
          placeholder="Hvað er að gerast?"
          className="pt-4 pb-8 bg-transparent text-white border-none outline-none focus:outline-none focus:ring-0"
          value={postContent}
          onChange={handleChange}
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
    </div>
  );
}

export default WritePost;
