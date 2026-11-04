import { Mail } from "lucide-react";
import { requireAdmin } from "@/lib/session";
import { listMessages } from "@/lib/admin";
import { setMessageHandled } from "@/lib/actions/admin.actions";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/page-header";
import { cn } from "@/lib/utils";

export default async function MessagesPage() {
  await requireAdmin();
  const messages = await listMessages();
  const open = messages.filter((m) => !m.handledAt).length;

  return (
    <>
      <AdminPageHeader title="Messages" description={`${open} open · from the website contact form`} />
      <div className="space-y-3">
        {messages.map((m) => (
          <article
            key={m.id}
            className={cn("rounded-2xl border border-border bg-card p-5", m.handledAt && "opacity-60")}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">
                  {m.name}
                  {m.interest && (
                    <span className="ml-2 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">{m.interest}</span>
                  )}
                </p>
                <p className="text-sm text-muted-foreground">
                  {m.email} · {m.createdAt.toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}
                </p>
              </div>
              <div className="flex gap-2">
                <Button asChild size="sm" variant="outline" className="rounded-full">
                  <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message to Everlore")}`}>
                    <Mail /> Reply
                  </a>
                </Button>
                <form action={setMessageHandled.bind(null, m.id, !m.handledAt)}>
                  <Button size="sm" variant={m.handledAt ? "ghost" : "secondary"} className="rounded-full">
                    {m.handledAt ? "Reopen" : "Mark done"}
                  </Button>
                </form>
              </div>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed">{m.message}</p>
          </article>
        ))}
        {messages.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
            No messages yet.
          </p>
        )}
      </div>
    </>
  );
}
