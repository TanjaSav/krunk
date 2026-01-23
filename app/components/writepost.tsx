"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

function WritePost() {
  const [postContent, setPostContent] = useState("");
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Get current user from session
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setUsername(data.username);
        }
        // Don't redirect here - page level handles authentication
      })
      .catch(err => {
        console.error('Error fetching user:', err);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostContent(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username) {
      // If username is not loaded yet, wait a bit or show message
      alert('Vinsamlegast bíddu á meðan við staðfestum innskráningu');
      return;
    }
    
    const formData = {
      content: postContent,
      imageUrl: '', 
      authorName: username,
      authorAvatar: "/images/circle.png",
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
        router.refresh(); // ← Refresh page data
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit');
    }
  };

  return (
    <div className="flex flex-col w-full border-[#313F4C] border px-4 py-5 font-normal">
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
          Post
        </button>
        </div>
      </div>
    </div>
  );
}

export default WritePost;