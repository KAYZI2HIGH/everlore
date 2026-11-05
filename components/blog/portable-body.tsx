import Image from "next/image";
import Link from "next/link";
import { PortableText, type PortableTextBlock, type PortableTextComponents } from "@portabletext/react";
import { imageUrl } from "@/lib/blog";

type ImageValue = {
  asset?: { _ref?: string };
  alt?: string;
  caption?: string;
};

function dimensionsFromRef(ref?: string) {
  // Sanity asset refs look like image-<id>-<width>x<height>-<ext>
  const match = ref?.match(/-(\d+)x(\d+)-/);
  return match ? { width: Number(match[1]), height: Number(match[2]) } : { width: 1600, height: 900 };
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="my-6 leading-[1.8]">{children}</p>,
    h1: ({ children }) => <h2 className="mb-4 mt-14 text-3xl font-extrabold leading-tight text-foreground">{children}</h2>,
    h2: ({ children }) => <h2 className="mb-4 mt-14 text-[1.75rem] font-extrabold leading-tight text-foreground">{children}</h2>,
    h3: ({ children }) => <h3 className="mb-3 mt-10 text-xl font-bold leading-snug text-foreground">{children}</h3>,
    h4: ({ children }) => <h4 className="mb-3 mt-8 text-lg font-bold text-foreground">{children}</h4>,
    h5: ({ children }) => <h5 className="mb-2 mt-8 text-base font-bold text-foreground">{children}</h5>,
    h6: ({ children }) => (
      <h6 className="mb-2 mt-8 text-sm font-bold uppercase tracking-wider text-foreground">{children}</h6>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-4 border-gold bg-secondary/60 py-4 pl-6 pr-4 text-lg font-medium italic leading-relaxed text-foreground rounded-r-2xl">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-6 list-disc space-y-2 pl-6 marker:text-gold-ink">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="my-6 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-gold-ink">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="pl-1.5 leading-[1.75]">{children}</li>,
    number: ({ children }) => <li className="pl-1.5 leading-[1.75]">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <span className="underline underline-offset-4">{children}</span>,
    "strike-through": ({ children }) => <s>{children}</s>,
    code: ({ children }) => (
      <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.875em] text-foreground">{children}</code>
    ),
    link: ({ children, value }) => {
      const href: string = (value as { href?: string } | undefined)?.href ?? "#";
      const className =
        "font-semibold text-brand underline decoration-brand/30 underline-offset-4 transition hover:decoration-brand";
      if (href.startsWith("/")) {
        return (
          <Link href={href} className={className}>
            {children}
          </Link>
        );
      }
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      const img = value as ImageValue;
      const src = imageUrl(img, 1600);
      if (!src) return null;
      const { width, height } = dimensionsFromRef(img.asset?._ref);
      return (
        <figure className="my-10">
          <Image
            src={src}
            alt={img.alt ?? ""}
            width={width}
            height={height}
            sizes="(min-width: 768px) 720px, 100vw"
            className="h-auto w-full rounded-2xl border border-border"
          />
          {img.caption && (
            <figcaption className="mt-3 text-center text-sm text-muted-foreground">{img.caption}</figcaption>
          )}
        </figure>
      );
    },
    code: ({ value }) => {
      const { code, language, filename } = value as { code?: string; language?: string; filename?: string };
      if (!code) return null;
      return (
        <figure className="my-8 overflow-hidden rounded-2xl border border-border bg-ink text-white/90">
          {(filename || language) && (
            <figcaption className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-xs text-white/60">
              <span className="font-mono">{filename}</span>
              {language && <span className="uppercase tracking-wider">{language}</span>}
            </figcaption>
          )}
          <pre className="overflow-x-auto p-5 text-sm leading-relaxed">
            <code className="font-mono">{code}</code>
          </pre>
        </figure>
      );
    },
  },
};

export function PortableBody({ value }: { value: PortableTextBlock[] }) {
  return (
    <div className="max-w-[68ch] text-[1.0625rem] text-foreground/85 [&>:first-child]:mt-0">
      <PortableText value={value} components={components} />
    </div>
  );
}
