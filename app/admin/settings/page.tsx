import { requireAdmin } from "@/lib/session";
import { getHomeStatsConfig } from "@/lib/site-settings";
import { AdminPageHeader } from "@/components/admin/page-header";
import { StatsForm } from "@/components/admin/stats-form";

export const metadata = { title: "Site settings" };

export default async function SettingsPage() {
  await requireAdmin();
  const stats = await getHomeStatsConfig();
  return (
    <>
      <AdminPageHeader title="Site settings" description="Numbers and copy shown on the public website." />
      <StatsForm initial={stats} />
    </>
  );
}
