import { useParams, useNavigate } from "react-router";
import { teams } from "@/data/team";
import { teamSections } from "@/data/team-sections";
import type { Team, TeamSection, SectionContent } from "@/types/team";
import { Button } from "@/components/ui/button";

export default function TeamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const teamId = Number(id);
  const team: Team | undefined = teams.find((t) => t.id === teamId);
  const sections: TeamSection[] = teamSections[teamId] || [];

  if (!team) {
    return <div>Team not found</div>;
  }

  const renderContent = (block: SectionContent, idx: number) => {
    switch (block.type) {
      case "heading":
        return (
          <h3 key={idx} className="text-lg font-semibold mt-4">
            {block.text}
          </h3>
        );
      case "paragraph":
        return (
          <p key={idx} className="mt-2 text-base leading-relaxed">
            {block.text}
          </p>
        );
      case "list":
        return (
          <ul key={idx} className="list-disc list-inside mt-2 space-y-1">
            {block.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
      case "image":
        return (
          // assuming a simple <img />; swap in your <Image /> if you like
          <img
            key={idx}
            src={block.src}
            alt={block.alt || ""}
            className="mt-4 rounded shadow"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-3xl p-4 pl-4 md:pl-8">
      <Button variant="outline" onClick={() => navigate(-1)}>
        ← Back to Teams
      </Button>

      <header className="border-b pb-4">
        <h1 className="text-2xl font-bold">{team.team}</h1>
        <p className="text-sm text-muted-foreground">
          Division: {team.division}
        </p>
      </header>

      {sections.map((section) => (
        <section key={section.id} className="pt-6">
          <h2 className="text-xl font-semibold">{section.title}</h2>
          {section.content.map(renderContent)}
        </section>
      ))}
    </div>
  );
}
