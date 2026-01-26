interface TweetProps {
  content: string;
  imageUrl?: string;
  createdAt: Date | string;
  authorName: string;
  authorAvatar: string;
  dateAdded?: string;
}

export default function Yourpost({ 
  content, 
  imageUrl, 
  createdAt, 
  authorName, 
  authorAvatar 
}: TweetProps) {

  return (
        <>
        <div className="w-full bg-black border border-[#727272] py-3 px-4 sm:px-6 md:px-8 lg:px-12 flex flex-col">
            <div className="flex flex-row gap-2">
                
                {/* Author */}
                <img 
                    src={authorAvatar || "/images/circle.png"} 
                    alt={authorName}
                    className="w-10 h-10 rounded-full object-cover"
                />
                <div className="w-full">
                    <div className="flex flex-row w-full justify-between items-center">
                        <div className="flex flex-row gap-1">
                        <p className="text-white font-semibold text-sm">
                            {authorName}
                        </p>
                        <p className="text-[#8B99A6] text-sm">
                            @{authorName}
                        </p>
                        {/* Timestamp */}
                        <p className="text-[#8B99A6] text-[11px] flex items-center pl-2">
                            Posted on {new Date(createdAt).toLocaleString('is-IS', { 
                                month: 'short', 
                                day: 'numeric', 
                                hour: '2-digit', 
                                minute: '2-digit' 
                            })}
                        </p>
                        </div>
                        {/* Edit Icon */}
                        <img 
                            src="/images/edit.svg" 
                            alt="edit" 
                            className="w-4 h-4 hover:cursor-pointer"/>
                    </div>
                    
                    {/* Content */}
                    <p className="text-white text-sm">
                        {content}
                    </p>
                    {/* Image */}
                    {imageUrl && imageUrl.trim() !== '' && (
                        <img 
                        src={imageUrl} 
                        alt="Tweet image" 
                        className="rounded-2xl max-w-full mb-3"
                        />
                    )}
                </div>
            </div>

            {/* Reactions */}
            <div className="flex w-full justify-between pl-4 sm:pl-6 md:pl-8 lg:pl-12 pt-1.5">
                <div className="flex gap-1 items-center">
                    <img 
                        src="/images/Heart.svg" 
                        alt="like" 
                        className="w-3.5 h-3.5"/>
                    <p className="text-[#8B99A6] text-[11px]">1.3K</p>
                </div>
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
            </div>
        </div>
        </>
    )
}