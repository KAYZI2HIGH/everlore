const TOPICS = [
  "YouTube Automation",
  "Forex Trading",
  "Book Publishing & KDP",
  "Dropshipping",
  "Affiliate Marketing",
  "Content Creation",
  "Freelancing Skills",
  "Online Business Automation",
];

export function TopicsMarquee() {
  const items = [...TOPICS, ...TOPICS];
  return (
    <section aria-label="Topics we teach" className="border-y border-border bg-card py-5">
      <div className="mask-fade-x overflow-hidden">
        <ul className="flex w-max animate-marquee gap-10 hover:[animation-play-state:paused]">
          {items.map((t, i) => (
            <li
              key={i}
              aria-hidden={i >= TOPICS.length}
              className="flex items-center gap-10 whitespace-nowrap text-sm font-semibold text-muted-foreground"
            >
              {t}
              <span className="size-1.5 rounded-full bg-gold" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
