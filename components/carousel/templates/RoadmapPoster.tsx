import * as React from "react";
import type { Theme } from "@/lib/carousel/themes";
import type { RoadmapPosterSlide } from "@/lib/carousel/types";
import { Starburst } from "./promptpack-shared";

/**
 * Roadmap POSTER — a single dark, save-worthy educational poster. An orange
 * starburst mark, a bold display title, a numbered roadmap of stages, and a
 * comment-to-DM call to action. Self-contained dark theme: does NOT use the
 * deck Frame or the white "method" palette.
 *
 * Built for single-image teaching posts — the kind people screenshot and
 * save. Rendered on the standard 1080×1350 canvas.
 */

const D = {
  bg: "#1A1814",
  ink: "#F6F3EC",
  inkSoft: "#B6AEA1",
  muted: "#8E867A",
  orange: "#F06A38",
  green: "#8FC93F",
  line: "#2E2A24",
  sans: "Inter",
  mono: "JetBrainsMono",
} as const;

function roadColor(accent?: "orange" | "green"): string {
  if (accent === "orange") return D.orange;
  if (accent === "green") return D.green;
  return D.ink;
}

export function RoadmapPoster({
  slide,
  handle,
}: {
  slide: RoadmapPosterSlide;
  theme: Theme;
  handle: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: 1080,
        height: 1350,
        backgroundColor: D.bg,
        fontFamily: D.sans,
        paddingLeft: 76,
        paddingRight: 76,
        paddingTop: 64,
        paddingBottom: 56,
      }}
    >
      {/* Brand mark */}
      <Starburst size={54} color={D.orange} />

      {/* Eyebrow */}
      {slide.eyebrow ? (
        <div
          style={{
            display: "flex",
            fontFamily: D.mono,
            fontSize: 19,
            letterSpacing: 3,
            color: D.orange,
            marginTop: 22,
          }}
        >
          {slide.eyebrow.toUpperCase()}
        </div>
      ) : null}

      {/* Title */}
      <div style={{ display: "flex", flexDirection: "column", marginTop: 14 }}>
        {slide.title.map((line, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            {line.map((r, j) => (
              <div
                key={j}
                style={{
                  display: "flex",
                  fontSize: 80,
                  fontWeight: 800,
                  lineHeight: 1.05,
                  letterSpacing: -1.8,
                  color: roadColor(r.accent),
                }}
              >
                {r.t}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Subtitle */}
      {slide.subtitle ? (
        <div
          style={{
            display: "flex",
            fontSize: 25,
            fontWeight: 400,
            lineHeight: 1.4,
            color: D.inkSoft,
            marginTop: 16,
          }}
        >
          {slide.subtitle}
        </div>
      ) : null}

      {/* Divider */}
      <div
        style={{
          display: "flex",
          height: 1,
          backgroundColor: D.line,
          marginTop: 26,
        }}
      />

      {/* Roadmap stages */}
      <div style={{ display: "flex", flexDirection: "column", marginTop: 6 }}>
        {slide.stages.map((s, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            {/* number badge */}
            <div
              style={{
                display: "flex",
                width: 44,
                height: 44,
                borderRadius: 999,
                backgroundColor: D.orange,
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 20,
                  fontWeight: 800,
                  color: D.bg,
                }}
              >
                {i + 1}
              </div>
            </div>
            {/* stage text */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 22,
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 29,
                  fontWeight: 600,
                  color: D.ink,
                }}
              >
                {s.title}
              </div>
              {s.tail ? (
                <div
                  style={{
                    display: "flex",
                    fontSize: 27,
                    fontWeight: 400,
                    color: D.muted,
                    marginLeft: 10,
                  }}
                >
                  {s.tail}
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {/* push CTA to the bottom */}
      <div style={{ display: "flex", flexGrow: 1 }} />

      {/* CTA */}
      <div
        style={{
          display: "flex",
          height: 1,
          backgroundColor: D.line,
          marginBottom: 26,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 34,
              fontWeight: 800,
              color: D.ink,
            }}
          >
            {slide.cta.pre}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 34,
              fontWeight: 800,
              color: D.orange,
              marginLeft: 12,
            }}
          >
            {`"${slide.cta.keyword}"`}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 34,
            fontWeight: 800,
            color: D.ink,
            marginTop: 8,
            textAlign: "center",
          }}
        >
          {slide.cta.post}
        </div>
      </div>

      {/* Handle */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 22,
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: D.mono,
            fontSize: 18,
            letterSpacing: 2,
            color: D.muted,
          }}
        >
          {handle}
        </div>
      </div>
    </div>
  );
}
