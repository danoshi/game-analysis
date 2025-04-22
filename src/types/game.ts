export interface Game {
  id: number;
  homeTeam: string;
  awayTeam: string;
  date: string;
  score: string;
  competition: string;
  tags: string[];
}

export interface GameCardProps {
  game: Game;
  onClick?: (game: Game) => void;
}

export interface GameListProps {
  games: Game[];
  onSelectGame: (game: Game) => void;
}
