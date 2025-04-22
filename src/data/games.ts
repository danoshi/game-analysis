import { videos } from "./videos";
import { Game } from "../types";

export const games: Game[] = [
  {
    id: 1,
    homeTeam: "DSG Wolf Park Rangers",
    awayTeam: "DSG Vienna Internationals",
    date: "29.03.25",
    score: "2-5",
    competition: "League Match",
    tags: ["wolf park ranger"],
  },
  {
    id: 2,
    homeTeam: "DSG Sektion Westside",
    awayTeam: "DSG Vienna Internationals",
    date: " 25.11.24",
    score: "3-1",
    competition: "League Match",
    tags: ["sektion westside"],
  },
];

export function getVideosForGame(game: Game) {
  return videos.filter((v) => game.tags.includes(v.tag));
}
