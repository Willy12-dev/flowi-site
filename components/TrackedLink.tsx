"use client";

import { track } from "@vercel/analytics";

interface Props {
  href: string;
  className?: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
  /** Article-attribution payload — emits a "cta_click" Vercel Analytics event */
  attribution: {
    article: string;
    vertical: string;
    position: "top-byline" | "inline-magnet" | "bottom-funnel" | "trader-cta" | "woyuduin-cta" | "book-cta";
    offer: string;
  };
}

export default function TrackedLink({
  href,
  className,
  target,
  rel,
  children,
  attribution,
}: Props) {
  function handleClick() {
    track("cta_click", attribution);
  }
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
