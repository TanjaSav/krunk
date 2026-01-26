'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface ProfilePictureSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (picturePath: string) => void;
  currentPicture: string;
}

const PROFILE_PICTURES = [
  '/images/profile/circle.png',
  '/images/profile/shape2.png',
  '/images/profile/shape3.png',
  '/images/profile/shape4.png',
  '/images/profile/shape5.png',
];

export default function ProfilePictureSelector({ 
  isOpen, 
  onClose, 
  onSelect,
  currentPicture 
}: ProfilePictureSelectorProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [pictureOffsets, setPictureOffsets] = useState<{ x: number; y: number }[]>(
    Array.from({ length: PROFILE_PICTURES.length }, () => ({ x: 0, y: 0 }))
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
        setPictureOffsets(Array.from({ length: PROFILE_PICTURES.length }, () => ({ x: 0, y: 0 })));
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSelect = async (picturePath: string) => {
    if (picturePath === currentPicture) {
      onClose();
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch('/api/auth/update-profile-picture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profilePicture: picturePath }),
      });

      const result = await response.json();
      
      if (result.success) {
        onSelect(picturePath);
        onClose();
        window.location.reload();
      } else {
        alert('Villa við að uppfæra prófílmynd: ' + result.error);
      }
    } catch (error) {
      console.error('Error updating profile picture:', error);
      alert('Villa við að uppfæra prófílmynd');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePictureMouseMove = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    if (!isOpen || isUpdating) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = (e.clientX - centerX) * 0.2;
    const offsetY = (e.clientY - centerY) * 0.2;
    setPictureOffsets(prev => {
      const newOffsets = [...prev];
      newOffsets[index] = { x: offsetX, y: offsetY };
      return newOffsets;
    });
  };

  const handlePictureMouseLeave = (index: number) => {
    setPictureOffsets(prev => {
      const newOffsets = [...prev];
      newOffsets[index] = { x: 0, y: 0 };
      return newOffsets;
    });
  };

  const getOpenTransform = (index: number) => {
    const total = PROFILE_PICTURES.length;
    const angleStep = 30;
    const radius = 50;
    const startAngle = -((total - 1) * angleStep) / 2;
    const angle = startAngle + index * angleStep;
    const radian = (angle * Math.PI) / 180;
    const x = Math.sin(radian) * radius;
    const y = -Math.cos(radian) * radius;
    const rotation = angle;
    return `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={containerRef}
      className="absolute bottom-2 left-0 z-50"
    >
      <div className="relative w-[60px] h-[60px]">
        {PROFILE_PICTURES.map((picturePath, index) => {
          const transformStyle = isOpen
            ? `${getOpenTransform(index)} translate(${pictureOffsets[index].x}px, ${pictureOffsets[index].y}px)`
            : 'translate(0, 0)';

          return (
            <button
              key={index}
              onClick={() => handleSelect(picturePath)}
              onMouseMove={(e) => handlePictureMouseMove(e, index)}
              onMouseLeave={() => handlePictureMouseLeave(index)}
              disabled={isUpdating}
              className={`absolute top-0 left-0 w-[47px] h-[47px] rounded-full overflow-hidden border-2 transition-all duration-300 ease-in-out shrink-0 ${
                currentPicture === picturePath 
                  ? 'border-blue-500 scale-110 z-10' 
                  : 'border-transparent hover:border-gray-400 z-0'
              } ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-110'}`}
              style={{
                transform: transformStyle,
                transition: 'transform 0.3s ease-in-out',
              }}
            >
              <Image
                src={picturePath}
                alt={`Profile option ${index + 1}`}
                width={47}
                height={47}
                className="object-cover rounded-full"
                onError={(e) => {
                  e.currentTarget.src = '/images/circle.png';
                }}
              />
            </button>
          );
        })}
      </div>
      {isUpdating && (
        <p className="text-white text-sm text-center mt-2 absolute top-full left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          Uppfæri...
        </p>
      )}
    </div>
  );
}
