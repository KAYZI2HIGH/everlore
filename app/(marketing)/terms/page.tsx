import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { site } from "@/lib/config";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern your use of the Everlore website and Everlore Academy courses, including payments, refunds, course licences and our earnings disclaimer.",
};

const LAST_UPDATED = "5 November 2026";

export default function TermsPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-ink text-white">
        <div aria-hidden className="absolute -right-24 -top-24 size-96 rounded-full bg-brand/40 blur-3xl" />
        <div className="container-page relative py-14 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Legal</p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">Terms of Service</h1>
          <p className="mt-4 text-white/70">Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      <article className="container-page max-w-3xl py-16 lg:py-20">
        <div
          role="note"
          className="mb-12 flex gap-3 rounded-2xl border border-gold/40 bg-gold/10 p-5 text-sm leading-relaxed"
        >
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-gold-ink" />
          <p>
            <strong>This is a template — have it reviewed by a lawyer.</strong> It is general
            information, not legal advice, and must be checked before it is relied on.
          </p>
        </div>

        <div className="space-y-10 text-base leading-7 text-muted-foreground [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-foreground [&_li]:pl-1 [&_p+p]:mt-4 [&_strong]:text-foreground [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
          <Section title="1. About these terms">
            <p>
              These terms form an agreement between you and {site.legalName} (RC 9000892), a company
              registered in Nigeria (&quot;{site.name}&quot;, &quot;we&quot;, &quot;us&quot;). They
              apply to your use of our website, the Everlore Academy platform and any course you
              purchase. By creating an account or buying a course, you agree to these terms. Our{" "}
              <Link href="/privacy" className="font-medium text-brand underline-offset-4 hover:underline">
                Privacy Policy
              </Link>{" "}
              explains how we handle your personal data.
            </p>
          </Section>

          <Section title="2. Your account">
            <ul>
              <li>You must be at least 18 years old, or have the consent of a parent or guardian, to create an account.</li>
              <li>The information you give us must be accurate and kept up to date.</li>
              <li>You are responsible for keeping your login details secure and for all activity on your account.</li>
              <li>Accounts are personal. You may not share your account or let others access your courses through it.</li>
              <li>We may suspend or close accounts that breach these terms.</li>
            </ul>
          </Section>

          <Section title="3. Course licence">
            <p>
              When you enrol in a course, we grant you a <strong>personal, non-exclusive,
              non-transferable</strong> licence to access and view the course content for your own
              learning. Unless a course states otherwise, access continues for as long as we operate
              the course on the platform.
            </p>
            <p>
              You may not copy, download (unless we provide a download option), record, resell,
              share, publicly display or redistribute course content, or use it to create a competing
              product.
            </p>
          </Section>

          <Section title="4. Payments">
            <ul>
              <li>Prices are shown in Nigerian Naira (NGN) and include any applicable taxes unless stated otherwise.</li>
              <li>
                Payments are processed by Paystack. By paying, you also agree to Paystack&apos;s
                terms. We never receive or store your full card details.
              </li>
              <li>Access to a course is granted once your payment has been verified.</li>
              <li>We may change course prices at any time, but changes will not affect courses you have already bought.</li>
            </ul>
          </Section>

          <Section title="5. Refunds">
            {/* TODO(owner): confirm refund policy */}
            <p>
              If you are not satisfied with a course, contact us at{" "}
              <a href={`mailto:${site.email}`} className="font-medium text-brand underline-offset-4 hover:underline">
                {site.email}
              </a>{" "}
              within 7 days of purchase. We will review each request fairly and may decline refunds
              where a substantial part of the course has been accessed or downloaded, or where we
              see signs of abuse. Approved refunds are returned to the original payment method.
              Nothing in these terms limits any rights you have under Nigerian consumer protection
              law.
            </p>
          </Section>

          <Section title="6. Acceptable use">
            <p>You agree not to:</p>
            <ul>
              <li>use the platform for anything unlawful, fraudulent or harmful;</li>
              <li>share, pirate or resell course content or account access;</li>
              <li>attempt to hack, disrupt, scrape or overload the platform;</li>
              <li>harass, abuse or spam other learners, mentors or our staff in classes or community spaces;</li>
              <li>use what you learn to break the rules of third-party platforms such as YouTube, Amazon or payment providers.</li>
            </ul>
          </Section>

          <Section title="7. Intellectual property">
            <p>
              All content on the platform — including videos, text, graphics, course materials, our
              logo and our names such as Skill-to-Income Pathways™ — belongs to {site.legalName} or
              its licensors and is protected by intellectual property law. Except for the limited
              licence in section 3, no rights are transferred to you.
            </p>
          </Section>

          <Section title="8. Earnings disclaimer">
            <p>
              <strong>
                We do not guarantee that you will earn any money from our courses or services.
              </strong>{" "}
              Our courses teach skills such as YouTube, Amazon KDP, affiliate marketing, dropshipping,
              content creation and freelancing. Any examples of income, results or student success are
              illustrations only and are not typical or promised.
            </p>
            <p>
              Your results depend on many factors outside our control, including your effort, skills,
              time, budget, market conditions and the policies of third-party platforms, which can
              change at any time. Building an online income involves risk, and you may lose money you
              invest. Nothing we provide is financial, legal or tax advice.
            </p>
          </Section>

          <Section title="9. Third-party platforms">
            <p>
              Many courses involve services we don&apos;t control, such as YouTube, Amazon KDP,
              affiliate networks and e-commerce tools. Your use of those services is governed by their
              own terms, and we are not responsible for their decisions, policy changes, suspensions
              or payouts.
            </p>
          </Section>

          <Section title="10. Limitation of liability">
            <p>
              The platform and courses are provided &quot;as is&quot;. To the fullest extent permitted
              by law, we are not liable for any indirect or consequential loss, or for loss of
              profits, revenue, data or opportunity, arising from your use of our services. Our total
              liability to you for any claim is limited to the amount you paid us for the course or
              service concerned. Nothing in these terms excludes liability that cannot be excluded
              under Nigerian law.
            </p>
          </Section>

          <Section title="11. Changes">
            <p>
              We may update these terms from time to time. The &quot;Last updated&quot; date above
              shows when they last changed. If you keep using the platform after an update, you
              accept the new terms.
            </p>
          </Section>

          <Section title="12. Governing law">
            <p>
              These terms are governed by the laws of the Federal Republic of Nigeria. Any dispute
              will first be addressed through good-faith discussion, and if unresolved, will be
              subject to the jurisdiction of the Nigerian courts.
            </p>
          </Section>

          <Section title="13. Contact">
            <p>
              Questions about these terms? Email{" "}
              <a href={`mailto:${site.email}`} className="font-medium text-brand underline-offset-4 hover:underline">
                {site.email}
              </a>
              .
            </p>
          </Section>
        </div>
      </article>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-4">{title}</h2>
      {children}
    </section>
  );
}
