"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfilePictureSelector from "./profilepictureselector";

export default function Navbar() {
  const [username, setUsername] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] =
    useState<string>("/images/circle.png");
  const [showSelector, setShowSelector] = useState(false);
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

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      const result = await response.json();
      if (result.success) {
        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return (
    <nav className="bg-black text-white w-95 h-screen pt-7 pl-18 pr-6 pb-8 hidden md:flex flex-col justify-between border-r border-[#2F3336]">
      <div>
        <div className="flex items-end gap-4 h-6.25 mt-7 mb-18">
          {/* Logo */}
          <Image
            src="/images/logo.svg"
            alt="Logo"
            width={47}
            height={50}
            className="object-contain"
          />

          {/* Search input */}
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Leita"
              className="text-[#8B99A6] placeholder-[#8B99A6] w-50 h-6.25 pl-8 pr-3 rounded-[99px] bg-black border border-[#8B99A6] font-regular text-[16px] focus:outline-none"
            />
            <Image
              src="/images/search.svg"
              alt="Search icon"
              width={15}
              height={15}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 color-[#8B99A6]"
            />
          </div>
        </div>

        {/*  Navigation links */}
        <ul className="space-y-6">
          <li className="flex items-center gap-4">
            <Image src="/images/home.svg" alt="Heim" width={20} height={20} />
            <span className="text-poppins text-[16] font-regular">Heim</span>
          </li>

          {/* Notifications */}
          <li className="flex items-center gap-4">
            <Image
              src="/images/notifications.svg"
              alt="Tilkynningar"
              width={20}
              height={20}
            />
            <span className="text-poppins text-[16] font-regular">
              Tilkynningar
            </span>
          </li>

          <li
            className="flex items-center gap-4 cursor-pointer hover:opacity-80"
            onClick={handleLogout}
          >
            <Image
              src="/images/logout.svg"
              alt="Skrá út"
              width={20}
              height={20}
            />
            <span className="text-poppins text-[16] font-regular">Skrá út</span>
          </li>
        </ul>
      </div>

      {/* Bottom part */}
      <div className="flex items-center gap-4 relative">
        <button
          onClick={() => setShowSelector(!showSelector)}
          className="cursor-pointer hover:opacity-80 transition-opacity"
        >
          <Image
            src={profilePicture}
            alt="Profile Picture"
            width={42}
            height={42}
            className="rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/images/circle.png";
            }}
          />
        </button>
        <div>
          <div className="text-poppins text-sm font-regular">
            {username || "Notandi"}
          </div>
          <div className="text-poppins text-sm text-[#8B99A6] font-regular ">
            @{username || "username"}
          </div>
        </div>

        <ProfilePictureSelector
          isOpen={showSelector}
          onClose={() => setShowSelector(false)}
          onSelect={(picturePath) => setProfilePicture(picturePath)}
          currentPicture={profilePicture}
        />
      </div>
    </nav>
  );
}
