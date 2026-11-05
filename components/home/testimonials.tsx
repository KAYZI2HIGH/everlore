import { Quote } from "lucide-react";

// TODO(owner): replace with real learner quotes (name, role, photo with consent).
const TESTIMONIALS = [
  {
    quote:
      "Everlore transformed my skills and helped me generate sustainable income. The practical approach made all the difference.",
    name: "Briana Patton",
    role: "Digital Marketer",
  },
  {
    quote:
      "The courses are incredibly practical. I learned real-world strategies and started my own digital services within weeks.",
    name: "Bilal Ahmed",
    role: "Freelancer",
  },
  {
    quote:
      "Everlore's community and resources are exceptional. I've grown my skills and my income significantly.",
    name: "Saman Malik",
    role: "Content Creator",
  },
];

export function Testimonials() {
  return (
    <section className="bg-muted/50 py-24 lg:py-32">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-ink">Testimonials</p>
          <h2 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">
            What our <span className="text-gold-ink">learners say</span>
          </h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="flex flex-col rounded-3xl border border-border bg-card p-8">
              <Quote className="size-8 text-gold" />
              <blockquote className="mt-5 flex-1 text-lg leading-relaxed">“{t.quote}”</blockquote>
              <figcaption className="mt-8 flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {t.name.split(" ").map((p) => p[0]).join("")}
                </span>
                <span>
                  <span className="block font-semibold">{t.name}</span>
                  <span className="block text-sm text-muted-foreground">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
