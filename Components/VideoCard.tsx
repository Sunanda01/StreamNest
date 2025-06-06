"use client"
import { Eye,LinkIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const VideoCard = ({
  id,
  title,
  thumbnail,
  createdAt,
  userImg,
  username,
  views,
  visibility,
  duration,
}: VideoCardProps) => {
  return (
    <Link href={`/video/${id}`} className="video-card">
      <Image src={thumbnail} alt="thumbnail" width={290} height={160} />
      <article>
        <div>
          <figure>
            <Image src={userImg} alt="avatar" width={34} height={34} className="rounded-full aspect-square" />
            <figcaption>
              <h3>{username}</h3>
              <p>{visibility}</p>
            </figcaption>
          </figure>
          <aside>
            <Eye />
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
      <button onClick={()=>{}} className="copy-btn">
          <LinkIcon className="h-6 w-6"/>
      </button>
      {duration && (
        <div className="duration tracking-widest">
          {Math.ceil(duration/60)} min
        </div>
      )}
    </Link>
  )
}

export default VideoCard