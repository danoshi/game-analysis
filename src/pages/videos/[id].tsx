// pages/VideoAnalysisPage.tsx
import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Play, Menu, X } from "lucide-react";
import { games, getVideosForGame } from "@/data/games";
import type { Video } from "@/types";
import { VideoPlayer } from "@/components/videos/video-player";
import { ScrollArea } from "@/components/ui/scroll-area";

const VideoAnalysisPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // find game & its videos
  const game = games.find((g) => g.id === Number(id));
  const allGameVideos = useMemo(
    () => (game ? getVideosForGame(game) : []),
    [game]
  );

  const [selectedVideo, setSelectedVideo] = useState<Video | null>(
    allGameVideos[0] ?? null
  );
  const [showMobileVideoList, setShowMobileVideoList] = useState(false);

  // Get next/previous videos for navigation
  const currentIndex = selectedVideo
    ? allGameVideos.findIndex((v) => v.id === selectedVideo.id)
    : -1;
  const nextVideo = currentIndex < allGameVideos.length - 1 ? allGameVideos[currentIndex + 1] : null;
  const prevVideo = currentIndex > 0 ? allGameVideos[currentIndex - 1] : null;

  if (!game) return <div>Game not found</div>;

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 bg-background border-b px-4 py-3">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/videos")}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold truncate">
              {game.homeTeam} vs {game.awayTeam}
            </h1>
            <p className="text-sm text-muted-foreground">
              {game.competition} • {game.date} • {game.score}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setShowMobileVideoList(true)}
          >
            <Menu className="h-4 w-4 mr-2" />
            Videos ({allGameVideos.length})
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">

        {/* Video List Sidebar - Desktop */}
        <div className="hidden lg:flex flex-col w-80 border-r bg-muted/30">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Videos ({allGameVideos.length})</h2>
            <p className="text-sm text-muted-foreground">Click to play</p>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {allGameVideos.map((video) => {
                const isSelected = selectedVideo?.id === video.id;
                return (
                  <div
                    key={video.id}
                    onClick={() => setSelectedVideo(video)}
                    className={`
                      p-3 rounded-lg cursor-pointer transition-all duration-200
                      hover:bg-accent hover:text-accent-foreground
                      ${
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-background"
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center
                          ${
                            isSelected
                              ? "bg-primary-foreground/20"
                              : "bg-primary text-primary-foreground"
                          }
                        `}>
                          <Play className="w-3 h-3" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm leading-tight">
                          {video.title}
                        </h3>
                        <p className={`
                          text-xs mt-1 line-clamp-2 leading-relaxed
                          ${
                            isSelected
                              ? "text-primary-foreground/80"
                              : "text-muted-foreground"
                          }
                        `}>
                          {video.description.split('\n')[0]}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Main Video Area */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Video Player */}
          <div className="flex-1 p-4 lg:p-6">
            {selectedVideo ? (
              <div className="h-full flex flex-col">
                <div className="flex-1 min-h-0">
                  <VideoPlayer key={selectedVideo.id} url={selectedVideo.url} className="h-full" />
                </div>
                
                {/* Video Navigation */}
                <div className="flex items-center justify-between mt-4 lg:hidden">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => prevVideo && setSelectedVideo(prevVideo)}
                    disabled={!prevVideo}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {currentIndex + 1} of {allGameVideos.length}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => nextVideo && setSelectedVideo(nextVideo)}
                    disabled={!nextVideo}
                  >
                    Next
                    <ChevronLeft className="h-4 w-4 ml-1 rotate-180" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a video to start watching</p>
                </div>
              </div>
            )}
          </div>

          {/* Video Details Sidebar - Desktop */}
          <div className="hidden lg:flex flex-col w-80 border-l bg-muted/30">
            {selectedVideo ? (
              <>
                <div className="p-4 border-b">
                  <h3 className="font-semibold text-lg leading-tight">
                    {selectedVideo.title}
                  </h3>
                </div>
                <ScrollArea className="flex-1 p-4">
                  <div className="prose prose-sm max-w-none">
                    {selectedVideo.description.split("\n").map((paragraph, i) => {
                      if (paragraph.trim() === "") return null;
                      return (
                        <p
                          key={i}
                          className={
                            paragraph.startsWith("Fazit für uns:") ||
                            paragraph.startsWith("Wichtige Merkmale:") ||
                            paragraph.startsWith("Wichtiges Merkmal:")
                              ? "font-semibold text-primary mt-4 first:mt-0"
                              : "mb-3"
                          }
                        >
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>
                </ScrollArea>
                
                {/* Navigation in sidebar */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => prevVideo && setSelectedVideo(prevVideo)}
                      disabled={!prevVideo}
                      className="flex-1"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => nextVideo && setSelectedVideo(nextVideo)}
                      disabled={!nextVideo}
                      className="flex-1"
                    >
                      Next
                      <ChevronLeft className="h-4 w-4 ml-1 rotate-180" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    {currentIndex + 1} of {allGameVideos.length} videos
                  </p>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground p-4">
                <div className="text-center">
                  <p className="text-sm">Video details will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Video List Overlay */}
      {showMobileVideoList && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm lg:hidden">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Select Video</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMobileVideoList(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-2">
                {allGameVideos.map((video) => {
                  const isSelected = selectedVideo?.id === video.id;
                  return (
                    <div
                      key={video.id}
                      onClick={() => {
                        setSelectedVideo(video);
                        setShowMobileVideoList(false);
                      }}
                      className={`
                        p-4 rounded-lg cursor-pointer transition-all
                        hover:bg-accent hover:text-accent-foreground
                        ${
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-card"
                        }
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center
                            ${
                              isSelected
                                ? "bg-primary-foreground/20"
                                : "bg-primary text-primary-foreground"
                            }
                          `}>
                            <Play className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium leading-tight">
                            {video.title}
                          </h3>
                          <p className={`
                            text-sm mt-1 line-clamp-2
                            ${
                              isSelected
                                ? "text-primary-foreground/80"
                                : "text-muted-foreground"
                            }
                          `}>
                            {video.description.split('\n')[0]}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoAnalysisPage;
