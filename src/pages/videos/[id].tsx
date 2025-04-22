// pages/VideoAnalysisPage.tsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  X,
  ChevronRight,
  ChevronLeft as ChevronLeftIcon,
} from "lucide-react";
import { games, getVideosForGame } from "@/data/games";
import type { Video } from "@/types";
import { VideoPlayer } from "@/components/videos/video-player";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWindowSize } from "@/hooks/use-window-size";

const VideoAnalysisPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const windowSize = useWindowSize();
  const gridRef = useRef<HTMLDivElement>(null);

  // find game & its videos
  const game = games.find((g) => g.id === Number(id));
  const allGameVideos = useMemo(
    () => (game ? getVideosForGame(game) : []),
    [game]
  );

  const [selectedVideo, setSelectedVideo] = useState<Video | null>(
    allGameVideos[0] ?? null
  );
  const [showVideoList, setShowVideoList] = useState(false);

  // pagination state for desktop
  const [currentPage, setCurrentPage] = useState(0);

  // Use a consistent videosPerPage calculation
  const videosPerPage = useMemo(() => {
    if (windowSize.width < 640) return 1; // mobile
    if (windowSize.width < 768) return 2; // small tablet
    if (windowSize.width < 1024) return 3; // tablet
    if (windowSize.width < 1280) return 4; // small desktop
    return 6; // large desktop
  }, [windowSize.width]);

  const totalPages = Math.ceil(allGameVideos.length / videosPerPage);

  // slice for desktop grid
  const currentVideos = useMemo(() => {
    const start = currentPage * videosPerPage;
    return allGameVideos.slice(start, start + videosPerPage);
  }, [allGameVideos, currentPage, videosPerPage]);

  // clamp page if layout changes
  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(Math.max(0, totalPages - 1));
    }
  }, [totalPages, currentPage]);

  // helpers for mobile prev/next
  const idx = selectedVideo
    ? allGameVideos.findIndex((v) => v.id === selectedVideo.id)
    : -1;
  const isFirst = idx <= 0;
  const isLast = idx === allGameVideos.length - 1;
  const goPrev = () => {
    if (!isFirst) setSelectedVideo(allGameVideos[idx - 1]);
  };
  const goNext = () => {
    if (!isLast) setSelectedVideo(allGameVideos[idx + 1]);
  };

  if (!game) return <div>Game not found</div>;

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 space-y-6">
      {/* Back + Title */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/videos")}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {game.homeTeam} vs {game.awayTeam}
          </h1>
          <p className="text-sm text-muted-foreground">
            {game.competition} — {game.date}
          </p>
        </div>
      </div>

      {/* Game Info */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">{game.date}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Score</p>
              <p className="font-medium">{game.score}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Competition</p>
              <p className="font-medium">{game.competition}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Picker */}
      <Card className="w-full">
        <CardContent className="p-3">
          <h2 className="text-sm font-medium mb-2">Game Videos</h2>

          {/* MOBILE UI - RESTORED */}
          <div className="flex items-center gap-2 mb-4 sm:hidden">
            <Button
              variant="outline"
              size="icon"
              onClick={goPrev}
              disabled={isFirst}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <select
              className="flex-1 border rounded px-2 py-1"
              value={selectedVideo?.id}
              onChange={(e) => {
                const vid = allGameVideos.find(
                  (v) => String(v.id) === e.target.value
                );
                if (vid) setSelectedVideo(vid);
              }}
            >
              {allGameVideos.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.title}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              size="icon"
              onClick={goNext}
              disabled={isLast}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* DESKTOP/TABLET GRID */}
          <div className="hidden sm:block">
            <div
              ref={gridRef}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 mb-4"
            >
              {currentVideos.map((video) => {
                const isSelected = selectedVideo?.id === video.id;

                return (
                  <div
                    key={video.id}
                    onClick={() => setSelectedVideo(video)}
                    className="cursor-pointer group"
                  >
                    {/* Thumbnail container */}
                    <div
                      className={`
                      aspect-video rounded-md overflow-hidden relative
                      transition-all duration-200
                      ${
                        isSelected
                          ? "ring-2 ring-primary"
                          : "hover:ring-2 hover:ring-gray-300"
                      }
                    `}
                    >
                      {/* Thumbnail image */}
                      <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800"></div>

                      {/* Overlay for selected state */}
                      <div
                        className={`
                        absolute inset-0 flex items-center justify-center
                        ${
                          isSelected
                            ? "bg-primary/10"
                            : "bg-black/20 opacity-0 group-hover:opacity-100"
                        }
                        transition-opacity duration-200
                      `}
                      >
                        {/* Play icon */}
                        <div
                          className={`
                          rounded-full bg-white/20 p-2 backdrop-blur-sm
                          transition-all duration-200
                        `}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-5 h-5 text-white"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Playing indicator dot */}
                      {isSelected && (
                        <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 flex space-x-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                        </div>
                      )}
                    </div>

                    {/* Video title */}
                    <p
                      className={`
                      mt-2 text-xs font-medium line-clamp-1
                      ${isSelected ? "text-primary" : ""}
                    `}
                    >
                      {video.title}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                >
                  <ChevronLeftIcon className="h-4 w-4 mr-1" />
                  Prev
                </Button>

                <div className="flex items-center">
                  <span className="text-sm">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={currentPage === totalPages - 1}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Featured Video */}
      {selectedVideo && (
        <div className="space-y-4">
          <Card className="w-full">
            <CardContent className="p-4">
              <div className="w-full">
                <VideoPlayer key={selectedVideo.id} url={selectedVideo.url} />
              </div>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-2">
                {selectedVideo.title}
              </h3>
              <div className="prose prose-sm max-w-full">
                {selectedVideo.description.split("\n").map((p, i) => (
                  <p
                    key={i}
                    className={
                      p.startsWith("Fazit für uns:")
                        ? "font-semibold text-primary"
                        : ""
                    }
                  >
                    {p}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* "All Videos" Overlay (mobile only) */}
      {showVideoList && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-lg w-full max-w-4xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold">All Videos</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowVideoList(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {allGameVideos.map((vid) => (
                  <Card
                    key={vid.id}
                    className={`cursor-pointer transition-all ${
                      selectedVideo?.id === vid.id
                        ? "ring-2 ring-primary"
                        : "hover:shadow-md"
                    }`}
                    onClick={() => {
                      setSelectedVideo(vid);
                      setShowVideoList(false);
                    }}
                  >
                    <CardContent className="p-4">
                      <div
                        className="aspect-video mb-2 rounded-md overflow-hidden bg-muted 
                                    flex items-center justify-center"
                      >
                        <span className="text-sm text-muted-foreground">
                          {vid.title}
                        </span>
                      </div>
                      <h3 className="font-medium line-clamp-2">{vid.title}</h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoAnalysisPage;
