import * as React from "react";
import type { Theme } from "@/lib/carousel/themes";
import type { PromptPackCoverSlide } from "@/lib/carousel/types";
import { PP, Starburst, abs, pad } from "./promptpack-shared";

/**
 * Prompt-pack COVER — result-led hook. Logo badge, a multi-line headline with
 * accent runs and an optional "Result?" divider, a stat strip, a white value
 * pill, and the persona photo emerging from the cream at the bottom.
 */
export function PromptPackCover({
  slide,
}: {
  slide: PromptPackCoverSlide;
  theme: Theme;
  handle: string;
}) {
  const W = 1080;
  const H = 1350;
  const PHOTO = 520;

  // Stat strip children, built flat so there are no React.Fragment wrappers.
  const statNodes: React.ReactNode[] = [];
  (slide.stats ?? []).forEach((s, i) => {
    if (i > 0) {
      statNodes.push(
        <div
          key={`div${i}`}
          style={{
            display: "flex",
            width: 1,
            height: 86,
            backgroundColor: PP.cardBorder,
          }}
        />
      );
    }
    statNodes.push(
      <div
        key={`s${i}`}
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
            fontSize: 66,
            lineHeight: 1,
            color: PP.orange,
          }}
        >
          {s.value}
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: PP.sans,
            fontSize: 24,
            color: PP.ink,
            marginTop: 8,
          }}
        >
          {s.label}
        </div>
        {s.sub ? (
          <div
            style={{
              display: "flex",
              fontFamily: PP.sans,
              fontSize: 19,
              color: PP.muted,
              marginTop: 3,
            }}
          >
            {s.sub}
          </div>
        ) : null}
      </div>
    );
  });

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
      }}
    >
      {/* Top bar: page counter + bookmark */}
      <div
        style={{
          position: "absolute",
          top: 54,
          left: 66,
          right: 66,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: PP.mono,
            fontSize: 22,
            letterSpacing: 2,
            color: PP.muted,
          }}
        >
          {`${pad(slide.index)} / ${pad(slide.total)}`}
        </div>
        <div style={{ display: "flex", position: "relative", width: 26, height: 34 }}>
          <div
            style={{
              display: "flex",
              width: 26,
              height: 34,
              borderRadius: 3,
              backgroundColor: PP.orange,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -11,
              left: 3,
              width: 20,
              height: 20,
              backgroundColor: PP.paper,
              transform: "rotate(45deg)",
            }}
          />
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 112,
          paddingLeft: 70,
          paddingRight: 70,
        }}
      >
        {/* Logo badge */}
        <div
          style={{
            display: "flex",
            width: 74,
            height: 74,
            borderRadius: 20,
            backgroundColor: PP.orange,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 28,
          }}
        >
          <Starburst size={38} color="#FFFFFF" thickness={4} />
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {slide.headline.map((line, i) => {
            if ("divider" in line) {
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 14,
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      width: 90,
                      height: 2,
                      backgroundColor: PP.muted,
                      marginRight: 22,
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      fontFamily: PP.serif,
                      fontWeight: 700,
                      fontSize: 38,
                      color: PP.ink,
                    }}
                  >
                    {line.divider}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      width: 90,
                      height: 2,
                      backgroundColor: PP.muted,
                      marginLeft: 22,
                    }}
                  />
                </div>
              );
            }
            const big = line.size !== "sm";
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: big ? 16 : 10,
                }}
              >
                {line.runs.map((r, j) => (
                  <div
                    key={j}
                    style={{
                      display: "flex",
                      fontFamily: PP.serif,
                      fontWeight: 700,
                      fontSize: big ? 86 : 42,
                      lineHeight: 1.06,
                      color: r.accent ? PP.orange : PP.ink,
                    }}
                  >
                    {r.t}
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Stat strip */}
        {statNodes.length > 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 38,
              marginTop: 34,
            }}
          >
            {statNodes}
          </div>
        ) : null}

        {/* Value pill */}
        {slide.pill ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 16,
              marginTop: 32,
              backgroundColor: PP.card,
              borderRadius: 999,
              border: `1px solid ${PP.cardBorder}`,
              padding: "19px 30px",
            }}
          >
            <div
              style={{
                display: "flex",
                width: 30,
                height: 30,
                borderRadius: 8,
                backgroundColor: "#FBEADF",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: 13,
                  height: 13,
                  borderRadius: 3,
                  border: `2px solid ${PP.orange}`,
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                fontFamily: PP.serif,
                fontWeight: 700,
                fontSize: 30,
                color: PP.ink,
              }}
            >
              {slide.pill}
            </div>
            <div
              style={{
                display: "flex",
                fontFamily: PP.sans,
                fontSize: 28,
                color: PP.orange,
              }}
            >
              →
            </div>
          </div>
        ) : null}
      </div>

      {/* Persona photo emerging from the cream */}
      {slide.photo ? (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: (W - PHOTO) / 2,
            width: PHOTO,
            height: PHOTO,
            display: "flex",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={abs(slide.photo)}
            alt=""
            width={PHOTO}
            height={PHOTO}
            style={{ width: PHOTO, height: PHOTO, objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: PHOTO,
              height: 170,
              backgroundImage: `linear-gradient(180deg, ${PP.paper} 0%, rgba(247,242,233,0) 100%)`,
            }}
          />
        </div>
      ) : null}

      {/* Swipe */}
      <div
        style={{
          position: "absolute",
          bottom: 54,
          right: 66,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: PP.mono,
            fontSize: 22,
            letterSpacing: 2,
            color: PP.muted,
          }}
        >
          SWIPE
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: PP.sans,
            fontSize: 24,
            color: PP.muted,
          }}
        >
          →
        </div>
      </div>
    </div>
  );
}
