import Link from "next/link";
import { ArrowUpRight, BookOpen, CreditCard, Inbox, Users } from "lucide-react";
import { requireAdmin } from "@/lib/session";
import { adminStats, listPayments, listStudents, revenueByDay } from "@/lib/admin";
import { formatMoney } from "@/lib/config";
import { AdminPageHeader } from "@/components/admin/page-header";
import { RevenueChart } from "@/components/admin/revenue-chart";

export default async function AdminOverview() {
  const me = await requireAdmin();
  const [stats, revenue, students, payments] = await Promise.all([
    adminStats(),
    revenueByDay(30),
    listStudents(6),
    listPayments(6),
  ]);

  const tiles = [
    { label: "Students", value: stats.students.toLocaleString(), sub: `+${stats.newStudents30d} in 30 days`, icon: Users, href: "/admin/students" },
    { label: "Enrollments", value: stats.enrollments.toLocaleString(), sub: "All time", icon: BookOpen, href: "/admin/courses" },
    { label: "Revenue", value: formatMoney(stats.revenueKobo / 100), sub: `${formatMoney(stats.revenue30dKobo / 100)} in 30 days`, icon: CreditCard, href: "/admin/payments" },
    { label: "Open messages", value: stats.openMessages.toLocaleString(), sub: "From the contact form", icon: Inbox, href: "/admin/messages" },
  ];

  return (
    <>
      <AdminPageHeader title={`Welcome back, ${me.name.split(" ")[0]}`} description="Here's how Everlore is doing." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map(({ icon: Icon, ...t }) => (
          <Link key={t.label} href={t.href} className="group rounded-2xl border border-border bg-card p-5 transition hover:border-brand/40">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Icon className="size-4" /> {t.label}
              </span>
              <ArrowUpRight className="size-4 opacity-0 transition group-hover:opacity-100" />
            </div>
            <p className="mt-3 text-3xl font-extrabold tabular-nums tracking-tight">{t.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t.sub}</p>
          </Link>
        ))}
      </div>

      <section className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-bold">Revenue · last 30 days</h2>
        <div className="mt-6">
          <RevenueChart data={revenue} />
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card">
          <header className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="font-bold">Newest students</h2>
            <Link href="/admin/students" className="text-sm text-brand hover:underline">View all</Link>
          </header>
          <ul className="divide-y divide-border">
            {students.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3 px-6 py-3.5 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium">{s.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{s.email}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {s.createdAt.toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                </span>
              </li>
            ))}
            {students.length === 0 && <li className="px-6 py-10 text-center text-sm text-muted-foreground">No students yet.</li>}
          </ul>
        </section>
        <section className="rounded-2xl border border-border bg-card">
          <header className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="font-bold">Recent payments</h2>
            <Link href="/admin/payments" className="text-sm text-brand hover:underline">View all</Link>
          </header>
          <ul className="divide-y divide-border">
            {payments.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 px-6 py-3.5 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium">{p.name}</p>
                  <p className="truncate text-xs capitalize text-muted-foreground">{p.status}</p>
                </div>
                <span className="shrink-0 font-semibold tabular-nums">{formatMoney(p.amount / 100, p.currency)}</span>
              </li>
            ))}
            {payments.length === 0 && <li className="px-6 py-10 text-center text-sm text-muted-foreground">No payments yet.</li>}
          </ul>
        </section>
      </div>
    </>
  );
}
