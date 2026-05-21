import * as React from "react";
import type { Theme } from "@/lib/carousel/themes";
import type { PromptPackCtaSlide } from "@/lib/carousel/types";
import { PP, Starburst } from "./promptpack-shared";

/**
 * Prompt-pack CTA — the comment-to-DM close. Big "Comment [KEYWORD] below"
 * headline, a white card naming what they get, and a down arrow. No price,
 * no product name, no hard sell — the money happens in the DM.
 */
export function PromptPackCta({
  slide,
}: {
  slide: PromptPackCtaSlide;
  theme: Theme;
  handle: string;
}) {
  const W = 1080;
  const H = 1350;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: W,
        height: H,
        backgroundColor: PP.paper,
        position: "relative",
        fontFamily: PP.serif,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Starburst */}
      <div style={{ display: "flex", marginBottom: 38 }}>
        <Starburst size={58} />
      </div>

      {/* Headline */}
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
            fontFamily: PP.serif,
            fontWeight: 700,
            fontSize: 90,
            lineHeight: 1.04,
            color: PP.ink,
          }}
        >
          {slide.pre}
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: PP.serif,
            fontWeight: 700,
            fontSize: 168,
            lineHeight: 1.0,
            letterSpacing: 1,
            color: PP.orange,
          }}
        >
          {slide.keyword}
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: PP.serif,
            fontWeight: 700,
            fontSize: 90,
            lineHeight: 1.04,
            color: PP.ink,
          }}
        >
          {slide.post}
        </div>
      </div>

      {/* Card */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 26,
          marginTop: 52,
          backgroundColor: PP.card,
          borderRadius: 28,
          border: `1px solid ${PP.cardBorder}`,
          padding: "32px 40px",
          maxWidth: 760,
        }}
      >
        {/* Comment-bubble icon */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            width: 76,
            height: 76,
            borderRadius: 20,
            backgroundColor: "#FBEADF",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 11,
              height: 11,
              borderRadius: 999,
              backgroundColor: PP.orange,
            }}
          />
          <div
            style={{
              display: "flex",
              width: 11,
              height: 11,
              borderRadius: 999,
              backgroundColor: PP.orange,
            }}
          />
          <div
            style={{
              display: "flex",
              width: 11,
              height: 11,
              borderRadius: 999,
              backgroundColor: PP.orange,
            }}
          />
        </div>

        {/* Lines */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {slide.card.map((line, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                fontFamily: PP.sans,
                fontSize: 31,
                lineHeight: 1.32,
                fontWeight: line.accent ? 600 : 400,
                color: line.accent ? PP.orange : PP.ink,
              }}
            >
              {line.t}
            </div>
          ))}
        </div>
      </div>

      {/* Down arrow */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 50,
        }}
      >
        <div
          style={{
            display: "flex",
            width: 4,
            height: 46,
            borderRadius: 999,
            backgroundColor: PP.orange,
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginTop: -6,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 4,
              height: 24,
              borderRadius: 999,
              backgroundColor: PP.orange,
              transform: "rotate(-45deg)",
            }}
          />
          <div
            style={{
              display: "flex",
              width: 4,
              height: 24,
              borderRadius: 999,
              backgroundColor: PP.orange,
              transform: "rotate(45deg)",
              marginLeft: -3,
            }}
          />
        </div>
      </div>
    </div>
  );
}
