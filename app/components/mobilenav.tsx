import Image from "next/image";

export default function Mobilenav() {
    return (
        <>
            {/* Header */}
            <header className="fixed top-0 left-0 w-full h-16 bg-black border-b border-[#727272] flex items-center md:hidden">
                
                <Image
                    src="/images/logo.svg" alt="Logo" width={47} height={50}
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
                        src="/images/search.svg" alt="Search icon" width={15} height={15} 
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 color-[#8B99A6]"
                    />
                </div>
                
            </header>

            {/* Footer */}
            <footer className="fixed bottom-0 left-0 w-full h-22 bg-black border-t border-[#727272] flex justify-around items-center md:hidden">
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
            </footer>
        </>
    );
}