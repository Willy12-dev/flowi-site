"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const DISMISS_KEY = "flowi-launch-banner-dismissed-v1";

export default function LaunchBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(DISMISS_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
  }

  if (!visible) return null;

  return (
    <div className="bg-[var(--accent)] text-[var(--paper)]">
      <div className="page-gutter py-2">
        <div className="page-max-wide flex items-center justify-between gap-x-4">
          <Link
            href="/launch"
            className="text-[13px] sm:text-[14px] no-underline hover:underline"
          >
            <strong>Launch week.</strong> Three field guides at $9 each — price moves to $14 on Monday.{" "}
            <span className="underline">Get them →</span>
          </Link>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss"
            className="text-[14px] opacity-80 hover:opacity-100 px-2"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
