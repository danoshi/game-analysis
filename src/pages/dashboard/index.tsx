import { PageHeader } from "@/components/layouts/page-header";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Welcome back, Coach"
        description="Here's what's happening with your team this week."
      />
    </div>
  );
}
