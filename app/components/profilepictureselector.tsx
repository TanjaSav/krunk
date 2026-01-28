"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ProfilePictureSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (picturePath: string) => void;
  currentPicture: string;
}

const PROFILE_PICTURES = [
  "/images/profile/circle.png",
  "/images/profile/shape2.png",
  "/images/profile/shape3.png",
  "/images/profile/shape4.png",
  "/images/profile/shape5.png",
  "/images/profile/shape6.png",
  "/images/profile/0491fc12a230f0013e3e563be70ac725.jpg",
  "/images/profile/0678157cec1918714a2abedc7b610005.jpg",
  "/images/profile/11dc16c85e9d861e4b30fc00bfa8f2b6.jpg",
  "/images/profile/2246b122d172268054ba0280b61ffeed.jpg",
  "/images/profile/2c720724fac4fb184d5dc7934e8c5aa5.gif",
  "/images/profile/33195b9b07214ec48590580a812e6cf1.gif",
  "/images/profile/3f15e210702182d1888f7e366420f574.gif",
  "/images/profile/4fa33daf50ad3804c0babe745bea3917.gif",
  "/images/profile/56515cb8148188c6dd8d0d4bafcb626d.jpg",
  "/images/profile/88c3a8b0ad2e497a87ed8de5ab932f57.gif",
  "/images/profile/cd7a01d0226869293129d9d7f787212e.gif",
  "/images/profile/d03d69dbafb4dc8d13d082b327c2bcd5.gif",
  "/images/profile/e270e352730da06ddfaed7c30aec0d47.gif",
  "/images/profile/e73a4a2483d3da8b134e4d2399bf7751.gif",
  "/images/profile/fb4b0535972b69dddaddfa18576aacd9.jpg",
];

export default function ProfilePictureSelector({
  isOpen,
  onClose,
  onSelect,
  currentPicture,
}: ProfilePictureSelectorProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [virtualIndex, setVirtualIndex] = useState(0); // Can go infinitely in either direction
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLUListElement>(null);
  const dragStartXRef = useRef(0);
  const isTransitioningRef = useRef(false);
  const router = useRouter();

  // Map virtual index to actual picture index
  const getActualIndex = (virtual: number) => {
    return (
      ((virtual % PROFILE_PICTURES.length) + PROFILE_PICTURES.length) %
      PROFILE_PICTURES.length
    );
  };

  // Preload images when selector opens for faster loading
  useEffect(() => {
    if (isOpen) {
      // Preload all profile pictures
      const preloadPromises = PROFILE_PICTURES.map((picturePath) => {
        return new Promise((resolve, reject) => {
          const img = new window.Image();
          img.onload = resolve;
          img.onerror = resolve; // Resolve even on error to not block
          img.src = picturePath;
        });
      });

      // Don't await, just start loading in background
      Promise.all(preloadPromises).catch(() => {
        // Silently handle any errors
      });
    }
  }, [isOpen]);

  // Initialize virtual index based on current picture
  useEffect(() => {
    if (isOpen) {
      const index = PROFILE_PICTURES.findIndex((pic) => pic === currentPicture);
      const initialIndex = index >= 0 ? index : 0;
      // Start at a middle point to allow scrolling in both directions
      setVirtualIndex(initialIndex + PROFILE_PICTURES.length * 10);
      setOffsetX(0);
    }
  }, [isOpen, currentPicture]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const handleSelect = async (picturePath: string) => {
    if (picturePath === currentPicture) {
      onClose();
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch("/api/auth/update-profile-picture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profilePicture: picturePath }),
      });

      const result = await response.json();

      if (result.success) {
        onSelect(picturePath);
        onClose();
        // Use router.refresh() instead of window.location.reload() for faster updates
        router.refresh();
      } else {
        alert("Villa við að uppfæra prófílmynd: " + result.error);
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
      alert("Villa við að uppfæra prófílmynd");
    } finally {
      setIsUpdating(false);
    }
  };

  const goToNext = () => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setVirtualIndex((prev) => prev + 1);
    setOffsetX(0);
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 500);
  };

  const goToPrev = () => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setVirtualIndex((prev) => prev - 1);
    setOffsetX(0);
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 500);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - dragStartXRef.current;
    setOffsetX(diff * 0.02);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 30;
    if (Math.abs(offsetX) > threshold) {
      if (offsetX > 0) {
        goToPrev();
      } else {
        goToNext();
      }
    } else {
      setOffsetX(0);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    dragStartXRef.current = e.touches[0].clientX;
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientX - dragStartXRef.current;
    setOffsetX(diff * 0.02);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 30;
    if (Math.abs(offsetX) > threshold) {
      if (offsetX > 0) {
        goToPrev();
      } else {
        goToNext();
      }
    } else {
      setOffsetX(0);
    }
  };

  // Calculate transform for each card
  const getCardTransform = (virtualIdx: number) => {
    const spacing = 100; // spacing between cards in pixels
    const baseOffset = (virtualIdx - virtualIndex) * spacing;
    const dragOffset = virtualIdx === virtualIndex ? offsetX * 10 : 0;
    const xPercent = baseOffset + dragOffset;

    // Scale and opacity based on distance from center
    const distance = Math.abs(virtualIdx - virtualIndex);
    const scale = distance === 0 ? 1 : Math.max(0.4, 1 - distance * 0.25);
    const opacity = distance === 0 ? 1 : Math.max(0.4, 1 - distance * 0.3);

    return {
      transform: `translateX(${xPercent}px) scale(${scale})`,
      opacity,
      zIndex: 100 - distance,
    };
  };

  // Generate visible cards around current position (infinite scroll)
  const getVisibleCards = () => {
    const visibleRange = 5; // Show 5 cards on each side
    const cards: Array<{
      virtualIndex: number;
      actualIndex: number;
      picturePath: string;
    }> = [];

    for (let i = -visibleRange; i <= visibleRange; i++) {
      const vIdx = virtualIndex + i;
      const actualIdx = getActualIndex(vIdx);
      cards.push({
        virtualIndex: vIdx,
        actualIndex: actualIdx,
        picturePath: PROFILE_PICTURES[actualIdx],
      });
    }

    return cards;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Selector Modal */}
      <div
        ref={containerRef}
        className="fixed md:absolute bottom-20 md:bottom-16 left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 z-50 bg-[#16181C] rounded-2xl p-4 shadow-2xl border border-[#2F3336] w-[calc(100%-2rem)] md:min-w-[280px] max-w-sm md:max-w-none"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-base font-semibold">
            Veldu prófílmynd
          </h3>
          <button
            onClick={onClose}
            className="text-[#8B99A6] hover:text-white transition-colors text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Carousel Gallery */}
        <div className="relative w-full h-28 mb-4 overflow-hidden">
          <ul
            ref={cardsRef}
            className="relative w-16 h-16"
            style={{
              transform: "translate(-50%, -50%)",
              top: "50%",
              left: "50%",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {getVisibleCards().map((card) => {
              const isSelected = currentPicture === card.picturePath;
              const isCurrent = card.virtualIndex === virtualIndex;
              const cardStyle = getCardTransform(card.virtualIndex);

              return (
                <li
                  key={card.virtualIndex}
                  className="absolute top-0 left-0 w-16 h-16 rounded-full overflow-hidden cursor-pointer list-none transition-all duration-500 ease-out"
                  style={cardStyle}
                  onClick={() => {
                    if (!isDragging && Math.abs(offsetX) < 10) {
                      handleSelect(card.picturePath);
                    }
                  }}
                >
                  <Image
                    src={card.picturePath}
                    alt={`Profile option ${card.actualIndex + 1}`}
                    width={64}
                    height={64}
                    className="object-cover rounded-full w-full h-full aspect-square"
                    priority={isCurrent}
                    loading={isCurrent ? "eager" : "lazy"}
                    onError={(e) => {
                      e.currentTarget.src = "/images/circle.png";
                    }}
                  />
                  {isSelected && isCurrent && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                      <svg
                        className="w-4 h-4 text-blue-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <button
            onClick={goToPrev}
            disabled={isUpdating}
            className="px-4 py-2 bg-[#2F3336] text-white rounded-lg hover:bg-[#3F4348] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Prev
          </button>
          <button
            onClick={goToNext}
            disabled={isUpdating}
            className="px-4 py-2 bg-[#2F3336] text-white rounded-lg hover:bg-[#3F4348] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Next
          </button>
        </div>

        {/* Loading State */}
        {isUpdating && (
          <div className="flex items-center justify-center gap-2 text-[#8B99A6] text-sm py-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Uppfæri...</span>
          </div>
        )}
      </div>
    </>
  );
}
