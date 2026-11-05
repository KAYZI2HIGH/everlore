"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { updateHomeStats } from "@/lib/actions/admin.actions";
import type { HomeStat, StatSource } from "@/lib/site-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SOURCES: { value: StatSource; label: string }[] = [
  { value: "manual", label: "Number I type" },
  { value: "students", label: "Live: registered students" },
  { value: "enrollments", label: "Live: course enrollments" },
];

export function StatsForm({ initial }: { initial: HomeStat[] }) {
  const [stats, setStats] = useState(initial);
  const [pending, start] = useTransition();

  const set = (i: number, patch: Partial<HomeStat>) =>
    setStats((all) => all.map((s, j) => (j === i ? { ...s, ...patch } : s)));

  const save = () =>
    start(async () => {
      const res = await updateHomeStats(stats);
      if ("error" in res) toast.error(res.error);
      else toast.success("Stats saved — the website is updated.");
    });

  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <h2 className="text-lg font-bold">Homepage stats</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Shown in the About section on the homepage and /about. They count up when visitors scroll to them. Choose a
        live source to use real numbers from your database.
      </p>

      <div className="mt-6 space-y-4">
        {stats.map((s, i) => (
          <div key={i} className="grid gap-3 rounded-2xl border border-border p-4 sm:grid-cols-[1.4fr_1.4fr_0.6fr_1fr_0.6fr_auto] sm:items-end">
            <Field label="Label">
              <Input value={s.label} onChange={(e) => set(i, { label: e.target.value })} />
            </Field>
            <Field label="Source">
              <select
                value={s.source}
                onChange={(e) => set(i, { source: e.target.value as StatSource })}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
              >
                {SOURCES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Before">
              <Input value={s.prefix} maxLength={4} placeholder="₦" onChange={(e) => set(i, { prefix: e.target.value })} />
            </Field>
            <Field label="Number">
              <Input
                type="number"
                min={0}
                value={s.value}
                disabled={s.source !== "manual"}
                onChange={(e) => set(i, { value: Number(e.target.value) })}
              />
            </Field>
            <Field label="After">
              <Input value={s.suffix} maxLength={4} placeholder="+" onChange={(e) => set(i, { suffix: e.target.value })} />
            </Field>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Remove ${s.label}`}
              disabled={stats.length <= 1}
              onClick={() => setStats((all) => all.filter((_, j) => j !== i))}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={stats.length >= 4}
          onClick={() => setStats((all) => [...all, { label: "", value: 0, prefix: "", suffix: "+", source: "manual" }])}
        >
          <Plus className="size-4" /> Add stat
        </Button>
        <Button type="button" onClick={save} disabled={pending}>
          {pending ? "Saving…" : "Save stats"}
        </Button>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
