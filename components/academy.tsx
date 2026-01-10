import {
  Activity,
  BookOpenText,
  DollarSign,
  DraftingCompass,
  Mail,
  ToolCase,
  TrendingUpDown,
  Truck,
  TvMinimalPlay,
  Videotape,
  Zap,
} from "lucide-react";

export function Academy() {
  return (
    <section className="py-10 px-4 md:px-6">
      <div className="mx-auto max-w-xl md:max-w-6xl">
        <div className="grid items-center gap-6 md:gap-12 md:grid-cols-2 lg:grid-cols-5 lg:gap-24">
          <div className="lg:col-span-3">
            <div className="md:pr-6 lg:pr-0">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-medium">
                Learn Skills That Works
              </h2>
              <p className="mt-4 md:mt-6 text-sm md:text-base">
                The Everlore Academy is your gateway to practical digital
                education, designed for modern income creation and career
                growth.
              </p>
            </div>
            <ul className="mt-6 md:mt-8 divide-y border-y grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 *:flex *:items-center *:gap-2 md:*:gap-3 *:py-2 md:*:py-3">
              <li>
                <TvMinimalPlay className="size-4 md:size-5 flex-shrink-0" />
                <p className="max-w-62.5 truncate text-xs md:text-sm">
                  YouTube Automation & Content Systems
                </p>
              </li>
              <li>
                <TrendingUpDown className="size-4 md:size-5 flex-shrink-0" />
                <p className="max-w-62.5 truncate text-xs md:text-sm">
                  Forex Trading Education
                </p>
              </li>
              <li>
                <BookOpenText className="size-4 md:size-5 flex-shrink-0" />
                <p className="max-w-62.5 truncate text-xs md:text-sm">
                  Book Publishing (Aggregator platform, KDP)
                </p>
              </li>
              <li>
                <Truck className="size-4 md:size-5 flex-shrink-0" />
                <p className="max-w-62.5 truncate text-xs md:text-sm">
                  Drop shipping
                </p>
              </li>
              <li>
                <DollarSign className="size-4 md:size-5 flex-shrink-0" />
                <p className="max-w-62.5 truncate text-xs md:text-sm">
                  Affiliate Marketing
                </p>
              </li>
              <li>
                <Videotape className="size-4 md:size-5 flex-shrink-0" />
                <p className="max-w-62.5 truncate text-xs md:text-sm">
                  Content Creation
                </p>
              </li>
              <li>
                <ToolCase className="size-4 md:size-5 flex-shrink-0" />
                <p className="max-w-62.5 truncate text-xs md:text-sm">
                  Digital Services & Freelancing Skills
                </p>
              </li>
              <li>
                <ToolCase className="size-4 md:size-5 flex-shrink-0" />
                <p className="max-w-62.5 truncate text-xs md:text-sm">
                  Online Business Models & Automation Tools
                </p>
              </li>
            </ul>
          </div>
          <div className="border-border/50 relative rounded-3xl border p-2 md:p-3 lg:col-span-2 mt-6 md:mt-0">
            <div className="bg-gradient-to-b aspect-76/59 relative rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700">
              <img
                src="/academy.avif"
                className="rounded-[15px] shadow"
                alt="payments illustration light"
                width={1207}
                height={929}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
