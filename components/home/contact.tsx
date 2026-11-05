"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContactMessage } from "@/lib/actions/contact.actions";
import { site } from "@/lib/config";
import { cn } from "@/lib/utils";

const INTERESTS = [
  "Academy course",
  "Digital services",
  "Multimedia & publishing",
  "1:1 mentorship",
  "Partnership",
  "Speaking",
  "Support",
  "Other",
];

export function Contact() {
  const [interest, setInterest] = useState<string>("");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setPending(true);
    const res = await submitContactMessage({
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      message: String(fd.get("message") ?? ""),
      company: String(fd.get("company") ?? ""),
      interest,
    });
    setPending(false);
    if (!res.success) return toast.error(res.error);
    setSent(true);
  };

  return (
    <section id="contact" className="scroll-mt-20 pb-24 lg:pb-32">
      <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-ink">Get in touch</p>
          <h2 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">
            Tell us what you <span className="text-gold-ink">want to build.</span>
          </h2>
          <p className="mt-5 max-w-md text-lg text-muted-foreground">
            Questions about a course, a project or a partnership? Send a message and our team will
            reply within one business day.
          </p>
          <ul className="mt-10 space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-secondary text-primary dark:text-brand">
                <Mail className="size-4" />
              </span>
              <a href={`mailto:${site.email}`} className="font-medium hover:text-brand">
                {site.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-secondary text-primary dark:text-brand">
                <MapPin className="size-4" />
              </span>
              <span className="font-medium">Nigeria · serving learners worldwide</span>
            </li>
          </ul>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 sm:p-10">
          {sent ? (
            <div className="flex min-h-80 flex-col items-center justify-center text-center">
              <CheckCircle2 className="size-12 text-success" />
              <h3 className="mt-5 text-2xl font-bold">Message received</h3>
              <p className="mt-2 max-w-sm text-muted-foreground">
                Thanks for reaching out — we&apos;ll get back to you shortly.
              </p>
              <Button variant="outline" className="mt-6 rounded-full" onClick={() => setSent(false)}>
                Send another
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="c-name">Your name</Label>
                  <Input id="c-name" name="name" required minLength={2} autoComplete="name" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="c-email">Email</Label>
                  <Input id="c-email" name="email" type="email" required autoComplete="email" className="h-11" />
                </div>
              </div>
              <fieldset className="space-y-2.5">
                <legend className="text-sm font-medium">What are you interested in?</legend>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map((i) => (
                    <button
                      type="button"
                      key={i}
                      aria-pressed={interest === i}
                      onClick={() => setInterest(interest === i ? "" : i)}
                      className={cn(
                        "rounded-full border px-3.5 py-1.5 text-sm transition",
                        interest === i
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:border-foreground/30",
                      )}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="space-y-2">
                <Label htmlFor="c-message">Message</Label>
                <Textarea id="c-message" name="message" required minLength={10} rows={5} />
              </div>
              <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
              <Button type="submit" size="lg" disabled={pending} className="h-12 w-full rounded-full text-base">
                {pending && <Loader2 className="animate-spin" />} Send message
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
