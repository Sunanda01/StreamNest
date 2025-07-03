import EmptyState from "@/Components/EmptyState";
import Header from "@/Components/header";
import Pagination from "@/Components/Pagination";
import VideoCard from "@/Components/VideoCard";
import { SearchParams } from "@/index";
import { getAllVideos } from "@/lib/actions/video";
import { auth } from "@/lib/auth";
import { Video } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const HomePage = async ({ searchParams }: SearchParams) => {
  const { query, filter, page } = await searchParams;
  const { otherVideos = [], userVideos = [], pagination } = await getAllVideos(
    query,
    filter,
    Number(page) || 1
  );
  console.log("otherVideos", otherVideos);
  console.log("userVideos", userVideos);

  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!session) {
    redirect('/sign-in');
  }

  const hasAnyVideo = otherVideos.length > 0 || userVideos.length > 0;

  return (
    <main className="wrapper page">
      <Header subHeader="Public Library" title="All videos" />

      {!hasAnyVideo && (
        <EmptyState
          icon={Video}
          title="No Video Found"
          description="Try adjusting your search"
        />
      )}

      {/* Videos by others */}
      {otherVideos?.length > 0 && (
        <section className="video-grid">
          {otherVideos.map(({ video, user }) => (
            <VideoCard
              key={video.videoId}
              {...video}
              thumbnail={video.thumbnailUrl}
              userImg={user?.image || ""}
              username={user?.name || ""}
            />
          ))}
        </section>
      )}

      {/* Your own videos */}
      {userVideos?.length > 0 && (
        <>
          <h1 className="tracking-normal text-xl lg:text-3xl md:text-2xl font-bold">
            Videos Uploaded By You
          </h1>
          <section className="video-grid">
            {userVideos.map(({ video, user }) => (
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

      {pagination?.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          queryString={query}
          filterString={filter}
        />
      )}
    </main>
  );
};

export default HomePage;



