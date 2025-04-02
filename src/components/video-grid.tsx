import { FC } from "react";
import VideoCard from "./video-card";
import { Video } from "@/types";

interface VideoGridProps {
  videos: Video[];
}

const VideoGrid: FC<VideoGridProps> = ({ videos }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          title={video.title}
          description={video.description}
          url={video.url}
        />
      ))}
    </div>
  );
};

export default VideoGrid;
