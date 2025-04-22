import {
  forwardRef,
  useRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import { MobileAwareVideoControls } from "./video-mobile-controls";
import { useVideoPlayer } from "@/hooks/use-video-player";
import { Play, Loader2, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoPlayerProps {
  url: string;
  onLoadStart?: () => void;
  onCanPlay?: () => void;
  onError?: () => void;
  controls?: boolean;
}

// Add these interface definitions for fullscreen support
interface FullscreenDocument extends Document {
  webkitFullscreenElement?: Element;
  mozFullScreenElement?: Element;
  msFullscreenElement?: Element;
  webkitExitFullscreen?: () => Promise<void>;
  mozCancelFullScreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
}

interface FullscreenElement extends HTMLDivElement {
  webkitRequestFullscreen?: () => Promise<void>;
  mozRequestFullScreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  ({ url, onLoadStart, onCanPlay, onError, controls = true }, ref) => {
    const internalRef = useRef<HTMLVideoElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showPlayButton, setShowPlayButton] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 640 || window.innerHeight < 480);
      };
      handleResize();
      window.addEventListener("resize", handleResize);

      // Handle orientation change specifically
      window.addEventListener("orientationchange", () => {
        handleResize();
        // Force controls to show briefly after orientation change
        setShowControls(true);
        resetControlsTimeout();
      });

      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("orientationchange", handleResize);
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
      };
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

    // Check fullscreen state
    const checkFullscreenState = () => {
      const doc = document as FullscreenDocument;
      const isInFullscreen = !!(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );
      setIsFullscreen(isInFullscreen);
    };

    // Handle fullscreen change events
    useEffect(() => {
      document.addEventListener("fullscreenchange", checkFullscreenState);
      document.addEventListener("webkitfullscreenchange", checkFullscreenState);
      document.addEventListener("mozfullscreenchange", checkFullscreenState);
      document.addEventListener("MSFullscreenChange", checkFullscreenState);

      return () => {
        document.removeEventListener("fullscreenchange", checkFullscreenState);
        document.removeEventListener(
          "webkitfullscreenchange",
          checkFullscreenState
        );
        document.removeEventListener(
          "mozfullscreenchange",
          checkFullscreenState
        );
        document.removeEventListener(
          "MSFullscreenChange",
          checkFullscreenState
        );
      };
    }, []);

    const handleFullscreen = () => {
      if (!containerRef.current) return;

      const doc = document as FullscreenDocument;
      const element = containerRef.current as FullscreenElement;

      if (isFullscreen) {
        // Exit fullscreen with cross-browser support
        if (doc.exitFullscreen) {
          doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          doc.webkitExitFullscreen();
        } else if (doc.mozCancelFullScreen) {
          doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) {
          doc.msExitFullscreen();
        }
      } else {
        // Enter fullscreen with cross-browser support
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        }
      }

      // Show controls briefly when toggling fullscreen
      setShowControls(true);
      resetControlsTimeout();
    };

    const resetControlsTimeout = () => {
      // Clear any existing timeout
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }

      // Set a new timeout to hide controls after 3 seconds
      if (isPlaying && isMobile) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    };

    const handleInternalPlayClick = () => {
      togglePlay();
      setShowPlayButton(false);
      resetControlsTimeout();
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
      // Toggle controls visibility on mobile
      if (isMobile) {
        setShowControls(!showControls);
        resetControlsTimeout();
      }

      // Only toggle play if we're not showing controls
      if (!showControls) {
        togglePlay();
      }
    };

    // Reset controls timeout when play state changes
    useEffect(() => {
      resetControlsTimeout();
    }, [isPlaying]);

    // Add touch gesture support for mobile
    useEffect(() => {
      if (!containerRef.current || !isMobile) return;

      let touchStartX = 0;
      let touchStartY = 0;
      let touchStartTime = 0;

      const handleTouchStart = (e: TouchEvent) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
      };

      const handleTouchEnd = (e: TouchEvent) => {
        if (!internalRef.current) return;

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const touchEndTime = Date.now();

        const xDiff = touchEndX - touchStartX;
        const yDiff = touchEndY - touchStartY;
        const timeDiff = touchEndTime - touchStartTime;

        // If it's a quick tap with minimal movement, toggle controls
        if (Math.abs(xDiff) < 30 && Math.abs(yDiff) < 30 && timeDiff < 300) {
          setShowControls(!showControls);
          resetControlsTimeout();
          return;
        }

        // Swipe left/right for seeking (only if horizontal movement is dominant)
        if (Math.abs(xDiff) > 60 && Math.abs(xDiff) > Math.abs(yDiff) * 1.5) {
          if (xDiff > 0) {
            // Swipe right: forward
            handleSkip(15);
          } else {
            // Swipe left: backward
            handleSkip(-15);
          }
          // Show controls briefly after seeking
          setShowControls(true);
          resetControlsTimeout();
        }
      };

      const element = containerRef.current;
      element.addEventListener("touchstart", handleTouchStart);
      element.addEventListener("touchend", handleTouchEnd);

      return () => {
        element.removeEventListener("touchstart", handleTouchStart);
        element.removeEventListener("touchend", handleTouchEnd);
      };
    }, [isMobile, togglePlay, handleSkip, showControls]);

    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
      <div className="w-full">
        {/* Video container */}
        <div
          ref={containerRef}
          className={`relative w-full mx-auto overflow-hidden ${
            !isMobile ? "group" : ""
          }`}
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
            playsInline={true}
            x-webkit-airplay="allow"
            disablePictureInPicture={isMobile}
            controls={false}
            onClick={handleVideoTap}
          />

          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Loader2 className="h-12 w-12 animate-spin text-white" />
            </div>
          )}

          {/* Play button overlay - only for desktop */}
          {!isLoading && showPlayButton && !isPlaying && !isMobile && (
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

          {/* MOBILE UI ELEMENTS */}
          {isMobile && controls && (
            <>
              {/* Fullscreen button for mobile - top right - always visible */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFullscreen}
                className={`absolute top-2 right-2 text-white bg-black/30 rounded-full transition-opacity ${
                  showControls ? "opacity-100" : "opacity-0"
                }`}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-6 w-6" />
                ) : (
                  <Maximize2 className="h-6 w-6" />
                )}
              </Button>

              {/* Mobile controls overlay - shows/hides based on showControls state */}
              {showControls && (
                <div className="absolute inset-0 z-10 flex flex-col justify-end">
                  {/* Progress bar for mobile - bottom of video */}
                  <div className="px-2 pb-2 pt-8 bg-gradient-to-t from-black/70 to-transparent">
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        value={currentTime}
                        onChange={(e) => handleSeek(Number(e.target.value))}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        style={{
                          backgroundSize: `${
                            (currentTime / (duration || 1)) * 100
                          }% 100%`,
                          backgroundImage: "linear-gradient(#fff, #fff)",
                        }}
                      />
                    </div>
                  </div>

                  {/* Mobile controls bar */}
                  <div className="bg-black/70 p-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSkip(-10)}
                        className="text-white rounded-full p-2"
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12.5 8L9.5 11L12.5 14"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M10 11H16.5"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M5.98898 11.91C5.61061 13.4271 5.83477 15.0334 6.61429 16.3837C7.39382 17.734 8.67246 18.7212 10.1531 19.1044C11.6338 19.4877 13.2069 19.2389 14.5136 18.4142C15.8204 17.5896 16.7368 16.262 17.0298 14.75M18.0111 12.09C18.3895 10.5729 18.1653 8.96665 17.3858 7.61635C16.6062 6.26605 15.3276 5.27878 13.847 4.89551C12.3663 4.51223 10.7932 4.76108 9.48646 5.58574C8.17968 6.4104 7.26324 7.73801 6.97024 9.25"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={togglePlay}
                        className="text-white rounded-full p-2"
                      >
                        {isPlaying ? (
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8 5V19M16 5V19"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6 4L18 12L6 20V4Z"
                              fill="white"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSkip(10)}
                        className="text-white rounded-full p-2"
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.5 8L14.5 11L11.5 14"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14 11H7.5"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M5.98898 11.91C5.61061 13.4271 5.83477 15.0334 6.61429 16.3837C7.39382 17.734 8.67246 18.7212 10.1531 19.1044C11.6338 19.4877 13.2069 19.2389 14.5136 18.4142C15.8204 17.5896 16.7368 16.262 17.0298 14.75M18.0111 12.09C18.3895 10.5729 18.1653 8.96665 17.3858 7.61635C16.6062 6.26605 15.3276 5.27878 13.847 4.89551C12.3663 4.51223 10.7932 4.76108 9.48646 5.58574C8.17968 6.4104 7.26324 7.73801 6.97024 9.25"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Button>
                    </div>

                    <div className="text-white text-xs">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleMute}
                        className="text-white rounded-full p-2"
                      >
                        {isMuted ? (
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11 5L6 9H2V15H6L11 19V5Z"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M22 9L16 15"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M16 9L22 15"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11 5L6 9H2V15H6L11 19V5Z"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M15.54 8.46C16.4774 9.39764 17.004 10.6692 17.004 11.995C17.004 13.3208 16.4774 14.5924 15.54 15.53"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M18.07 5.93C19.9447 7.80528 20.9979 10.3447 20.9979 13C20.9979 15.6553 19.9447 18.1947 18.07 20.07"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* DESKTOP CONTROLS - Standard UI with hover effect */}
          {!isMobile && controls && (
            <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <MobileAwareVideoControls
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
                isMobile={false}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
);

VideoPlayer.displayName = "VideoPlayer";
