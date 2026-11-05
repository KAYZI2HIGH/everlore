import { redirect } from "next/navigation";

// Legacy URL — the careers section now lives at /careers.
export default function HiringPage() {
  redirect("/careers");
}
