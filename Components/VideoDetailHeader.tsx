"use client";
import { daysAgo } from "@/lib/util";
import { VideoDetailHeaderProps } from "..";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ClipboardCheck, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const VideoDetailHeader = ({
  title,
  description,
  createdAt,
  userImg,
  username,
  videoId,
  ownerId,
  visibility,
  thumbnailUrl,
}: VideoDetailHeaderProps) => {
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/video/${videoId}`);
    setCopied(true);
    toast.success("Link Copied!!!");
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      if (copied) setCopied(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [copied])

 return (
  <header className="w-full flex flex-col gap-4 px-4 py-2 sm:py-4">
    {/* Title */}
    <h1 className="lg:text-4xl md:text-3xl text-xl font-semibold tracking-normal leading-snug">
      {title}
    </h1>

    {/* User Info Section */}
    <div className="flex items-start sm:items-center gap-3 flex-wrap">
      <button onClick={() => router.push(`/profile/${ownerId}`)} className="flex items-center gap-2">
        <Image
          src={userImg || "/assets/images/dummy.jpg"}
          alt="User"
          height={32}
          width={32}
          className="rounded-full object-cover"
        />
        <div className="text-sm sm:text-base leading-tight flex items-center gap-10 lg:text-2xl">
          <h2 className="capitalize font-medium text-sm lg:text-xl">{username}</h2>
          <p className="text-gray-500 text-xs lg:text-lg">{daysAgo(createdAt)}</p>
        </div>
      </button>
    </div>

    {/* Description */}
    <p className="text-sm sm:text-base text-justify text-gray-800 leading-relaxed">
      {description}
    </p>

    {/* Share Link Button */}
    <div className="self-start">
      <button onClick={handleCopyLink} className="flex items-center gap-1 text-sm font-semibold">
        {copied ? (
          <>
            <ClipboardCheck className="h-4 w-4 text-green-500" />
            <span className="text-green-500">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="h-4 w-4 text-blue-500" />
            <span className="text-blue-500">Share Link</span>
          </>
        )}
      </button>
    </div>
  </header>
);
};

export default VideoDetailHeader;
