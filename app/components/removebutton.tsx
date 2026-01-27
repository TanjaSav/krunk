"use client";

import { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

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
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
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
    } finally {
      setShowConfirm(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => {
          if (onClick) {
            onClick();
          } else {
            setShowConfirm(true);
          }
        }}
      >
        <RiDeleteBin6Line size={16} className="text-gray-300" />
      </button>

        {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <>
            <motion.div
              className="fixed inset-0 z-40  bg-white/5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

           {/* Confirmation Dialog */}
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-black text-white rounded-xl px-5 py-6 w-[90%] max-w-sm border border-[#2f3336] shadow-xl">
                <p className="text-[15px] leading-snug mb-5 font-normal">
                  <span className="font-semibold block mb-2">Delete post?</span>
                  This can't be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from search results.
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="px-4 py-2 rounded-full text-sm bg-black text-white border border-[#6f7172] hover:bg-[#1a1a1a] transition-colors" 
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 text-white bg-[#f4212e] rounded-full text-sm hover:bg-[#e02424] transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}