// components/VideoPlayer.tsx
import React, {
  forwardRef,
  useRef,
  useImperativeHandle,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Play, Loader2, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVideoPlayer } from "@/hooks/use-video-player";
// Assuming you want to keep using the simpler VideoControls for now
// If you intended to use MobileAwareVideoControls, replace this import
import { VideoControls } from "./video-controls"; // Or potentially MobileAwareVideoControls

//
// Extend <video> for iOS fullscreen API
//
interface HTMLVideoElementWithWebKit extends HTMLVideoElement {
  webkitEnterFullscreen?: () => void;
  webkitSupportsFullscreen?: boolean; // Check support
  webkitDisplayingFullscreen?: boolean; // Check current state
}

interface FullscreenDocument extends Document {
  webkitFullscreenElement?: Element;
  webkitExitFullscreen?: () => void;
  mozFullScreenElement?: Element; // Firefox
  msFullscreenElement?: Element; // IE/Edge
  mozCancelFullScreen?: () => void;
  msExitFullscreen?: () => void;
}

interface FullscreenElement extends HTMLDivElement {
  webkitRequestFullscreen?: () => void;
  mozRequestFullScreen?: () => void;
  msRequestFullscreen?: () => void;
}

interface VideoPlayerProps {
  url: string;
  onLoadStart?: () => void;
  onCanPlay?: () => void;
  onError?: () => void;
  controls?: boolean;
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  ({ url, onLoadStart, onCanPlay, onError, controls = true }, ref) => {
    const videoRef = useRef<HTMLVideoElementWithWebKit>(null);
    const containerRef = useRef<FullscreenElement>(null);

    // playback state
    const [isLoading, setIsLoading] = useState(true);
    const [showPlayButton, setShowPlayButton] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isIos, setIsIos] = useState(false);
    // Track if controls should be visible (e.g., for auto-hide later)
    const [showControls] = useState(true);

    // hook wants RefObject<HTMLVideoElement>
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
    } = useVideoPlayer(videoRef as React.RefObject<HTMLVideoElement>);

    // expose video element
    useImperativeHandle(ref, () => videoRef.current!);

    // detect mobile & iOS
    useEffect(() => {
      const ua = navigator.userAgent;
      const ios = /iPad|iPhone|iPod/.test(ua);
      setIsIos(ios);

      const updateMobile = () => {
        // Consider touch capability and screen size for mobile detection
        const mobile =
          window.innerWidth < 768 || // Adjust breakpoint as needed
          /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
          ("ontouchstart" in window && navigator.maxTouchPoints > 0);
        setIsMobile(mobile);
      };
      updateMobile();
      window.addEventListener("resize", updateMobile);
      window.addEventListener("orientationchange", updateMobile);
      return () => {
        window.removeEventListener("resize", updateMobile);
        window.removeEventListener("orientationchange", updateMobile);
      };
    }, []);

    // listen for standard fullscreenchange + vendor prefixes on DOCUMENT
    useEffect(() => {
      const onFsChange = () => {
        const doc = document as FullscreenDocument;
        const fsElement =
          doc.fullscreenElement ||
          doc.webkitFullscreenElement ||
          doc.mozFullScreenElement ||
          doc.msFullscreenElement ||
          null;
        // Update state based on whether *any* element is fullscreen in the document
        // This is generally more reliable for standard fullscreen API
        setIsFullscreen(!!fsElement);
      };
      const evts = [
        "fullscreenchange",
        "webkitfullscreenchange",
        "mozfullscreenchange",
        "MSFullscreenChange",
      ];
      evts.forEach((e) => document.addEventListener(e, onFsChange));
      return () => {
        evts.forEach((e) => document.removeEventListener(e, onFsChange));
      };
    }, []);

    // listen for iOS‐only begin/end fullscreen on the <video> itself
    // This is needed because iOS often handles video fullscreen differently
    useEffect(() => {
      const videoEl = videoRef.current;
      if (!videoEl || !isIos) return; // Only attach if iOS

      const onBegin = () => setIsFullscreen(true);
      const onEnd = () => setIsFullscreen(false);

      // Check if these events are supported before adding listeners
      if ("webkitbeginfullscreen" in videoEl) {
        videoEl.addEventListener("webkitbeginfullscreen", onBegin);
      }
      if ("webkitendfullscreen" in videoEl) {
        videoEl.addEventListener("webkitendfullscreen", onEnd);
      }

      // Fallback check using property if events aren't reliable
      const intervalCheck = setInterval(() => {
        if (videoEl.webkitDisplayingFullscreen !== undefined) {
          setIsFullscreen(videoEl.webkitDisplayingFullscreen);
        }
      }, 500); // Check periodically

      return () => {
        if ("webkitbeginfullscreen" in videoEl) {
          videoEl.removeEventListener("webkitbeginfullscreen", onBegin);
        }
        if ("webkitendfullscreen" in videoEl) {
          videoEl.removeEventListener("webkitendfullscreen", onEnd);
        }
        clearInterval(intervalCheck);
      };
    }, [isIos]); // Re-run if isIos changes (though unlikely)

    // record interaction (for any future auto‑hide logic)
    const recordInteraction = () => {
      // Placeholder for potential auto-hide logic for controls
      // console.log('Interaction recorded');
      // setShowControls(true);
      // // Set a timer to hide controls again after a delay
      // if (hideControlsTimeout.current) clearTimeout(hideControlsTimeout.current);
      // hideControlsTimeout.current = setTimeout(() => setShowControls(false), 3000);
    };
    // const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);

    // unified fullscreen toggle
    const handleFullscreen = useCallback(
      (e?: React.MouseEvent<HTMLButtonElement>) => {
        e?.stopPropagation(); // Prevent triggering other clicks like play/pause
        const doc = document as FullscreenDocument;
        const container = containerRef.current;
        const videoEl = videoRef.current;

        if (!container || !videoEl) return;

        // Use the isFullscreen state derived from events as the source of truth
        const currentlyFullscreen = isFullscreen;

        try {
          if (!currentlyFullscreen) {
            // --- ENTER FULLSCREEN ---
            if (
              isIos &&
              videoEl.webkitSupportsFullscreen &&
              videoEl.webkitEnterFullscreen
            ) {
              // Use iOS specific video fullscreen
              videoEl.webkitEnterFullscreen();
            } else if (container.requestFullscreen) {
              container.requestFullscreen();
            } else if (container.webkitRequestFullscreen) {
              // Safari
              container.webkitRequestFullscreen();
            } else if (container.mozRequestFullScreen) {
              // Firefox
              container.mozRequestFullScreen();
            } else if (container.msRequestFullscreen) {
              // IE/Edge
              container.msRequestFullscreen();
            }
          } else {
            // --- EXIT FULLSCREEN ---
            if (doc.exitFullscreen) {
              doc.exitFullscreen();
            } else if (doc.webkitExitFullscreen) {
              // Safari, Chrome, Edge
              doc.webkitExitFullscreen();
            } else if (doc.mozCancelFullScreen) {
              // Firefox
              doc.mozCancelFullScreen();
            } else if (doc.msExitFullscreen) {
              // IE/Edge
              doc.msExitFullscreen();
            }
          }
        } catch (err) {
          console.error("Fullscreen API error:", err);
        }

        recordInteraction();
      },
      [isFullscreen, isIos] // Dependencies for the callback
    );

    // loading / playback handlers
    const handleStart = () => {
      setIsLoading(true);
      onLoadStart?.();
    };
    const handleLoaded = () => {
      setIsLoading(false);
      onCanPlay?.();
    };
    const onPause = () => {
      setShowPlayButton(true);
      recordInteraction(); // Show controls on pause
    };
    const onPlay = () => {
      setShowPlayButton(false);
      recordInteraction(); // Show controls briefly on play
    };

    // Handle clicks on the video container itself
    const handleContainerClick = () => {
      if (isMobile) {
        // On mobile, tap toggles play/pause
        togglePlay();
      } else {
        // On desktop, tap could toggle controls visibility or play/pause
        togglePlay(); // Simple toggle for now
      }
      recordInteraction();
    };

    return (
      <div className="w-full">
        {/* Container handles fullscreen requests (except iOS video) */}
        <div
          ref={containerRef}
          className={
            "relative w-full mx-auto overflow-hidden bg-black " +
            // Use `fixed` positioning ONLY when fullscreen AND NOT iOS video fullscreen
            // because iOS video fullscreen handles its own layering.
            // Standard fullscreen API needs the container pinned.
            (isFullscreen &&
            !(isIos && videoRef.current?.webkitDisplayingFullscreen)
              ? "fixed inset-0 z-[999]"
              : "group") // `group` enables hover effects for controls
          }
          onClick={handleContainerClick} // Handle clicks on the container
        >
          <video
            ref={videoRef}
            src={url}
            className="block w-full h-full object-contain" // Use `block` to prevent extra space below
            onLoadStart={handleStart}
            onCanPlay={handleLoaded}
            onError={onError}
            onTimeUpdate={handleTimeUpdate}
            onPause={onPause}
            onPlay={onPlay}
            preload="metadata"
            playsInline // Essential for inline playback on iOS
            controls={false} // Disable native controls
            // Add crossOrigin if loading captions from different origin
            // crossOrigin="anonymous"
          />

          {/* --- Overlays --- */}

          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10 pointer-events-none">
              <Loader2 className="h-12 w-12 animate-spin text-white" />
            </div>
          )}

          {/* Desktop "Big Play" Button */}
          {!isLoading && showPlayButton && !isPlaying && !isMobile && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-black/30 z-10 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation(); // Prevent container click
                togglePlay();
                recordInteraction();
              }}
            >
              <div className="bg-white/10 rounded-full p-4 backdrop-blur-sm hover:bg-white/20 transition">
                <Play className="h-10 w-10 text-white fill-white" />
              </div>
            </div>
          )}

          {/* --- Persistent Top-Right Fullscreen Toggle --- */}
          {controls && ( // Only show if controls are enabled
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFullscreen} // Always use the unified handler
              className={
                "absolute top-2 right-2 z-20 text-white bg-black/30 rounded-full hover:bg-black/50 transition-opacity " +
                // Use fixed positioning if the *container* is fullscreen
                // This ensures it stays top-right even if the video element itself isn't the fullscreen root
                (isFullscreen &&
                !(isIos && videoRef.current?.webkitDisplayingFullscreen)
                  ? "fixed"
                  : "absolute")
                // Consider adding opacity transition based on showControls state if implementing auto-hide
                // + (showControls ? "opacity-100" : "opacity-0")
              }
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="h-5 w-5 sm:h-6 sm:w-6" /> // Slightly larger on bigger screens
              ) : (
                <Maximize2 className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </Button>
          )}

          {/* --- Bottom Controls Bar --- */}
          {/*
            Conditionally render or style the controls container.
            Using `group-hover` for desktop, potentially always visible on mobile,
            or implementing tap-to-show/auto-hide logic via `showControls` state.
            For simplicity now, stick to group-hover + always visible if mobile?
            Or just group-hover for now.
          */}
          {controls && (
            <div
              className={
                "absolute bottom-0 left-0 right-0 z-10 transition-opacity duration-300 pointer-events-none " +
                // Show on group hover (desktop), or always if mobile? Or use showControls state?
                // Let's start with group-hover and always if mobile for simplicity
                (isMobile
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100") +
                // Ensure controls inside are clickable when visible
                (showControls || isMobile ? " pointer-events-auto" : "")
              }
              // Prevent clicks on the controls bar propagating to the container (play/pause)
              onClick={(e) => e.stopPropagation()}
            >
              {/*
                Choose which controls component to use.
                If MobileAwareVideoControls is desired, import and use it here,
                passing the isMobile prop.
              */}
              <VideoControls
                isPlaying={isPlaying}
                duration={duration}
                currentTime={currentTime}
                volume={volume}
                isMuted={isMuted}
                onPlayPause={() => {
                  togglePlay();
                  recordInteraction();
                }}
                onSeek={(t) => {
                  handleSeek(t);
                  recordInteraction();
                }}
                onVolumeChange={(v) => {
                  handleVolumeChange(v);
                  recordInteraction();
                }}
                onToggleMute={() => {
                  toggleMute();
                  recordInteraction();
                }}
                onSkip={(s) => {
                  handleSkip(s);
                  recordInteraction();
                }}
                // Pass down fullscreen handler if the controls need it
                // onFullscreen={handleFullscreen}
                // Pass down isMobile if using MobileAwareVideoControls
                // isMobile={isMobile}
              />
            </div>
          )}

          {/* Minimal Mobile Fullscreen Overlay (Optional - consider if needed) */}
          {/* This might be redundant if controls are handled well */}
          {/* {isMobile && isFullscreen && (
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="text-white bg-black/30 rounded-full p-3 pointer-events-auto"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
            </div>
          )} */}
        </div>
      </div>
    );
  }
);

VideoPlayer.displayName = "VideoPlayer";
