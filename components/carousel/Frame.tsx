/**
 * Frame — shared chrome wrapped around every slide template.
 *
 * Provides: background, slide marker (top-right), handle (bottom-center),
 * page dots (bottom-center). Children = the template body.
 *
 * Satori-safe: only inline styles, no Tailwind, no className.
 */

import * as React from "react";
import type { Theme } from "@/lib/carousel/themes";

interface FrameProps {
  theme: Theme;
  index: number;
  total: number;
  handle: string;
  /** Show the slide marker top-right (default true). */
  marker?: boolean;
  /** Optional brand bar across the very top (mint theme). */
  brandBar?: boolean;
  children: React.ReactNode;
}

export function Frame({
  theme,
  index,
  total,
  handle,
  marker = true,
  brandBar = false,
  children,
}: FrameProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: 1080,
        height: 1350,
        backgroundColor: theme.bg,
        color: theme.ink,
        fontFamily: theme.fonts.body,
        position: "relative",
        padding: 0,
      }}
    >
      {brandBar && theme.brandBar && (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: 80,
            backgroundColor: theme.brandBar,
            alignItems: "center",
            paddingLeft: 60,
            fontFamily: theme.fonts.body,
            fontSize: 28,
            color: "#1A1815",
            fontWeight: 600,
            letterSpacing: "-0.01em",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 28,
              height: 28,
              marginRight: 14,
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              color: "#1A1815",
            }}
          >
            *
          </div>
          Claude
        </div>
      )}

      {marker && (
        <div
          style={{
            position: "absolute",
            top: 50,
            right: 60,
            display: "flex",
            fontFamily: theme.fonts.mono,
            fontSize: 22,
            color: theme.accent,
            letterSpacing: "0.08em",
          }}
        >
          {`SLIDE ${pad(index)} / ${pad(total)}`}
        </div>
      )}

      {/* Body */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          padding: "120px 80px 130px 80px",
        }}
      >
        {children}
      </div>

      {/* Bottom: handle + page dots */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          bottom: 50,
          left: 0,
          right: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: theme.fonts.body,
            fontSize: 22,
            color: theme.muted,
            marginBottom: 14,
            letterSpacing: "0.02em",
          }}
        >
          {handle}
        </div>
        <Dots theme={theme} index={index} total={total} />
      </div>
    </div>
  );
}

function Dots({
  theme,
  index,
  total,
}: {
  theme: Theme;
  index: number;
  total: number;
}) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: i + 1 === index ? theme.accent : theme.muted,
            opacity: i + 1 === index ? 1 : 0.4,
          }}
        />
      ))}
    </div>
  );
}

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n);
}
