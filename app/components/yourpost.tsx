import Image from "next/image";

interface TweetProps {
  postId: string;
  content: string;
  imageUrl?: string;
  createdAt: Date | string;
  authorName: string;
  authorAvatar: string;
  dateAdded?: string;
  onEdit: () => void;
}

// Renders a single tweet post
export default function Yourpost({
  content,
  imageUrl,
  createdAt,
  authorName,
  authorAvatar,
  onEdit,
}: TweetProps) {
  return (
    <div className="w-130 h-22 bg-black border border-[#727272] py-3 px-20 flex flex-col">
      <div className="flex flex-row gap-2">
        <Image
          src={authorAvatar} 
          alt={authorName}
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
        <div className="w-full">
          <div className="flex flex-row w-full justify-between items-center">
            <div className="flex flex-row gap-1">
              <p className="text-white font-semibold text-sm">{authorName}</p>
              <p className="text-[#8B99A6] text-sm">@{authorName}</p>
              <p className="text-gray-500 text-xs">
                Posted on {new Date(createdAt).toLocaleString("is-IS")}
              </p>
            </div>
            <Image
              src="/images/edit.svg"
              alt="edit"
              width={12}
              height={12}
              className="cursor-pointer hover:opacity-70"
              onClick={onEdit}
            />
          </div>
          <p className="text-white text-sm">{content}</p>
          {imageUrl && (
            <Image
              src={imageUrl}
              alt="Tweet image"
              width={300}
              height={200}
              className="rounded-2xl max-w-full mb-3 object-cover"
            />
          )}
        </div>
      </div>
    </div>
  );
}