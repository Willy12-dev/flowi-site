import * as React from "react";
import { Frame } from "../Frame";
import type { Theme } from "@/lib/carousel/themes";
import type { PhotoFrameSlide } from "@/lib/carousel/types";

/**
 * Emulates the talking-head / cinematic-bg-photo style by rendering a deep
 * placeholder color block with overlay text. Drop a real photo into Canva
 * over the result, or accept the colored variant as-is — both work in feed.
 */
export function PhotoFrame({
  slide,
  theme,
  handle,
}: {
  slide: PhotoFrameSlide;
  theme: Theme;
  handle: string;
}) {
  const bgColor = slide.bgColor ?? "#1F1812";
  const ink = "#F4E8D9";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: 1080,
        height: 1350,
        backgroundColor: bgColor,
        color: ink,
        fontFamily: theme.fonts.body,
        position: "relative",
        padding: 0,
      }}
    >
      {slide.bgImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={slide.bgImage}
          alt=""
          width={1080}
          height={1350}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1080,
            height: 1350,
            objectFit: "cover",
          }}
        />
      )}
      {/* Dark gradient overlay so overlay text stays readable on busy photos */}
      {slide.bgImage && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1080,
            height: 1350,
            backgroundImage:
              "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.0) 35%, rgba(0,0,0,0.0) 55%, rgba(0,0,0,0.78) 100%)",
            display: "flex",
          }}
        />
      )}
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
        {`SLIDE ${pad(slide.index)} / ${pad(slide.total)}`}
      </div>

      {/* Placeholder box — only shows when no real bgImage is supplied */}
      {!slide.bgImage && (
        <div
          style={{
            position: "absolute",
            top: 140,
            left: 60,
            right: 60,
            bottom: 420,
            backgroundColor: "rgba(255,255,255,0.04)",
            borderRadius: 18,
            border: `1px solid rgba(255,255,255,0.08)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: theme.fonts.mono,
              fontSize: 14,
              color: "rgba(255,255,255,0.18)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            [ photo · set bgImage in the spec ]
          </div>
        </div>
      )}

      {/* Text overlay block */}
      <div
        style={{
          position: "absolute",
          bottom: 160,
          left: 60,
          right: 60,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {slide.eyebrow && (
          <div
            style={{
              display: "flex",
              fontFamily: theme.fonts.mono,
              fontSize: 20,
              color: theme.accent,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            {slide.eyebrow}
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontFamily: theme.fonts.display,
            fontSize: 74,
            lineHeight: 1.02,
            color: ink,
            letterSpacing: "-0.025em",
            fontWeight: 700,
          }}
        >
          <div style={{ display: "flex" }}>{slide.headline}</div>
          {slide.italicWord && (
            <div style={{ display: "flex" }}>
              <span
                style={{
                  display: "flex",
                  fontFamily: theme.fonts.italic,
                  fontStyle: "italic",
                  color: theme.accent,
                }}
              >
                {slide.italicWord}
              </span>
            </div>
          )}
        </div>

        {slide.byline && (
          <div
            style={{
              display: "flex",
              marginTop: 18,
              fontFamily: theme.fonts.body,
              fontSize: 22,
              color: "rgba(255,255,255,0.65)",
            }}
          >
            {slide.byline}
          </div>
        )}
      </div>

      {/* Handle */}
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
            color: "rgba(255,255,255,0.55)",
            marginBottom: 14,
          }}
        >
          {handle}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {Array.from({ length: slide.total }).map((_, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor:
                  i + 1 === slide.index ? theme.accent : "rgba(255,255,255,0.3)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n);
}
