import Link from "next/link";

interface AdvertBannerProps {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
}

export function AdvertBanner({
  title = "50% off on all courses this month",
  description = "Enroll now and transform your skills",
  ctaText = "Learn More",
  ctaLink = "/academy/courses",
}: AdvertBannerProps) {
  return (
    <div className="w-full bg-slate-900 text-white py-3 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{title}</p>
            <p className="text-xs text-slate-400 mt-0.5">{description}</p>
          </div>

          {/* CTA Link */}
          <Link
            href={ctaLink}
            className="whitespace-nowrap text-sm font-semibold text-green-500 hover:text-green-400 transition-colors underline"
          >
            {ctaText} →
          </Link>
        </div>
      </div>
    </div>
  );
}
