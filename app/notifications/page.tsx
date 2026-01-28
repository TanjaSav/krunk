"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Mobilenav from "../components/mobilenav";
import Navbar from "../components/navbar";

interface Notification {
  _id: string;
  sender: string;
  type: string;
  postId: string;
  createdAt: string;
  read: boolean;
  authorAvatar?: string;

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
    <div className="h-screen overflow-hidden relative bg-black text-white">
      <main className="absolute left-1/2 top-0 -translate-x-1/2 flex flex-col w-full sm:max-w-sm md:max-w-md h-screen overflow-hidden">
        
        <Mobilenav />

        <div className="flex-1 overflow-y-auto min-h-0 py-22 md:py-0 scrollbar-hide border-x border-[#727272]">
          <div className="flex justify-between items-center border-b border-[#727272] p-4 sticky top-0 bg-black z-10">
            <Link href="/" className="text-white text-[16px] font-[Poppins] flex items-center gap-2 hover:opacity-50">
                <Image src="/images/BackArrow.svg" alt="Til baka" width={8} height={16}/>
              <span>Til baka</span>
            </Link>
            <div className="flex gap-2">
                <Image src="/images/notifications.svg" alt="Tilkynningar" width={24} height={24}/>
                <h1 className="text-[16px] font-[Poppins]">Tilkynningar</h1>
            </div>
          </div>

          <div className="flex flex-col gap-0">
            {loading ? (
              <p className="text-center text-[#727272] mt-10 font-[Poppins]">Hleður...</p>
            ) : notifications.length === 0 ? (
              <p className="text-center text-[#727272] mt-10 font-[Poppins]">Engar nýjar tilkynningar</p>
            ) : (

              notifications.map((notif) => (
                <div 
                  key={notif._id} 
                  className="flex items-center gap-4 p-4 border-b border-[#727272]">
                  
                  <Image src={notif.authorAvatar || "/images/circle.png"} alt={notif.sender} width={40} height={40} className="rounded-full" />
                  
                  <div className="flex flex-col">
                    <p className="text-sm">
                      <span className="font-bold font-[Poppins]">{notif.sender}</span>
                      <span className="text-white font-[Poppins]"> 
                        {notif.type === 'like' ? ' liked your Krunk' : ' interacted with you'}
                      </span>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Desktop Sidebar - Absolute positioned */}
      <aside className="hidden md:block absolute top-0 h-screen -translate-x-full" style={{ left: 'calc(50% - 224px)' }}>
          <Navbar />
      </aside>
    </div>
  );
}