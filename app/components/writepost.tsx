import Image from "next/image";

function WritePost() {
  return (
    <>
        <div className="border-[#313F4C] border px-12 py-5 m-4 font-normal w-2/3">
            <input
              type="text"
              placeholder="Hvað er að gerast?"
              className="w-full pt-4 pb-8 bg-transparent text-white border-none outline-none focus:outline-none focus:ring-0"
            />
             <div className="border-t border-[#313F4C] pt-4 flex justify-between items-center">
                <Image
                    src="images/addimageicon.svg"
                    alt="Add image"
                    width={24}
                    height={24}
                />
                <button className="text-amber-200">Button</button>
            </div>
          
        </div>
       
    </>
  );
}

export default WritePost;