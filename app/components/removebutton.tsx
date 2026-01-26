"use client";

import { RiDeleteBin6Line } from "react-icons/ri";
import { useRouter } from "next/navigation";

type RemoveButtonProps = {
  className?: string;
  onClick?: () => void;
  postId?: string;
};

export default function RemoveButton({
  className,
  onClick,
  postId,
}: RemoveButtonProps) {
  const router = useRouter();

  const handleClick = async () => {
    if (onClick) {
      onClick();
      return;
    }
    if (!postId) return;
    try {
      const response = await fetch(`/api/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        router.refresh();
      } else {
        console.error("Failed to delete post:", await response.text());
      }
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  return (
    <button type="button" className={className} onClick={handleClick}>
      <RiDeleteBin6Line size={24} className="text-white" />
    </button>
  );
}
