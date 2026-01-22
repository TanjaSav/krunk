"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

function WritePost() {
  const [postContent, setPostContent] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostContent(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = {
      content: postContent,
      imageUrl: '', // Add image upload later
      authorName: "óli",
      authorAvatar: "/images/avatar.jpg",
      createdAt: new Date(),
    };
//TRY BLOCK- IN CASE OF ERRORS
   try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        setPostContent(''); // ← Clear input
        router.refresh(); // ← Refresh page data without full reload!
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit');
    }
  };

  return (
    <div className="border-[#313F4C] border px-12 py-5 m-4 font-normal w-2/3">
      <input
        type="text"
        placeholder="Hvað er að gerast?"
        className="w-full pt-4 pb-8 bg-transparent text-white border-none outline-none focus:outline-none focus:ring-0"
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
          Post
        </button>
      </div>
    </div>
  );
}

export default WritePost;