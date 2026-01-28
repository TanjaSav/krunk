"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import ProfilePictureSelector from "./profilepictureselector";

export default function Mobilenav() {
  const [username, setUsername] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] =
    useState<string>("/images/circle.png");
  const [showSelector, setShowSelector] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

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
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 w-full h-22 bg-black border-b border-[#727272] flex justify-between items-center px-6 md:hidden z-30">
        <Image
          src="/images/logo.svg"
          alt="Logo"
          width={47}
          height={50}
          className="object-contain"
        />
        <Image
          src="/images/krunk-letter.svg"
          alt="Logo"
          width={80}
          height={80}
          className="object-contain"
        />
      </header>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 w-full h-22 bg-black border-t border-[#727272] flex items-center justify-evenly px-4 md:hidden z-30">
        {/* Avatar */}
        <div className="relative flex-1 flex justify-center">
          <button
            onClick={() => setShowSelector(!showSelector)}
            className="cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center"
          >
            <Image
              src={profilePicture}
              alt="Profile Picture"
              width={42}
              height={42}
              className="rounded-full object-cover aspect-square"
              priority
              loading="eager"
              onError={(e) => {
                e.currentTarget.src = "/images/circle.png";
              }}
            />
          </button>

          <ProfilePictureSelector
            isOpen={showSelector}
            onClose={() => setShowSelector(false)}
            onSelect={(picturePath) => setProfilePicture(picturePath)}
            currentPicture={profilePicture}
          />
        </div>

        {/* Home */}
        <div className="flex-1 flex justify-center">
          <Link
            href="/"
            className="flex items-center justify-center p-2 hover:opacity-80 transition-opacity"
          >
            <Image src="/images/home.svg" alt="Heim" width={24} height={24} />
          </Link>
        </div>

        {/* Notifications */}
        <div className="flex-1 flex justify-center">
          <Link
            href="/notifications"
            className="flex items-center justify-center p-2 hover:opacity-80 transition-opacity"
          >
            <Image
              src={
                pathname === "/notifications"
                  ? "/images/NotiActive.svg"
                  : "/images/notifications.svg"
              }
              alt="Tilkynningar"
              width={24}
              height={24}
            />
          </Link>
        </div>

        {/* Logout */}
        <div className="flex-1 flex justify-center">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center p-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <Image
              src="/images/logout.svg"
              alt="Skrá út"
              width={24}
              height={24}
            />
          </button>
        </div>
      </footer>
    </>
  );
}
