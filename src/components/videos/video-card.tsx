import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Play, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoPlayer } from "@/components/videos/video-player";
import type { Video } from "@/types";

interface VideoCardProps {
  video: Video;
  onSelect?: (video: Video) => void;
}

export function VideoCard({ video }: VideoCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoError = () => {
    setError("Failed to load video. Please try again.");
    setIsLoading(false);
  };

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open && videoRef.current) {
      videoRef.current.pause();
    }
    setError(null);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:shadow-md transition-all">
          <div className="relative">
            <AspectRatio ratio={16 / 9}>
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 to-black/10">
                <div className="bg-white/20 rounded-full p-4 backdrop-blur-sm transition-transform hover:scale-110">
                  <Play className="h-10 w-10 text-white fill-white" />
                </div>
              </div>
              <video
                className="h-full w-full object-cover"
                poster={`${video.url}?thumb`}
                preload="none"
              >
                <source src={video.url} type="video/mp4" />
              </video>
            </AspectRatio>
          </div>
          <CardContent className="p-4">
            <h3 className="font-medium text-lg mb-2">{video.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {video.description.split("\n")[0]}
            </p>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-4xl">
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 p-4">
              <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
              <p className="text-white text-center mb-4">{error}</p>
              <Button variant="secondary" onClick={() => setError(null)}>
                Try Again
              </Button>
            </div>
          )}

          <VideoPlayer
            ref={videoRef}
            url={video.url}
            onLoadStart={() => setIsLoading(true)}
            onCanPlay={() => setIsLoading(false)}
            onError={handleVideoError}
          />
        </div>

        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">{video.title}</h2>
          <div className="prose prose-sm max-w-none">
            {video.description.split("\n").map((paragraph, index) => (
              <p
                key={index}
                className={
                  paragraph.startsWith("Fazit für uns:")
                    ? "font-semibold text-primary"
                    : ""
                }
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
