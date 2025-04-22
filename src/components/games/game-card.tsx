import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Trophy } from "lucide-react";
import { Game } from "@/types/game";
import { getVideosForGame } from "@/data/games";

interface GameCardProps {
  game: Game;
  onClick?: (game: Game) => void;
}

export function GameCard({ game, onClick }: GameCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow bg-card"
      onClick={() => onClick?.(game)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              {game.competition}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{game.date}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="font-medium text-foreground">{game.homeTeam}</p>
          </div>
          <div className="px-4 py-2 bg-muted rounded-md font-medium text-foreground">
            {game.score}
          </div>
          <div className="flex-1 text-right">
            <p className="font-medium text-foreground">{game.awayTeam}</p>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
          <span>{getVideosForGame(game).length} videos</span>
        </div>
      </CardContent>
    </Card>
  );
}
