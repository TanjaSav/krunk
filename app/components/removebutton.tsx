"use client";

import { RiDeleteBin6Line } from "react-icons/ri";

type RemoveButtonProps = {
  className?: string;
  postId?: string;
};

export default function RemoveButton({
  className,
  onClick,
  postId,
}: RemoveButtonProps) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        fetch(`/api/${postId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
      }}
    >
      <RiDeleteBin6Line size={24} className=" text-white" />
    </button>
  );
}
