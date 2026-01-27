"use client";

import { useState, useEffect } from "react";

interface TweetProps {
  _id: string;
  content: string;
  imageUrl?: string;
  createdAt: Date | string;
  authorName: string;
  authorAvatar: string;
  likes?: number;
  isLiked?: boolean;
  reposts?: number;
  isReposted?: boolean;
  dateAdded?: string;
}

export default function Otherpost({
  _id,
  content,
  imageUrl,
  createdAt,
  authorName,
  authorAvatar,
  likes: initialLikes = 0,
  isLiked: initialIsLiked = false,
  reposts: initialReposts = 0,
  isReposted: initialIsReposted = false,
}: TweetProps) {
  const [likes, setLikes] = useState(initialLikes || 0);
  const [isLiked, setIsLiked] = useState(initialIsLiked || false);
  const [reposts, setReposts] = useState(initialReposts || 0);
  const [isReposted, setIsReposted] = useState(initialIsReposted || false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isReposting, setIsReposting] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    setLikes(initialLikes || 0);
    setIsLiked(initialIsLiked || false);
    setReposts(initialReposts || 0);
    setIsReposted(initialIsReposted || false);
  }, [initialLikes, initialIsLiked, initialReposts, initialIsReposted]);

  useEffect(() => {
    setFormattedDate(
      new Date(createdAt).toLocaleString("is-IS", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    );
  }, [createdAt]);

  const handleLike = async () => {
    if (isUpdating) return;

    const previousLikes = likes || 0;
    const previousIsLiked = isLiked;
    const newLikes = previousIsLiked ? previousLikes - 1 : previousLikes + 1;
    const newIsLiked = !previousIsLiked;

    setIsUpdating(true);
    setLikes(newLikes);
    setIsLiked(newIsLiked);

    try {
      const response = await fetch(`/api/posts/${_id}/like`, {
        method: "POST",
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        setLikes(previousLikes);
        setIsLiked(previousIsLiked);
        alert("Villa við að líka pósti: Óvænt svar frá netþjóni (ekki JSON)");
        return;
      }

      const result = await response.json();

      if (result.success) {
        if (typeof result.likes === "number" && result.likes >= 0) {
          setLikes(result.likes);
        }
        setIsLiked(result.isLiked);
      } else {
        setLikes(previousLikes);
        setIsLiked(previousIsLiked);
        alert("Villa við að líka pósti: " + (result.error || "Óþekkt villa"));
      }
    } catch (error: any) {
      console.error("Error liking post:", error);
      setLikes(previousLikes);
      setIsLiked(previousIsLiked);
      alert("Villa við að líka pósti: " + (error.message || "Óþekkt villa"));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRepost = async () => {
    if (isReposting) return;

    const previousReposts = reposts || 0;
    const previousIsReposted = isReposted;
    const newReposts = previousIsReposted
      ? previousReposts - 1
      : previousReposts + 1;
    const newIsReposted = !previousIsReposted;

    setIsReposting(true);
    setReposts(newReposts);
    setIsReposted(newIsReposted);

    try {
      const response = await fetch(`/api/posts/${_id}/repost`, {
        method: "POST",
      });

      const result = await response.json();

      if (result.success) {
        if (typeof result.reposts === "number" && result.reposts >= 0) {
          setReposts(result.reposts);
        }
        setIsReposted(result.isReposted);
      } else {
        setReposts(previousReposts);
        setIsReposted(previousIsReposted);
        alert("Villa við að endurtvíta: " + result.error);
      }
    } catch (error) {
      console.error("Error reposting:", error);
      setReposts(previousReposts);
      setIsReposted(previousIsReposted);
      alert("Villa við að endurtvíta");
    } finally {
      setIsReposting(false);
    }
  };

  const formatLikes = (count: number) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + "K";
    }
    return count.toString();
  };

  const formatReposts = (count: number) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + "K";
    }
    return count.toString();
  };

  return (
    <>
      <div className="w-full bg-black border border-[#2F3336] py-3 px-4 sm:px-6 md:px-8 lg:px-12 flex flex-col">
        <div className="flex flex-row gap-2">
          {/* Author */}
          <img
            src={authorAvatar || "/images/circle.png"}
            alt={authorName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="w-full">
            <div className="flex flex-row w-full justify-between items-center">
              <div className="flex flex-row gap-1">
                <p className="text-white font-semibold text-sm">{authorName}</p>
                <p className="text-[#8B99A6] text-sm">@{authorName}</p>
                {/* Timestamp */}
                <p className="text-[#8B99A6] text-[11px] flex items-center pl-2">
                  Posted on {formattedDate || "..."}
                </p>
              </div>
              {/* Removed Edit Icon for Otherpost */}
            </div>

            {/* Content */}
            <p className="text-white text-sm">{content}</p>
            {/* Image */}
            {imageUrl && imageUrl.trim() !== "" && (
              <img
                src={imageUrl}
                alt="Tweet image"
                className="rounded-2xl max-w-full mb-3"
              />
            )}
          </div>
        </div>

        {/* Reactions */}
        <div className="flex w-full justify-between pl-4 sm:pl-6 md:pl-8 lg:pl-12 pt-1.5">
          <div className="flex gap-1 items-center">
            <img
              src="/images/comment.svg"
              alt="comment"
              className="w-3.5 h-3.5"
            />
            <p className="text-[#8B99A6] text-[11px]">95</p>
          </div>
          <button
            onClick={handleRepost}
            disabled={isReposting}
            className="flex gap-1 items-center cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            <img
              src={
                isReposted
                  ? "/images/profile/ReTweetGreen.svg"
                  : "/images/repost.svg"
              }
              alt="repost"
              className="w-3.5 h-3.5"
            />
            <p
              className={`text-[11px] ${isReposted ? "text-[#00BA7C]" : "text-[#8B99A6]"}`}
            >
              {formatReposts(reposts)}
            </p>
          </button>
          <button
            onClick={handleLike}
            disabled={isUpdating}
            className={`flex gap-1 items-center cursor-pointer transition-opacity disabled:opacity-50 ${!isLiked ? "hover:opacity-80" : ""}`}
          >
            <div className="w-3.5 h-3.5 flex-shrink-0 flex items-center justify-center">
              <img
                src={
                  isLiked ? "/images/isliked.svg" : "/images/heart.svg"
                }
                alt="like"
                className="w-3.5 h-3.5 object-contain"
              />
            </div>
            <p
              className={`text-[11px] min-w-[1.5rem] text-left ${isLiked ? "text-[#C81566]" : "text-[#8B99A6]"}`}
            >
              {formatLikes(likes)}
            </p>
          </button>
        </div>
      </div>
    </>
  );
}
