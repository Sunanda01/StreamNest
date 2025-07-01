import EmptyState from "@/Components/EmptyState";
import Header from "@/Components/header";
import Pagination from "@/Components/Pagination";
import VideoCard from "@/Components/VideoCard";
import { SearchParams } from "@/index";
import { getAllVideos } from "@/lib/actions/video";
import { auth } from "@/lib/auth";
import { Video } from "lucide-react";
import { headers } from "next/headers";

const HomePage = async ({ searchParams }: SearchParams) => {
  const { query, filter, page } = await searchParams;
  const { videos, pagination } = await getAllVideos(
    query,
    filter,
    Number(page) || 1
  );
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;
  const sessionuserVideo = videos.filter(((video) => video?.user?.id === user?.id))
  const videoByOtherUser = videos.filter(((video) => video?.user?.id !== user?.id))

  return (
    <main className="wrapper page">


      <Header subHeader="Public Library" title="All videos" />
      {videos.length > 0 ? ("") : (<EmptyState
        icon={Video}
        title="No Video Found"
        description="Try adjusting your search"
      />)}
      {videoByOtherUser?.length > 0 ? (
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
      ) : ("")}

      {pagination?.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          queryString={query}
          filterString={filter}
        />
      )}



      {sessionuserVideo?.length > 0 && (
        <>
          <h1 className="tracking-normal text-xl lg:text-3xl md:text-2xl font-bold">Videos Uploaded By You</h1>
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
        </>
      )}
    </main>
  );
};

export default HomePage;



