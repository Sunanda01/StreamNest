"use client"
import { Eye, LinkIcon, Loader, ThumbsUp, TrashIcon } from "lucide-react"
import Image from "next/image"
import { VideoCardProps, Visibility } from ".."
import { useRouter } from "next/navigation"
import { deleteVideo, likeCount, updateVideoVisibility } from "@/lib/actions/video"
import toast from "react-hot-toast"
import { useEffect, useState } from "react"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/util"
import LikeButton from "./LikeButton"

const VideoCard = ({
  id,
  description,
  videoId,
  videoUrl,
  title,
  thumbnail,
  thumbnailUrl,
  createdAt,
  userId,
  userImg,
  username,
  views,
  visibility,
  duration,
}: VideoCardProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [removeVideoUi, setRemoveVideoUi] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [count, setCount] = useState(0);
  const { data: session } = authClient.useSession();
  // console.log(session?.user);
  const session_userId = session?.user?.id;
  // console.log("session_userId=", session_userId);
  // console.log("userId", userId);
  const visible = [
    { value: "public", label: "Public" },
    { value: "private", label: "Private" },
  ]
  const removeVideo = async () => {
    const del = await deleteVideo(videoId, videoUrl, thumbnailUrl);
    setRemoveVideoUi(true);
    // console.log(del);
    if (!del.success) {
      setRemoveVideoUi(false);
      return toast.error(del.message);
    }
    toast.success(del.message);
    setIsOpen(true);
    router.refresh();
  }
  useEffect(() => {
    const fetchCount = async () => {
      const res = await likeCount(videoId);
      if (res.success) setCount(res?.count || 0);
      else toast.error(res?.message || "Unable to fetch like");
    };

    fetchCount();
  }, [videoId])

  const formatVideoDuration = (durationInSeconds: number): string => {
    if (durationInSeconds < 60) {
      return `${durationInSeconds}s`;
    }

    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.floor(durationInSeconds % 60);

    return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
  };

  return (
    // bg-gradient-to-tr from-teal-100 via-white to-cyan-100

    <div className="video-card rounded bg-gradient-to-br from-slate-100 via-gray-50 to-slate-200

">
      <div className="h-full w-full flex justify-center items-center rounded p-1">
        <Image src={thumbnail} alt={thumbnail} width={300} height={100} priority className="rounded h-[100%] w-[100%] shadow-md shadow-slate-600" />
      </div>
      <article>
        <div>
          <figure>
            <Image src={userImg} alt="avatar" width={34} height={34} className="rounded-full aspect-square" />
            <figcaption>
              <h3>{username}</h3>
              <p>{visibility}</p>
            </figcaption>
          </figure>

        </div>
        <h2 >
          {title} - {" "}
          <span className="text-gray-400 text-sm">
            {createdAt.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </h2>
        <div className="flex gap-5">

          <LikeButton videoId={videoId} views={views} />

        </div>

        <button
          onClick={() => setIsVisible((prev) => !prev)}
          disabled={session_userId !== userId}
          className={cn(
            "bg-teal-600 rounded-full py-2 px-4 font-bold text-md text-white tracking-wider font-serif flex items-center justify-center gap-2 hover:bg-teal-500",
            session_userId !== userId && "hidden"
          )}>
          <span className="flex gap-2">Visibility
            <Eye className="h-6 w-6" /></span>
        </button>

      </article>

      <button onClick={(e) => {
        e.stopPropagation()
        router.push(`/video/${videoId}`)
      }} className="copy-btn hover:bg-blue-500 hover:text-white">
        <LinkIcon className="h-4 w-4 " />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true)
        }}
        disabled={session_userId !== userId}
        className={cn("copy-btn mt-8 hover:bg-red-400 hover:text-white  ", session_userId !== userId && "hidden")} >
        {removeVideoUi
          ? <Loader className="h-4 w-4 " />
          : <TrashIcon className="h-4 w-4   " />}
      </button>

      {isOpen && (
        <div className="absolute z-50 top-10 right-2 bg-white border shadow-md p-3 rounded-md w-40">
          <p className="text-sm mb-2">Are you sure?</p>
          <div className="flex justify-between">
            <button
              className="text-xs text-gray-500 hover:text-black"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
            <button
              className="text-xs text-red-600 hover:font-semibold"
              onClick={removeVideo}
            >
              {removeVideoUi ? "Deleting...." : "Delete"}
            </button>
          </div>
        </div>
      )}

      {duration && (
        <div className="duration tracking-widest mt-0.5">
          {formatVideoDuration(duration)}
        </div>
      )}

      {isVisible && (
        <ul className="absolute z-50 top-full mt-2 right-3 w-40 bg-white border border-gray-200 rounded-lg shadow-lg">
          {visible.map((v) => (
            <li
              key={v.value}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-teal-100 cursor-pointer font-medium rounded-md"
              onClick={async () => {
                const res = await updateVideoVisibility(videoId, v.value as Visibility, userId);
                if (res.success) {
                  toast.success(res?.message);
                  router.refresh();
                } else {
                  toast.error(res?.message);
                }
                setIsVisible(false);
                router.refresh();
              }}
            >
              {v.label}
            </li>
          ))}
        </ul>
      )}


    </div>
  )
}

export default VideoCard

