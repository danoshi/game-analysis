import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { TeamCardProps } from "@/types/team";

export const TeamCard: React.FC<TeamCardProps> = ({ team, onClick }) => {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition"
      onClick={() => onClick?.(team)}
    >
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold">{team.team}</h3>
        <p className="text-sm text-muted-foreground">{team.division}</p>
      </CardContent>
    </Card>
  );
};
