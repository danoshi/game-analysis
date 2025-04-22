import { useNavigate } from "react-router";
import { PageHeader } from "@/components/layouts/page-header";
import { TeamList } from "@/components/teams/team-list";
import { teams } from "@/data/team";
import type { Team } from "@/types/team";

export default function TeamsPage() {
  const navigate = useNavigate();

  const handleTeamSelect = (team: Team) => {
    // e.g. navigate to a detail page, or filter games by team…
    navigate(`/teams/${team.id}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Teams" description="Browse and manage your teams" />
      <TeamList teams={teams} onSelectTeam={handleTeamSelect} />
    </div>
  );
}
