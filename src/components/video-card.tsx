import { FC, useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Play, Loader2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Video } from "@/types";

type VideoCardProps = Omit<Video, "id">;

const VideoCard: FC<VideoCardProps> = ({ title, description, url }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Format description
  const formattedDescription = description
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => line.trim());

  // Handle dialog open/close
  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);

    if (!open) {
      // Reset state when dialog closes
      if (videoRef.current) {
        videoRef.current.pause();
      }
      setBuffering(false);
    }
  };

  // Video event handlers
  const handleVideoLoadStart = () => setIsLoading(true);

  const handleVideoCanPlay = () => {
    setIsLoading(false);
    setBuffering(false);
  };

  const handleVideoError = (
    e: React.SyntheticEvent<HTMLVideoElement, Event>
  ) => {
    console.error("Error loading video:", e);
    setIsLoading(false);
    setBuffering(false);
  };

  const handleWaiting = () => setBuffering(true);
  const handlePlaying = () => setBuffering(false);

  // Force video to play when dialog opens
  useEffect(() => {
    if (isDialogOpen && videoRef.current) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        if (videoRef.current) {
          // Explicitly set controls attribute
          videoRef.current.controls = true;

          // Try to play the video
          videoRef.current.play().catch((err) => {
            console.log("Auto-play prevented:", err);
            // This is expected on some browsers that block autoplay
          });
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isDialogOpen]);

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => {
        console.error("Error exiting fullscreen:", err);
      });
    } else {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error("Error entering fullscreen:", err);
      });
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <DialogTrigger asChild>
          <div className="cursor-pointer">
            <div className="relative">
              <AspectRatio ratio={16 / 9}>
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 to-black/10">
                  <div className="bg-white/20 rounded-full p-4 backdrop-blur-sm transition-transform group-hover:scale-110">
                    <Play className="h-10 w-10 text-white fill-white" />
                  </div>
                </div>
                <video
                  className="h-full w-full object-cover"
                  poster={`${url}?thumb`}
                  preload="none"
                >
                  <source src={url} type="video/quicktime" />
                </video>
              </AspectRatio>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {formattedDescription[0]}
              </p>
            </CardContent>
          </div>
        </DialogTrigger>
      </Card>

      <DialogContent className="sm:max-w-[80vw] p-0">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <div ref={containerRef} className="relative">
          <AspectRatio ratio={16 / 9}>
            <div className="relative w-full h-full">
              {/* Loading or buffering overlay */}
              {(isLoading || buffering) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-10">
                  <Loader2 className="h-12 w-12 animate-spin text-white mb-4" />
                  <p className="text-white text-sm">
                    {isLoading ? "Loading video..." : "Buffering..."}
                  </p>
                </div>
              )}

              {/* Video element */}
              {isDialogOpen && (
                <video
                  ref={videoRef}
                  className="h-full w-full"
                  controls
                  preload="auto"
                  onLoadStart={handleVideoLoadStart}
                  onCanPlay={handleVideoCanPlay}
                  onError={handleVideoError}
                  onWaiting={handleWaiting}
                  onPlaying={handlePlaying}
                  playsInline
                >
                  <source src={url} type="video/quicktime" />
                  Your browser does not support the video tag.
                </video>
              )}

              {/* Fullscreen button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-black/30 hover:bg-black/50 text-white z-20"
                onClick={toggleFullscreen}
              >
                <Maximize2 className="h-5 w-5" />
              </Button>
            </div>
          </AspectRatio>
        </div>

        <div className="p-6 bg-brown/5">
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <div className="prose prose-sm max-w-none">
            {formattedDescription.map((paragraph, index) => (
              <div key={index} className="mb-4">
                {paragraph.startsWith("Fazit für uns:") ? (
                  <>
                    <h3 className="text-lg font-semibold text-gold mb-2">
                      Fazit für uns:
                    </h3>
                    <p className="text-base leading-relaxed">
                      {paragraph.replace("Fazit für uns:", "").trim()}
                    </p>
                  </>
                ) : (
                  <p className="text-base leading-relaxed">{paragraph}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoCard;
