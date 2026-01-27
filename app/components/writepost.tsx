"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";

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
  const[imageUrl, setImageUrl] = useState(initialImageUrl);
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
//Sending data to database
    const formData = {
      content: postContent,//CONTENT
      imageUrl: imageUrl, //IMAGE URL 
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
        setImageUrl("");
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
          
             {/* Image preview */}
        {imageUrl && imageUrl.trim() !== "" && (
          <div className="relative mb-4">
            <img
              src={imageUrl}
              alt="Preview"
              className="rounded-2xl max-w-full"
            />
            {/* Remove buttons */}
            <button
              type="button"
              onClick={() => setImageUrl("")}
              className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-2 hover:bg-black/90"
            >
              ✕
            </button>
          </div>
        )}
 
          {/* Widget Cloudinary Upload */}
              {!imageUrl && (
      <CldUploadWidget
        uploadPreset="twitter_posts"
        onSuccess={(result: any) => {
          setImageUrl(result.info.secure_url);
        }}
      >
        {({ open }) => (
          <button type="button" onClick={() => open()}>
            <Image
              src="/images/addimageicon.svg"
              alt="Add image"
              width={24}
              height={24}
              className="cursor-pointer"
            />
          </button>
        )}
      </CldUploadWidget>
    )}
   <div className="pt-4 flex justify-between items-center">

          <button
            className={
              postContent
                ? "border-[#0D99FF] border-2 px-4 py-2 bg-[#0D99FF] rounded-3xl text-white hover:bg-[#0B87E0] hover:border-[#0B87E0] transition"
                : "border-[#5BADE4] text-white border-2 bg-[#5BADE4] px-4 py-2 rounded-3xl"
            }
            type="button"
            onClick={handleSubmit}
            disabled={!postContent && !imageUrl}
          >
            {postId ? "Save" : "Post"}

          </button>
        </div>
      </div>
    </div>
    </div>
  );
}

export default WritePost;
