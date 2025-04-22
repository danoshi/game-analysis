import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize2,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface MobileAwareVideoControlsProps {
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  volume: number;
  isMuted: boolean;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onSkip: (seconds: number) => void;
  onFullscreen: () => void;
  isMobile: boolean;
}

export function MobileAwareVideoControls({
  isPlaying,
  duration,
  currentTime,
  volume,
  isMuted,
  onPlayPause,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onSkip,
  onFullscreen,
  isMobile,
}: MobileAwareVideoControlsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={`
        absolute bottom-0 left-0 right-0 
        bg-gradient-to-t from-black/80 to-transparent 
        p-4 ${isMobile ? "pb-6" : "pb-4"}
      `}
    >
      <Slider
        value={[currentTime]}
        max={duration}
        step={1}
        onValueChange={([value]) => onSeek(value)}
        className={`mb-4 ${isMobile ? "h-2" : ""}`}
      />

      <div
        className={`
          flex items-center justify-between
          ${isMobile ? "flex-col gap-3" : ""}
        `}
      >
        <div
          className={`
            flex items-center gap-2
            ${isMobile ? "w-full justify-between" : ""}
          `}
        >
          <Button
            variant="ghost"
            size={isMobile ? "lg" : "icon"}
            onClick={() => onSkip(-10)}
            className="text-white"
          >
            <SkipBack className={isMobile ? "h-7 w-7" : "h-5 w-5"} />
          </Button>

          <Button
            variant="ghost"
            size={isMobile ? "lg" : "icon"}
            onClick={onPlayPause}
            className="text-white"
          >
            {isPlaying ? (
              <Pause className={isMobile ? "h-7 w-7" : "h-5 w-5"} />
            ) : (
              <Play className={isMobile ? "h-7 w-7" : "h-5 w-5"} />
            )}
          </Button>

          <Button
            variant="ghost"
            size={isMobile ? "lg" : "icon"}
            onClick={() => onSkip(10)}
            className="text-white"
          >
            <SkipForward className={isMobile ? "h-7 w-7" : "h-5 w-5"} />
          </Button>

          <span className="text-white text-sm">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        <div
          className={`
            flex items-center gap-2
            ${isMobile ? "w-full justify-between" : ""}
          `}
        >
          {!isMobile && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleMute}
                className="text-white"
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.1}
                onValueChange={([value]) => onVolumeChange(value)}
                className="w-24"
              />
            </div>
          )}

          <Button
            variant="ghost"
            size={isMobile ? "lg" : "icon"}
            onClick={onFullscreen}
            className="text-white"
          >
            <Maximize2 className={isMobile ? "h-7 w-7" : "h-5 w-5"} />
          </Button>

          {isMobile && (
            <Button
              variant="ghost"
              size="lg"
              onClick={onToggleMute}
              className="text-white"
            >
              {isMuted ? (
                <VolumeX className="h-7 w-7" />
              ) : (
                <Volume2 className="h-7 w-7" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
