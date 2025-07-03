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
    console.log(del);
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
    <div className="video-card">
      <Image src={thumbnail} alt={thumbnail} width={290} height={160} priority />
      <article>
        <div>
          <figure>
            <Image src={userImg} alt="avatar" width={34} height={34} className="rounded-full aspect-square" />
            <figcaption>
              <h3>{username}</h3>
              <p>{visibility}</p>
            </figcaption>
          </figure>
          <div className="flex gap-5">
            <aside className="mt-3 flex justify-center items-center gap-1">
              <Eye className="h-6 w-6 fill-gray-400 text-white" />
              <span className="font-bold text-lg">{views}</span>
            </aside>
            <aside className="mt-3 flex justify-center items-center gap-1">
              <ThumbsUp className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-lg">{count}</span>
            </aside>
          </div>
        </div>
        <h2>
          {title} - {" "}
          {createdAt.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </h2>


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
        <ul className="bg-slate-100   rounded-md shadow-md flex flex-col ml-2 mr-2 mb-2">
          {visible.map((v) => (
            <li
              key={v.value}
              className="text-sm px-3 py-2 hover:bg-teal-100 cursor-pointer w-full justify-center items-center flex rounded-md font-bold tracking-wide text-teal-700"
              onClick={async () => {
                const res = await updateVideoVisibility(videoId, v.value as Visibility, userId);
                if (res.success) {
                  toast.success(res?.message);
                  setIsVisible(false);
                  router.refresh();
                }
                else {
                  toast.error(res?.message);
                  setIsVisible(false);
                  router.refresh();
                }
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

