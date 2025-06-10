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
    <header className="detail-header">
      <aside className="user-info">
        <h1 className="tracking-normal">{title}</h1>
        <figure>
          <button onClick={() => router.push(`/profile/${ownerId}`)}>
            <Image
              src={userImg || ""}
              alt="User"
              height={24}
              width={24}
              className="rounded-full"
            />
            <h2 className="text-lg capitalize tracking-wide ">{username}</h2>
          </button>
          <figcaption className="ml-2">
            <span>.</span>
            <p className="ml-2">{daysAgo(createdAt)}</p>
          </figcaption>

        </figure>
         <div>
          <p className="text-justify">{description}</p>
        </div>
      </aside>
      <aside className="cta">
        <button onClick={handleCopyLink}>
          <div className="flex items-center font-bold gap-1">
            {copied ? <>
              <ClipboardCheck className="h-4 w-4 text-green-500 " />
              <span className="text-green-500 ">Copied!!</span>
            </> : <>
              <Copy className="h-4 w-4 text-blue-500" />
              <span className="text-blue-500">Share Link</span>
            </>}
          </div>
        </button>
      </aside>
      
    </header>
  );
};

export default VideoDetailHeader;
