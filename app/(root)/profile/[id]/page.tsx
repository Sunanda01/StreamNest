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
  return (
    <div className="wrapper page">
      <Header
        subHeader={user.email}
        title={user.name}
        userImg={user.image || "/assets/images/dummy.jpg"}
      />
      {videos?.length > 0 ? (
        <section className="video-grid">
          {videos.map(({ video, user }) => (
            <VideoCard
              key={video.videoId}
              {...video}
              thumbnail={video.thumbnailUrl}
              userImg={user?.image || ""}
              username={user?.name || ""}
            />
          ))}
        </section>
      ) : (
        <EmptyState
          icon={Video}
          title="No Video Found"
          description="Try adjusting your search"
        />
      )}
    </div>
  );
};

export default page;
