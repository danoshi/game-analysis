import { forwardRef, useImperativeHandle, useRef } from 'react';

interface VideoPlayerProps {
  url: string;
  onLoadStart?: () => void;
  onCanPlay?: () => void;
  onError?: () => void;
  controls?: boolean;
  className?: string;
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  ({ url, onLoadStart, onCanPlay, onError, controls = true, className = "" }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);


    useImperativeHandle(ref, () => {
      return videoRef.current!;
    });

    const handleLoadStart = () => {
      if (onLoadStart) onLoadStart();
    };

    const handleCanPlay = () => {
      if (onCanPlay) onCanPlay();
    };

    const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
      console.error('Video error:', e.currentTarget.error);
      if (onError) onError();
    };

    return (
      <div className={`w-full aspect-video bg-black rounded-lg overflow-hidden ${className}`}>
        <video
          ref={videoRef}
          src={url}
          controls={controls}
          playsInline
          preload="metadata"
          className="w-full h-full object-contain"
          onLoadStart={handleLoadStart}
          onCanPlay={handleCanPlay}
          onError={handleError}
        >
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';