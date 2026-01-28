"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Mobilenav from "../components/mobilenav";

interface Notification {
  _id: string;
  sender: string;
  type: string;
  postId: string;
  createdAt: string;
  read: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch("/api/notifications");
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        }
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white px-4 py-26">
      <Mobilenav />

      <div className="flex justify-between items-center mb-6 border-b border-[#727272] pb-4">
        <Link href="/" className="text-white text-[16px] flex items-center gap-2 hover:text-[#727272]">
            <Image src="/images/BackArrow.svg" alt="Til baka" width={8} height={16} className="hover:opacity-50" />
          <span>Til baka</span>
        </Link>
        <div className="flex gap-2">
            <Image src="/images/notifications.svg" alt="Tilkynningar" width={24} height={24} />
            <h1 className="text-[16px]">Tilkynningar</h1>
        </div>
      </div>

      <div className="flex flex-col gap-0">
        {loading ? (
          <p className="text-center text-gray-500 mt-10">Hleður...</p>
        ) : notifications.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">Engar nýjar tilkynningar</p>
        ) : (
          
          notifications.map((notif) => (
            <div 
              key={notif._id} 
              className="flex items-center gap-4 py-4 border-b border-[#727272] hover:bg-gray-900 transition-colors"
            >
              
              <div className="w-10 h-10 rounded-full shrink-0"></div>
              
              <div className="flex flex-col">
                <p className="text-sm">
                  <span className="font-bold">{notif.sender}</span>
                  <span className="text-gray-300"> 
                    {notif.type === 'like' ? ' liked your Krunk' : ' interacted with you'}
                  </span>
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}