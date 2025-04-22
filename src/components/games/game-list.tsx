import { Input } from "@/components/ui/input";
import { GameCard } from "./game-card";
import { useFilter } from "@/hooks/use-filter";
import type { Game } from "@/types/game";

interface GameListProps {
  games: Game[];
  onSelectGame: (game: Game) => void;
}

export function GameList({ games, onSelectGame }: GameListProps) {
  const filterGames = (game: Game, term: string) => {
    const searchTerm = term.toLowerCase();
    return (
      game.homeTeam.toLowerCase().includes(searchTerm) ||
      game.awayTeam.toLowerCase().includes(searchTerm) ||
      game.competition.toLowerCase().includes(searchTerm)
    );
  };

  const { filteredItems: filteredGames, setSearchTerm } = useFilter(
    games,
    filterGames
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          type="search"
          placeholder="Search games..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="grid gap-4">
        {filteredGames.map((game) => (
          <GameCard key={game.id} game={game} onClick={onSelectGame} />
        ))}
        {filteredGames.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No games found
          </div>
        )}
      </div>
    </div>
  );
}
