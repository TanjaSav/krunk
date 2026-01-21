

const YourPost = () => {
    return (
        <>
        <div className="w-130 h-22 bg-black border border-[#727272] py-3 px-20">
            <div className="flex flex-col">
                <div className="flex flex-row gap-2">
                    <div className="w-10 h-10 rounded-[100%] bg-neutral-300 shrink-0"></div>
                    <div className="w-full">
                        <div className="flex flex-row w-full justify-between items-center">
                            <div className="flex flex-row gap-1">
                            <p className="text-white font-semibold text-sm">
                                Name
                            </p>
                            <p className="text-[#8B99A6] text-sm">
                                @username
                            </p>
                            </div>
                            <img 
                                src="/images/edit.svg" 
                                alt="edit" 
                                className="w-3 h-3"/>
                        </div>
                        <p className="text-white text-sm">
                            What's happening?
                        </p>
                    </div>
                </div>
                <div className="flex w-full justify-between pl-12 pt-1.5">
                    <div className="flex gap-1 items-center">
                        <img 
                            src="/images/comment.svg" 
                            alt="comment" 
                            className="w-3.5 h-3.5"/>
                        <p className="text-[#8B99A6] text-[11px]">95</p>
                    </div>
                    <div className="flex gap-1 items-center">
                        <img 
                            src="/images/repost.svg" 
                            alt="repost" 
                            className="w-3.5 h-3.5"/>
                        <p className="text-[#8B99A6] text-[11px]">1.3K</p>
                    </div>
                    <div className="flex gap-1 items-center">
                        <img 
                            src="/images/Heart.svg" 
                            alt="like" 
                            className="w-3.5 h-3.5"/>
                        <p className="text-[#8B99A6] text-[11px]">1.3K</p>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default YourPost;