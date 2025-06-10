import VideoDetailHeader from "@/Components/VideoDetailHeader";
import VideoPlayer from "@/Components/VideoPlayer";
import { Params } from "@/index";
import { getVideoById } from "@/lib/actions/video";
import { redirect } from "next/navigation";

const page = async ({ params }: Params) => {
  const { videoId } = await params;
  // const { user,video } = await getVideoById(videoId);
  const videoRecord = await getVideoById(videoId);
  if (!videoRecord) redirect('/404');
  const { user, video } = videoRecord;
  return (
    <main className="wrapper page">
      <VideoDetailHeader
      description={video.description}
        title={video.title}
        createdAt={video.createdAt}
        userImg={user?.image}
        username={user?.name}
        videoId={video.videoId}
        ownerId={video.userId}
        visibility={video.visibility}
        thumbnailUrl={video.thumbnailUrl}
      />
      <section className="video-details">
        <div className="content">
          <VideoPlayer videoId={video?.videoId} />
        </div>
      </section>

    </main>
  )
}

export default page