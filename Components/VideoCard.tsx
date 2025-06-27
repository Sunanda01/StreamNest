"use client"
import { Eye, LinkIcon, TrashIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { VideoCardProps } from ".."
import { useRouter } from "next/navigation"
import { deleteVideo } from "@/lib/actions/video"
import toast from "react-hot-toast"


const VideoCard = ({
  id,
  description,
  videoId,
  title,
  thumbnail,
  thumbnailUrl,
  createdAt,
  userImg,
  username,
  views,
  visibility,
  duration,
}: VideoCardProps) => {
  const router = useRouter();
  const removeVideo = async () => {
    const del = await deleteVideo(videoId, thumbnailUrl);
    console.log(del);
    if (!del.success) return toast.error(del.message);
    toast.success(del.message);
    return router.refresh();
  }
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
          <aside className="mt-2">
            <Eye className="h-5 w-5" />
            <span>{views}</span>
          </aside>
        </div>
        <h2>
          {title} - {" "}
          {createdAt.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </h2>
      </article>
      <button onClick={(e) => {
        e.stopPropagation()
        router.push(`/video/${videoId}`)
      }} className="copy-btn hover:bg-blue-500">
        <LinkIcon className="h-4 w-4 hover:text-white" />
      </button>
      <button onClick={removeVideo} className="copy-btn mt-8 hover:bg-red-400 ">
        <TrashIcon className="h-4 w-4 fill-black hover:fill-white hover:text-white" />
      </button>
      {duration && (
        <div className="duration tracking-widest mt-0.5">
          {Math.ceil(duration / 60)} min
        </div>
      )}
    </div>
  )
}

export default VideoCard