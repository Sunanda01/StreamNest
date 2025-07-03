import EmptyState from "@/Components/EmptyState";
import Header from "@/Components/header";
import VideoCard from "@/Components/VideoCard";
import { ParamsWithSearch } from "@/index";
import { getAllVideosByUser } from "@/lib/actions/video";
import { Video } from "lucide-react";

const page = async ({ params, searchParams }: ParamsWithSearch) => {
  const { id } = await params;
  const { query, flter } = await searchParams;
  const { user, videos } = await getAllVideosByUser(id, query, flter);
  if (!user) return "/404";
  const publicVideos = videos.filter(({ video }) => video.visibility === "public");
  const privateVideos = videos.filter(({ video }) => video.visibility === "private");
  return (
    <div className="wrapper page">
      <Header
        subHeader={user.email}
        title={user.name}
        userImg={user.image || "/assets/images/dummy.jpg"}
      />
      {publicVideos.length === 0 && privateVideos.length === 0 && (<EmptyState
        icon={Video}
        title="No Video Found"
        description="Share Your First Video With Others 😎"
      />)}
      {privateVideos?.length > 0 ? (

        <div className="">
          <h1 className="font-bold text-4xl font-serif tracking-normal text-fuchsia-800">Private Video</h1>
          <section className="video-grid mt-5 ml-2 p-2">
            {privateVideos.map(({ video, user }) => (
              <VideoCard
                key={video.videoId}
                {...video}
                thumbnail={video.thumbnailUrl}
                userImg={user?.image || ""}
                username={user?.name || ""}
              />
            ))}
          </section>
        </div>
      ) : ("")}
      {publicVideos?.length > 0 ? (

        <div className="">
          <h1 className="font-bold text-4xl font-serif tracking-normal text-indigo-600">Public Video</h1>
          <section className="video-grid mt-5 ml-2 p-2">
            {publicVideos.map(({ video, user }) => (
              <VideoCard
                key={video.videoId}
                {...video}
                thumbnail={video.thumbnailUrl}
                userImg={user?.image || ""}
                username={user?.name || ""}
              />
            ))}
          </section>
        </div>
      ) : ("")}
    </div>
  );
};

export default page;
