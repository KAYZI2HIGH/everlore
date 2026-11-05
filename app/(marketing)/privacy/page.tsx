import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { site } from "@/lib/config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Everlore Digital Services Limited collects, uses and protects your personal data, and your rights under the Nigeria Data Protection Act 2023.",
};

const LAST_UPDATED = "5 November 2026";

export default function PrivacyPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-ink text-white">
        <div aria-hidden className="absolute -right-24 -top-24 size-96 rounded-full bg-brand/40 blur-3xl" />
        <div className="container-page relative py-14 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Legal</p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">Privacy Policy</h1>
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
          <Section title="1. Who we are">
            <p>
              {site.legalName} (RC 9000892), trading as {site.name} (&quot;we&quot;, &quot;us&quot;), is
              a company registered in Nigeria. We operate this website and the Everlore Academy online
              learning platform, and we are the data controller for the personal data described in
              this policy.
            </p>
          </Section>

          <Section title="2. Data we collect">
            <ul>
              <li>
                <strong>Account data:</strong> your name, email address, profile picture (if you sign
                in with Google) and a securely hashed password if you create a password-based account.
              </li>
              <li>
                <strong>Learning data:</strong> the courses you enrol in, items in your cart or
                wishlist, and your course progress.
              </li>
              <li>
                <strong>Payment data:</strong> payments are processed by Paystack. We receive a
                transaction reference, amount, currency and payment status.{" "}
                <strong>We never receive or store your full card details</strong> — these are handled
                directly by Paystack under its own security standards and privacy policy.
              </li>
              <li>
                <strong>Contact messages:</strong> the name, email address and message you send
                through our contact form or by email.
              </li>
              <li>
                <strong>Technical data:</strong> basic information such as your browser type, device
                and IP address, collected in server logs to keep the service secure and working.
              </li>
            </ul>
          </Section>

          <Section title="3. How we use your data">
            <ul>
              <li>To create and manage your account and give you access to courses you purchase.</li>
              <li>To process and verify payments and keep records required by law.</li>
              <li>To respond to your enquiries and provide support.</li>
              <li>To send service messages about your account or purchases.</li>
              <li>To maintain the security of the platform and prevent fraud or misuse.</li>
              <li>
                To send marketing updates, only where you have agreed to receive them. You can opt
                out at any time.
              </li>
            </ul>
            <p>
              We rely on the performance of our contract with you, our legitimate interests in
              running a secure service, compliance with legal obligations and, where required, your
              consent.
            </p>
          </Section>

          <Section title="4. Cookies">
            <p>
              We use essential cookies to keep you signed in and to protect your session. These are
              necessary for the platform to work and cannot be switched off. We may also store simple
              preferences, such as your light or dark theme. We do not sell cookie data to third
              parties.
            </p>
          </Section>

          <Section title="5. Sharing your data">
            <p>We do not sell your personal data. We share it only with service providers that help us run the platform, including:</p>
            <ul>
              <li>Paystack, for payment processing;</li>
              <li>Google, if you choose to sign in with your Google account;</li>
              <li>our hosting, database and email providers.</li>
            </ul>
            <p>
              These providers may process data outside Nigeria. Where they do, we take steps to ensure
              adequate protection as required by the Nigeria Data Protection Act 2023. We may also
              disclose data where required by law or to protect our legal rights.
            </p>
          </Section>

          <Section title="6. How long we keep it">
            <p>
              We keep your account data for as long as your account is active. Payment and transaction
              records are kept for as long as required by Nigerian tax and accounting law. Contact
              messages are kept for as long as needed to deal with your enquiry. When data is no longer
              needed, we delete or anonymise it.
            </p>
          </Section>

          <Section title="7. Your rights under the NDPA 2023">
            <p>Under the Nigeria Data Protection Act 2023 you have the right to:</p>
            <ul>
              <li>be informed about how your personal data is used;</li>
              <li>access a copy of the personal data we hold about you;</li>
              <li>have inaccurate data corrected;</li>
              <li>have your data deleted, where there is no lawful reason to keep it;</li>
              <li>restrict or object to certain processing;</li>
              <li>withdraw consent at any time, where processing is based on consent;</li>
              <li>receive your data in a portable format;</li>
              <li>lodge a complaint with the Nigeria Data Protection Commission (NDPC).</li>
            </ul>
            <p>To exercise any of these rights, email us using the details below.</p>
          </Section>

          <Section title="8. Security">
            <p>
              We use reasonable technical and organisational measures to protect your data, including
              encrypted connections and hashed passwords. No online service is completely secure, so
              please keep your password private and let us know if you suspect unauthorised access.
            </p>
          </Section>

          <Section title="9. Children">
            <p>
              Our services are not directed at children under 18. If you believe a child has given us
              personal data without parental consent, please contact us and we will delete it.
            </p>
          </Section>

          <Section title="10. Changes to this policy">
            <p>
              We may update this policy from time to time. The &quot;Last updated&quot; date above shows
              when it was last changed. Significant changes will be communicated on the site or by
              email.
            </p>
          </Section>

          <Section title="11. Contact us">
            <p>
              For any privacy question or request, email{" "}
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
