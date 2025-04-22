import {
  forwardRef,
  useRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import { VideoControls } from "./video-controls";
import { useVideoPlayer } from "@/hooks/use-video-player";
import { Play, Loader2 } from "lucide-react";

interface VideoPlayerProps {
  url: string;
  onLoadStart?: () => void;
  onCanPlay?: () => void;
  onError?: () => void;
  controls?: boolean;
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  ({ url, onLoadStart, onCanPlay, onError, controls = true }, ref) => {
    const internalRef = useRef<HTMLVideoElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showPlayButton, setShowPlayButton] = useState(true);

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
      setIsMobile(window.innerWidth < 640);
    }, []);

    // Allow both internal and external refs to work
    useImperativeHandle(ref, () => internalRef.current as HTMLVideoElement);

    const {
      isPlaying,
      currentTime,
      duration,
      volume,
      isMuted,
      togglePlay,
      handleTimeUpdate,
      handleSeek,
      handleVolumeChange,
      toggleMute,
      handleSkip,
    } = useVideoPlayer(internalRef as React.RefObject<HTMLVideoElement>);

    const containerRef = useRef<HTMLDivElement>(null);

    const handleFullscreen = () => {
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

    const handleInternalPlayClick = () => {
      togglePlay();
      setShowPlayButton(false);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      onLoadStart?.();
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      onCanPlay?.();
    };

    const handleVideoTap = () => {
      togglePlay();
    };

    return (
      <div
        ref={containerRef}
        className="relative group w-full h-full mx-auto overflow-hidden"
      >
        <video
          ref={internalRef}
          src={url}
          className="w-full aspect-video bg-black object-contain rounded-md"
          onLoadStart={handleLoadStart}
          onCanPlay={handleCanPlay}
          onError={onError}
          onTimeUpdate={handleTimeUpdate}
          onPause={() => setShowPlayButton(true)}
          onPlay={() => setShowPlayButton(false)}
          preload="metadata"
          webkit-playsinline="true"
          controls={isMobile}
          onClick={handleVideoTap}
        />

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Loader2 className="h-12 w-12 animate-spin text-white" />
          </div>
        )}

        {/* Play button overlay */}
        {!isLoading && showPlayButton && !isPlaying && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/30 
                      cursor-pointer z-20 pointer-events-auto"
            onClick={handleInternalPlayClick}
          >
            <div className="bg-white/10 rounded-full p-4 backdrop-blur-sm hover:bg-white/20 transition-all">
              <Play className="h-10 w-10 text-white fill-white" />
            </div>
          </div>
        )}

        {/* Controls - only show when playing or hovering */}
        {controls && (
          <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <VideoControls
              isPlaying={isPlaying}
              duration={duration}
              currentTime={currentTime}
              volume={volume}
              isMuted={isMuted}
              onPlayPause={togglePlay}
              onSeek={handleSeek}
              onVolumeChange={handleVolumeChange}
              onToggleMute={toggleMute}
              onSkip={handleSkip}
              onFullscreen={handleFullscreen}
            />
          </div>
        )}
      </div>
    );
  }
);

VideoPlayer.displayName = "VideoPlayer";
