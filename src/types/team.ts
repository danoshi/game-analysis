export interface Team {
  id: number;
  team: string;
  division: string;
}

export interface TeamCardProps {
  team: Team;
  onClick?: (team: Team) => void;
}

export interface TeamListProps {
  teams: Team[];
  onSelectTeam: (team: Team) => void;
}

export type SectionContent =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "image"; src: string; alt?: string };

export interface TeamSection {
  id: string;
  title: string;
  content: SectionContent[];
}
