import { requireAdmin } from "@/lib/session";
import { listPayments } from "@/lib/admin";
import { fetchCoursesByIds } from "@/lib/content";
import { formatMoney } from "@/lib/config";
import { AdminPageHeader, EmptyRow, td, th } from "@/components/admin/page-header";
import { cn } from "@/lib/utils";

const STATUS: Record<string, string> = {
  success: "bg-success/15 text-success",
  pending: "bg-gold/15 text-gold",
  failed: "bg-destructive/15 text-destructive",
};

export default async function PaymentsPage() {
  await requireAdmin();
  const payments = await listPayments();
  const courses = await fetchCoursesByIds([...new Set(payments.flatMap((p) => p.courseIds))]);
  const title = new Map(courses.map((c) => [c._id, c.title]));

  return (
    <>
      <AdminPageHeader
        title="Payments"
        description="Every Paystack checkout. Pending means the buyer opened checkout but hasn't completed it."
      />
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[760px]">
          <thead className="border-b border-border">
            <tr>
              <th className={th}>Customer</th>
              <th className={th}>Courses</th>
              <th className={th}>Status</th>
              <th className={th}>Date</th>
              <th className={`${th} text-right`}>Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {payments.map((p) => (
              <tr key={p.id}>
                <td className={td}>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.email}</p>
                </td>
                <td className={`${td} max-w-xs`}>
                  <p className="line-clamp-2">{p.courseIds.map((id) => title.get(id) ?? "Deleted course").join(", ")}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">{p.reference}</p>
                </td>
                <td className={td}>
                  <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold capitalize", STATUS[p.status])}>
                    {p.status}
                  </span>
                </td>
                <td className={`${td} text-muted-foreground`}>
                  {(p.paidAt ?? p.createdAt).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}
                </td>
                <td className={`${td} text-right font-semibold tabular-nums`}>{formatMoney(p.amount / 100, p.currency)}</td>
              </tr>
            ))}
            {payments.length === 0 && <EmptyRow colSpan={5}>No payments yet.</EmptyRow>}
          </tbody>
        </table>
      </div>
    </>
  );
}
