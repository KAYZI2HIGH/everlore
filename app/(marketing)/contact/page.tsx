import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Contact } from "@/components/home/contact";
import { site } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Everlore about courses, payments, digital services, publishing or partnerships. We reply within one business day.",
};

export default function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-ink text-white">
        <div aria-hidden className="absolute -right-24 -top-24 size-96 rounded-full bg-brand/40 blur-3xl" />
        <div aria-hidden className="absolute -bottom-40 left-1/3 size-96 rounded-full bg-gold/20 blur-3xl" />
        <div className="container-page relative py-16 sm:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Contact</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight sm:text-6xl">
            Let&apos;s talk about <span className="text-gold">your next step.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/70">
            Questions about a course, a payment or a project? Our team is here to help.
          </p>
        </div>
      </section>

      <div className="pt-20 lg:pt-24">
        <Contact />
      </div>

      <section className="border-t border-border bg-muted/50 py-24 lg:py-32">
        <div className="container-page max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-ink">FAQ</p>
          <h2 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">
            Common <span className="text-gold-ink">questions.</span>
          </h2>
          <div className="mt-12 space-y-3">
            <Faq question="How do the courses work?">
              Courses are self-paced video lessons you can access from any device once you enrol,
              with lifetime access to the material. Many courses also include live classes and
              mentorship. Browse the <Link href="/academy" className="font-medium text-brand underline-offset-4 hover:underline">academy</Link> to
              see what each course covers.
            </Faq>
            <Faq question="How do I pay?">
              Payments are processed securely by Paystack in Nigerian Naira (NGN). You can pay by
              card, bank transfer or other methods Paystack supports. We never see or store your
              card details.
            </Faq>
            {/* TODO(owner): confirm refund policy */}
            <Faq question="Can I get a refund?">
              If something isn&apos;t right with your purchase, contact us within 7 days at{" "}
              <a href={`mailto:${site.email}`} className="font-medium text-brand underline-offset-4 hover:underline">
                {site.email}
              </a>{" "}
              and we&apos;ll review your request. See our{" "}
              <Link href="/terms" className="font-medium text-brand underline-offset-4 hover:underline">terms</Link> for details.
            </Faq>
            <Faq question="Do you work with businesses?">
              Yes. We offer done-for-you digital services, book publishing and video production, and
              we welcome partnership and speaking enquiries. Use the form above and choose the topic
              that fits, or email{" "}
              <a href={`mailto:${site.email}`} className="font-medium text-brand underline-offset-4 hover:underline">
                {site.email}
              </a>
              .
            </Faq>
          </div>
        </div>
      </section>
    </>
  );
}

function Faq({ question, children }: { question: string; children: React.ReactNode }) {
  return (
    <details className="group rounded-3xl border border-border bg-card px-6 py-5 open:shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
        {question}
        <ChevronDown className="size-5 shrink-0 text-muted-foreground transition group-open:rotate-180" />
      </summary>
      <p className="mt-3 leading-relaxed text-muted-foreground">{children}</p>
    </details>
  );
}
