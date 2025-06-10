import EmptyState from "@/Components/EmptyState";
import Header from "@/Components/header";
import Pagination from "@/Components/Pagination";
import VideoCard from "@/Components/VideoCard";
import { SearchParams } from "@/index";
import { getAllVideos } from "@/lib/actions/video";
import { Video } from "lucide-react";

const HomePage = async ({ searchParams }: SearchParams) => {
  const { query, filter, page } = await searchParams;
  const { videos, pagination } = await getAllVideos(
    query,
    filter,
    Number(page) || 1
  );
  return (
    <main className="wrapper page">
      <Header subHeader="Public Library" title="All videos" />
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
