import { FC } from "react";
import VideoGrid from "./components/video-grid";
import SearchBar from "./components/search-bar";
import { useVideoFilter } from "./hooks/use-video-filter";
import { videos } from "./data/videos";
import { ModeToggle } from "./components/theme/mode-toggle";

const App: FC = () => {
  const { setSearchTerm, filteredVideos } = useVideoFilter(videos);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold">Video Analysis</h1>
          <ModeToggle />
        </div>
        <div className="container pb-4">
          <SearchBar onSearch={setSearchTerm} />
        </div>
      </header>

      <main className="container py-8">
        <VideoGrid videos={filteredVideos} />
      </main>
    </div>
  );
};

export default App;
