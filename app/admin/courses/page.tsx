import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Plus } from "lucide-react";
import { requireAdmin } from "@/lib/session";
import { enrollmentCounts } from "@/lib/admin";
import { fetchCourses } from "@/lib/content";
import { categoryLabel, formatPrice } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { AdminPageHeader, EmptyRow, td, th } from "@/components/admin/page-header";

export default async function AdminCoursesPage() {
  await requireAdmin();
  const [courses, counts] = await Promise.all([fetchCourses(), enrollmentCounts()]);

  return (
    <>
      <AdminPageHeader
        title="Courses"
        description="Course content is edited in the content studio. Video uploads arrive in the next phase."
        actions={
          <Button asChild className="rounded-full">
            <a href="/studio/structure/course" target="_blank">
              <Plus /> New course
            </a>
          </Button>
        }
      />
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[720px]">
          <thead className="border-b border-border">
            <tr>
              <th className={th}>Course</th>
              <th className={th}>Category</th>
              <th className={`${th} text-right`}>Price</th>
              <th className={`${th} text-right`}>Students</th>
              <th className={th}><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {courses.map((c) => (
              <tr key={c._id}>
                <td className={td}>
                  <div className="flex items-center gap-3">
                    <div className="relative aspect-[16/10] w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image src={c.image} alt="" fill sizes="80px" className="object-cover" />
                    </div>
                    <Link href={`/academy/courses/${c.slug.current}`} className="font-medium hover:text-brand">
                      {c.title}
                    </Link>
                  </div>
                </td>
                <td className={`${td} text-muted-foreground`}>{categoryLabel(c.category)}</td>
                <td className={`${td} text-right tabular-nums`}>{formatPrice(c.price)}</td>
                <td className={`${td} text-right tabular-nums`}>{counts.get(c._id) ?? 0}</td>
                <td className={`${td} text-right`}>
                  <a
                    href={`/studio/structure/course;${c._id}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-sm text-brand hover:underline"
                  >
                    Edit <ExternalLink className="size-3.5" />
                  </a>
                </td>
              </tr>
            ))}
            {courses.length === 0 && <EmptyRow colSpan={5}>No courses yet. Create one in the studio.</EmptyRow>}
          </tbody>
        </table>
      </div>
    </>
  );
}
