import Image from "next/image";
import { CalendarClock, MonitorPlay, Video } from "lucide-react";

const MODES = [
  {
    icon: MonitorPlay,
    image: "/images/podcast.jpg",
    title: "Self-paced video courses",
    body: "HD lessons you can watch anywhere, structured into modules with progress that picks up where you left off.",
    tag: null,
  },
  {
    icon: Video,
    image: "/images/live-class.jpg",
    title: "Live classes",
    body: "Join scheduled sessions with your instructor and cohort, ask questions live, and rewatch the recording afterwards.",
    tag: "Coming soon",
  },
  {
    icon: CalendarClock,
    image: "/images/mentor.jpg",
    title: "1:1 strategy calls",
    body: "Book a private call to review your plan, your channel or your trades — and leave with clear next steps.",
    tag: "Coming soon",
  },
];

export function LearnYourWay() {
  return (
    <section id="learn" className="scroll-mt-20 bg-ink py-24 text-white lg:py-32">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">How you learn</p>
          <h2 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">
            Learn at your pace. <span className="text-[#a5bdff]">Grow with people.</span>
          </h2>
          <p className="mt-5 text-lg text-white/65">
            Video gives you the skill. Live sessions and mentorship give you the accountability to
            actually use it.
          </p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {MODES.map(({ icon: Icon, ...m }) => (
            <article
              key={m.title}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={m.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-[1.04]"
                />
                {m.tag && (
                  <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-gold-foreground">
                    {m.tag}
                  </span>
                )}
              </div>
              <div className="p-7">
                <Icon className="size-6 text-gold" />
                <h3 className="mt-4 text-xl font-bold">{m.title}</h3>
                <p className="mt-2 leading-relaxed text-white/65">{m.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
