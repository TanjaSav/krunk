import Image from "next/image";

export default function Mobilenav() {
    return (
        <div className="fixed bottom-0 left-0 w-full h-22 bg-black border-t border-[#727272] flex justify-around items-center md:hidden">
            <div className="flex items-center gap-4">
                <Image
                    src="/images/circle.png" 
                    alt="Profile Picture" width={42} height={42}
                />
                <div>
                    <div className="text-poppins text-sm text-white font-regular">
                    Name
                    </div>
                    <div className="text-poppins text-sm text-[#8B99A6] font-regular ">
                    @username
                    </div>
                </div>
            </div>

            {/*  Navigation links */}
            <ul className="flex flex-row gap-16">
                <li>
                <Image src="/images/home.svg" 
                    alt="Heim" width={24} height={24}
                />
                </li>
                <li className="">
                <Image
                    src="/images/notifications.svg" 
                    alt="Tilkynningar" width={24} height={24}
                />
                </li>
                <li className="">
                <Image src="/images/logout.svg" 
                    alt="Skrá út" width={24} height={24} 
                />
                </li>
            </ul>
        </div>
    );
}