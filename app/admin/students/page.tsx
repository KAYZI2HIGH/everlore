import { requireAdmin } from "@/lib/session";
import { listStudents } from "@/lib/admin";
import { formatMoney } from "@/lib/config";
import { AdminPageHeader, EmptyRow, td, th } from "@/components/admin/page-header";

export default async function StudentsPage() {
  await requireAdmin();
  const students = await listStudents();

  return (
    <>
      <AdminPageHeader title="Students" description={`${students.length} registered accounts`} />
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[640px]">
          <thead className="border-b border-border">
            <tr>
              <th className={th}>Name</th>
              <th className={th}>Joined</th>
              <th className={`${th} text-right`}>Courses</th>
              <th className={`${th} text-right`}>Spent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {students.map((s) => (
              <tr key={s.id}>
                <td className={td}>
                  <p className="font-medium">
                    {s.name}
                    {s.role === "admin" && (
                      <span className="ml-2 rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold uppercase text-gold">Admin</span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">{s.email}</p>
                </td>
                <td className={`${td} text-muted-foreground`}>{s.createdAt.toLocaleDateString("en-NG", { dateStyle: "medium" })}</td>
                <td className={`${td} text-right tabular-nums`}>{s.courses}</td>
                <td className={`${td} text-right tabular-nums`}>{formatMoney(s.spentKobo / 100)}</td>
              </tr>
            ))}
            {students.length === 0 && <EmptyRow colSpan={4}>No students yet.</EmptyRow>}
          </tbody>
        </table>
      </div>
    </>
  );
}
