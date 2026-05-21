import * as React from "react";
import type { Theme } from "@/lib/carousel/themes";
import type { PromptPackCardSlide } from "@/lib/carousel/types";
import { PP, Starburst } from "./promptpack-shared";

/**
 * Prompt-pack CARD — one named step. A starburst, a two-tone all-caps title,
 * and the actual Claude prompt shown inside a chat-window card (traffic
 * lights, "Prompt:" label, the prompt text, a Sonnet bar), then the tool
 * pills. This is the core "give away the real value" slide.
 */
export function PromptPackCard({
  slide,
}: {
  slide: PromptPackCardSlide;
  theme: Theme;
  handle: string;
}) {
  const W = 1080;
  const H = 1350;
  const n = slide.promptParagraphs.length;

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
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 70,
        paddingBottom: 70,
      }}
    >
      {/* Starburst */}
      <div style={{ display: "flex" }}>
        <Starburst size={60} />
      </div>

      {/* Title */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
          marginTop: 28,
          paddingLeft: 80,
          paddingRight: 80,
        }}
      >
        {slide.title.map((r, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              fontFamily: PP.serif,
              fontWeight: 700,
              fontSize: 60,
              letterSpacing: 1,
              lineHeight: 1.1,
              color: r.accent ? PP.orange : PP.ink,
            }}
          >
            {r.t}
          </div>
        ))}
      </div>

      {/* Chat-window card */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: 936,
          marginTop: 40,
          backgroundColor: PP.card,
          borderRadius: 30,
          border: `1px solid ${PP.cardBorder}`,
          padding: "38px 44px",
        }}
      >
        {/* Traffic lights */}
        <div style={{ display: "flex", flexDirection: "row", gap: 12 }}>
          <div
            style={{
              display: "flex",
              width: 17,
              height: 17,
              borderRadius: 999,
              backgroundColor: PP.dotRed,
            }}
          />
          <div
            style={{
              display: "flex",
              width: 17,
              height: 17,
              borderRadius: 999,
              backgroundColor: PP.dotYellow,
            }}
          />
          <div
            style={{
              display: "flex",
              width: 17,
              height: 17,
              borderRadius: 999,
              backgroundColor: PP.dotGreen,
            }}
          />
        </div>

        {/* Prompt label */}
        <div
          style={{
            display: "flex",
            fontFamily: PP.sans,
            fontWeight: 600,
            fontSize: 25,
            color: PP.orange,
            marginTop: 30,
          }}
        >
          Prompt:
        </div>

        {/* Prompt body */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            marginTop: 16,
          }}
        >
          {slide.promptParagraphs.map((p, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                fontFamily: PP.sans,
                fontSize: 28,
                lineHeight: 1.5,
                color: PP.ink,
              }}
            >
              {`${i === 0 ? "“" : ""}${p}${i === n - 1 ? "”" : ""}`}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 34,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 44,
              height: 44,
              borderRadius: 999,
              border: `1px solid ${PP.cardBorder}`,
              alignItems: "center",
              justifyContent: "center",
              fontFamily: PP.sans,
              fontSize: 30,
              color: PP.muted,
            }}
          >
            +
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#F4EFE5",
              borderRadius: 999,
              padding: "11px 20px",
              fontFamily: PP.sans,
              fontSize: 23,
              color: PP.inkSoft,
            }}
          >
            {slide.model ?? "Sonnet 4.6"}
          </div>
        </div>
      </div>

      {/* Tool pills */}
      {slide.pills && slide.pills.length > 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 14,
            marginTop: 32,
            paddingLeft: 70,
            paddingRight: 70,
          }}
        >
          {slide.pills.map((p, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                backgroundColor: PP.card,
                borderRadius: 999,
                border: `1px solid ${PP.cardBorder}`,
                padding: "13px 21px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: 13,
                  height: 13,
                  borderRadius: 4,
                  backgroundColor: PP.orange,
                }}
              />
              <div
                style={{
                  display: "flex",
                  fontFamily: PP.sans,
                  fontSize: 22,
                  color: PP.ink,
                }}
              >
                {p}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
