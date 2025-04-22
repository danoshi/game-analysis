import { useState, useEffect, RefObject } from "react";

export function useVideoPlayer(videoRef: RefObject<HTMLVideoElement>) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Guard against null ref
    if (!videoRef.current) return;

    const videoElement = videoRef.current;

    // Set initial duration when metadata is loaded
    const handleLoadedMetadata = () => {
      setDuration(videoElement.duration);
    };

    // Set duration if already available
    if (videoElement.duration) {
      setDuration(videoElement.duration);
    }

    // Add event listener for metadata loading
    videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      videoElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [videoRef]);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {
        // Handle play() promise rejection (often due to autoplay policies)
        console.log("Playback couldn't start automatically");
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleSeek = (time: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (value: number) => {
    if (!videoRef.current) return;
    videoRef.current.volume = value;
    setVolume(value);
    setIsMuted(value === 0);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSkip = (seconds: number) => {
    if (!videoRef.current) return;
    const newTime = currentTime + seconds;
    handleSeek(Math.max(0, Math.min(newTime, duration)));
  };

  return {
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
  };
}
