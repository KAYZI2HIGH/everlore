import "server-only";
import { count, desc, eq, sql, sum } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { contactMessages, enrollments, payments, users } from "@/lib/db/schema";

// Read models for the admin dashboard. Callers must have run requireAdmin().

export async function adminStats() {
  const db = await getDb();
  const since = sql`now() - interval '30 days'`;
  const [[students], [newStudents], [enrolls], [revenue], [revenue30], [inbox]] = await Promise.all([
    db.select({ n: count() }).from(users),
    db.select({ n: count() }).from(users).where(sql`${users.createdAt} > ${since}`),
    db.select({ n: count() }).from(enrollments),
    db.select({ n: sum(payments.amount) }).from(payments).where(eq(payments.status, "success")),
    db
      .select({ n: sum(payments.amount) })
      .from(payments)
      .where(sql`${payments.status} = 'success' and ${payments.paidAt} > ${since}`),
    db.select({ n: count() }).from(contactMessages).where(sql`${contactMessages.handledAt} is null`),
  ]);
  return {
    students: students.n,
    newStudents30d: newStudents.n,
    enrollments: enrolls.n,
    revenueKobo: Number(revenue.n ?? 0),
    revenue30dKobo: Number(revenue30.n ?? 0),
    openMessages: inbox.n,
  };
}

export async function revenueByDay(days = 30) {
  const db = await getDb();
  const rows = await db.execute<{ day: string; amount: string }>(sql`
    select to_char(d::date, 'YYYY-MM-DD') as day,
           coalesce(sum(p.amount), 0)::text as amount
    from generate_series(current_date - ${days - 1}::int, current_date, interval '1 day') d
    left join payments p
      on p.status = 'success' and p.paid_at::date = d::date
    group by d order by d`);
  return (rows.rows ?? (rows as unknown as { day: string; amount: string }[])).map((r) => ({
    day: r.day,
    amount: Number(r.amount) / 100,
  }));
}

export async function listStudents(limit = 200) {
  const db = await getDb();
  return db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      image: users.image,
      role: users.role,
      createdAt: users.createdAt,
      courses: sql<number>`(select count(*)::int from ${enrollments} e where e.user_id = ${users.id})`,
      spentKobo: sql<number>`(select coalesce(sum(p.amount),0)::int from ${payments} p where p.user_id = ${users.id} and p.status = 'success')`,
    })
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(limit);
}

export async function listPayments(limit = 200) {
  const db = await getDb();
  return db
    .select({
      id: payments.id,
      reference: payments.reference,
      amount: payments.amount,
      currency: payments.currency,
      status: payments.status,
      courseIds: payments.courseIds,
      createdAt: payments.createdAt,
      paidAt: payments.paidAt,
      name: users.name,
      email: users.email,
    })
    .from(payments)
    .innerJoin(users, eq(users.id, payments.userId))
    .orderBy(desc(payments.createdAt))
    .limit(limit);
}

export async function enrollmentCounts() {
  const db = await getDb();
  const rows = await db
    .select({ courseId: enrollments.courseId, n: count() })
    .from(enrollments)
    .groupBy(enrollments.courseId);
  return new Map(rows.map((r) => [r.courseId, r.n]));
}

export async function listMessages(limit = 200) {
  const db = await getDb();
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt)).limit(limit);
}
