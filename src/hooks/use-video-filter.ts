import { useState, useMemo } from "react";
import { Video } from "../types";

export const useVideoFilter = (videos: Video[]) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredVideos = useMemo(() => {
    return videos.filter((video) =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [videos, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredVideos,
  };
};
