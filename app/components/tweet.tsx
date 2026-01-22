import Image from "next/image"

interface TweetProps {
  content: string;
  imageUrl?: string;
  createdAt: Date | string;
  authorName: string;
  authorAvatar: string;
  dateAdded?: string;
}

export default function Tweet({ 
  content, 
  imageUrl, 
  createdAt, 
  authorName, 
  authorAvatar 
}: TweetProps) {

  return (
    <div className="border-[#313F4C] border px-6 py-4 hover:bg-gray-900/50 transition">
      {/* Author */}
      <div className="flex items-center gap-3 mb-3">
        <img 
          src={authorAvatar} 
          alt={authorName}
          className="w-12 h-12 rounded-full object-cover"
        />
        <span className="text-white font-semibold">{authorName}</span>
      </div>
      
      {/* Content */}
      <p className="text-white text-base mb-3">{content}</p>

      {/* Image */}
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt="Tweet image" 
          className="rounded-2xl max-w-full mb-3"
        />
      )}

      {/* Timestamp */}
      <p className="text-gray-500 text-sm">
        {new Date(createdAt).toLocaleString('is-IS')}
      </p>

      <Image src="images/edit_icon.svg" alt="Edit icon" width={24} height={24} className="w-2 h-2 flex flex-end"/>

    </div>
  );
}