import { PageHeader } from "@/components/layouts/page-header";
import { GameList } from "@/components/games";
import { games } from "@/data/games";
import type { Game } from "@/types/game";
import { useNavigate } from "react-router";

export default function GamesPage() {
  const navigate = useNavigate();

  const handleGameSelect = (game: Game) => {
    navigate(`/videos/${game.id}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Games"
        description="Manage and analyze your team's matches"
      />

      <GameList games={games} onSelectGame={handleGameSelect} />
    </div>
  );
}
