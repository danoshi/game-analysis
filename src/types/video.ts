export interface Video {
  id: number;
  title: string;
  description: string;
  url: string;
  tag: string;
  duration?: number;
  thumbnail?: string;
  createdAt?: string;
}

export interface VideoPlayerProps {
  url: string;
  onLoadStart?: () => void;
  onCanPlay?: () => void;
  onError?: () => void;
  controls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
}

export interface VideoControlsProps {
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
}
