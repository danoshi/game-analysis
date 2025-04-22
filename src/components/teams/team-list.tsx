import React from "react";
import { TeamCard } from "./team-card";
import type { TeamListProps } from "@/types/team";

export const TeamList: React.FC<TeamListProps> = ({ teams, onSelectTeam }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} onClick={onSelectTeam} />
      ))}
    </div>
  );
};
