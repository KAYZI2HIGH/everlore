"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface ContactSectionProps {
  /**
   * The title for the contact section.
   */
  title?: string;
  /**
   * The subtitle or main message for the introductory part.
   */
  mainMessage?: string;
  /**
   * The contact email to display.
   */
  contactEmail?: string;
  /**
   * Array of social media links. Each object should have an 'id', 'name', 'iconSrc', and 'href'.
   */
  socialLinks?: Array<{
    id: string;
    name: string;
    iconSrc: string;
    href: string;
  }>;
  /**
   * Placeholder image for the background.
   */
  backgroundImageSrc?: string;
  /**
   * Callback function when the form is submitted.
   * @param data The form data.
   */
  onSubmit?: (data: {
    name: string;
    email: string;
    message: string;
    projectType: string[];
  }) => void;
}

const defaultSocialLinks = [
  {
    id: "1",
    name: "X",
    iconSrc: "https://simpleicons.org/icons/x.svg",
    href: "#x",
  },
  {
    id: "2",
    name: "Instagram",
    iconSrc: "https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/instagram.svg",
    href: "#instagram",
  },
  {
    id: "3",
    name: "LinkedIn",
    iconSrc: "https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/linkedin.svg",
    href: "#linkedin",
  },
];

export const ContactSection: React.FC<ContactSectionProps> = ({
  title = "Ready to Transform Your Digital Future?",
  mainMessage = "Get in Touch👋",
  contactEmail = "hello@everlore.com",
  socialLinks = defaultSocialLinks,
  backgroundImageSrc = "https://images.unsplash.com/photo-1742273330004-ef9c9d228530?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDY0fENEd3V3WEpBYkV3fHxlbnwwfHx8fHw%3D&auto=format&fit=crop&q=60&w=900", // Example image from Unsplash
  onSubmit,
}) => {
  const [formData, setFormData] = React.useState<{
    name: string;
    email: string;
    message: string;
    projectType: string[];
  }>({
    name: "",
    email: "",
    message: "",
    projectType: [],
  });
  const [submitState, setSubmitState] = React.useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (type: string, checked: boolean | string) => {
    setFormData((prev) => {
      const currentTypes = prev.projectType;
      const isChecked = checked === true || checked === "indeterminate";
      if (isChecked) {
        return { ...prev, projectType: [...currentTypes, type] };
      } else {
        return { ...prev, projectType: currentTypes.filter((t) => t !== type) };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitState("submitting");
    try {
      onSubmit?.(formData);
      setSubmitState("success");
    } catch {
      setSubmitState("error");
    }
  };

  const projectTypeOptions = [
    "Academy Course Inquiry",
    "Digital Services Help",
    "Multimedia & Publishing",
    "Blog & Resources",
    "Business Partnership",
    "Speaking Engagement",
    "Collaboration",
    "Technical Support",
    "Other",
  ];

  return (
    <section
      className="relative w-full overflow-hidden bg-background"
      id="contact"
    >
      {/* Background Image and Animated Bubbles */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-500 ease-in-out"
        style={{ backgroundImage: `url(${backgroundImageSrc})` }}
      >
        {/* Animated Bubbles */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-white/20 rounded-full animate-bubble opacity-0"
              style={{
                width: `${[14, 18, 22, 16, 26][i % 5]}px`,
                height: `${[14, 18, 22, 16, 26][i % 5]}px`,
                left: `${(i * 17 + 5) % 100}%`,
                animationDelay: `${(i * 1.7) % 10}s`,
                animationDuration: `${15 + (i % 4) * 3}s`,
                top: `${(i * 23 + 8) % 100}%`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-between w-full min-h-full p-3 md:p-8 lg:p-12">
        {/* Main Section - Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 w-full max-w-7xl p-3 md:p-8 rounded-xl">
          {/* Left Side: Title */}
          <div className="flex flex-col justify-center md:justify-end p-2 md:p-8">
            <h1 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight drop-shadow-lg max-w-lg">
              {title}
            </h1>
          </div>

          {/* Right Side: Contact Form */}
          <div className="bg-background/90 p-4 md:p-6 lg:p-8 rounded-lg shadow-xl border border-border">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4 md:mb-6">
              {mainMessage}
            </h2>

            {/* Email & Socials */}
            <div className="mb-4 md:mb-6">
              <p className="text-muted-foreground text-sm mb-2">Mail us at</p>
              <a
                href={`mailto:${contactEmail}`}
                className="text-primary hover:underline font-medium text-sm md:text-base"
              >
                {contactEmail}
              </a>
              <div className="flex items-center gap-2 md:gap-3 mt-3 md:mt-4">
                <span className="text-muted-foreground text-xs md:text-sm">
                  OR
                </span>
                {socialLinks.map((link) => (
                  <Button
                    key={link.id}
                    variant="outline"
                    size="icon"
                    asChild
                    className="w-8 h-8 md:w-10 md:h-10"
                  >
                    <a
                      href={link.href}
                      aria-label={link.name}
                    >
                      {/* Using a simple placeholder for icons. In a real app, use react-icons or SVG components */}
                      <img
                        src={link.iconSrc}
                        alt={link.name}
                        className="h-3 w-3 md:h-4 md:w-4 dark:invert"
                      />
                    </a>
                  </Button>
                ))}
              </div>
            </div>

            <hr className="my-4 md:my-6 border-border" />

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4 md:space-y-6"
            >
              <p className="text-muted-foreground text-sm md:text-base">
                Tell us about your interests
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm"
                  >
                    Your name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="message"
                  className="text-sm"
                >
                  Tell us more about your inquiry...
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Share your thoughts, questions, or how we can help..."
                  className="min-h-[80px] text-sm"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-3 md:space-y-4">
                <p className="text-muted-foreground text-sm md:text-base">
                  What are you interested in?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                  {projectTypeOptions.map((option) => (
                    <div
                      key={option}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={option.replace(/\s/g, "-").toLowerCase()}
                        checked={formData.projectType.includes(option)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(option, checked as boolean)
                        }
                        className="w-4 h-4"
                      />
                      <Label
                        htmlFor={option.replace(/\s/g, "-").toLowerCase()}
                        className="text-xs md:text-sm font-normal cursor-pointer"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {submitState === "success" && (
                <p className="rounded-md border border-[#5E8B20]/30 bg-[#EFF8DF] p-3 text-sm text-[#35520F]" role="status">
                  Thanks — your message is ready to be reviewed. We&apos;ll be in touch soon.
                </p>
              )}
              {submitState === "error" && (
                <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive" role="alert">
                  We couldn&apos;t send that message. Please try again.
                </p>
              )}
              <Button
                type="submit"
                className="min-h-11 w-full text-sm md:text-base"
                disabled={submitState === "submitting"}
              >
                {submitState === "submitting" ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* CSS for bubble animation */}
      <style
        jsx
        global
      >{`
        @keyframes bubble {
          0% {
            transform: translateY(0) translateX(0) scale(0.5);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh)
              translateX(calc(var(--rand-x-offset) * 10vw)) scale(1.2);
            opacity: 0;
          }
        }
        .animate-bubble {
          animation: bubble var(--animation-duration, 15s) ease-in-out infinite;
          animation-fill-mode: forwards;
          --rand-x-offset: 1;
        }
      `}</style>
    </section>
  );
};
