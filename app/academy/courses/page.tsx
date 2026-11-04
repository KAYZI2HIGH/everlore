import { redirect } from "next/navigation";

// The catalog lives at /academy; keep old links working.
export default async function CoursesRedirect({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(await searchParams)) {
    if (typeof v === "string") sp.set(k, v);
  }
  redirect(`/academy${sp.size ? `?${sp}` : ""}`);
}
