"use client";
import {
  FacebookIcon,
  GithubIcon,
  Grid2X2Plus,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
  YoutubeIcon,
} from "lucide-react";

export function MinimalFooter() {
  const year = new Date().getFullYear();

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.replace("#", "");
      const element = document.getElementById(targetId);

      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const company = [
    {
      title: "About Everlore",
      href: "#about",
    },
    {
      title: "Contact Us",
      href: "#contact",
    },
    {
      title: "Privacy Policy",
      href: "#",
    },
    {
      title: "Terms of Service",
      href: "#",
    },
  ];

  const resources = [
    {
      title: "Academy",
      href: "#features",
    },
    {
      title: "Blog & Resources",
      href: "#features",
    },
    {
      title: "Support",
      href: "#contact",
    },
    {
      title: "FAQ",
      href: "#contact",
    },
  ];

  const socialLinks = [
    {
      icon: <FacebookIcon className="size-4" />,
      link: "#",
    },
    {
      icon: <GithubIcon className="size-4" />,
      link: "#",
    },
    {
      icon: <InstagramIcon className="size-4" />,
      link: "#",
    },
    {
      icon: <LinkedinIcon className="size-4" />,
      link: "#",
    },
    {
      icon: <TwitterIcon className="size-4" />,
      link: "#",
    },
    {
      icon: <YoutubeIcon className="size-4" />,
      link: "#",
    },
  ];
  return (
    <footer className="relative">
      <div className="bg-[radial-gradient(35%_80%_at_30%_0%,--theme(--color-foreground/.1),transparent)] mx-auto max-w-4xl md:border-x">
        <div className="bg-border absolute inset-x-0 h-px w-full" />
        <div className="grid max-w-4xl grid-cols-2 md:grid-cols-6 gap-3 md:gap-6 p-3 md:p-4">
          <div className="col-span-2 md:col-span-4 flex flex-col gap-3 md:gap-5">
            <a
              href="#"
              className="w-max opacity-25"
            >
              <Grid2X2Plus className="size-6 md:size-8" />
            </a>
            <p className="text-muted-foreground max-w-sm font-mono text-xs md:text-sm text-balance">
              Empowering growth through knowledge and digital innovation. Build
              practical skills, create sustainable income.
            </p>
            <div className="flex gap-1 md:gap-2">
              {socialLinks.map((item, i) => (
                <a
                  key={i}
                  className="hover:bg-accent rounded-md border p-1 md:p-1.5"
                  target="_blank"
                  href={item.link}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
          <div className="col-span-1 w-full md:col-span-1">
            <span className="text-muted-foreground mb-1 text-xs">
              Resources
            </span>
            <div className="flex flex-col gap-1">
              {resources.map(({ href, title }, i) => (
                <a
                  key={i}
                  className={`w-max py-1 text-xs md:text-sm duration-200 hover:underline`}
                  href={href}
                  onClick={(e) => handleSmoothScroll(e, href)}
                >
                  {title}
                </a>
              ))}
            </div>
          </div>
          <div className="col-span-1 w-full md:col-span-1">
            <span className="text-muted-foreground mb-1 text-xs">Company</span>
            <div className="flex flex-col gap-1">
              {company.map(({ href, title }, i) => (
                <a
                  key={i}
                  className={`w-max py-1 text-xs md:text-sm duration-200 hover:underline`}
                  href={href}
                  onClick={(e) => handleSmoothScroll(e, href)}
                >
                  {title}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-border absolute inset-x-0 h-px w-full" />
        <div className="flex max-w-4xl flex-col justify-between gap-2 pt-2 pb-3 md:pb-5 px-3 md:px-4">
          <p className="text-muted-foreground text-center font-thin text-xs md:text-sm">
            © Everlore {year}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
