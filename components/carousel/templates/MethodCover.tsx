import * as React from "react";
import type { Theme } from "@/lib/carousel/themes";
import type { MethodCoverSlide } from "@/lib/carousel/types";
import { MM, Sparkle, runColor, mabs } from "./method-shared";
import { Starburst } from "./promptpack-shared";

/**
 * Method COVER — white paper, bold left-aligned headline with Claude-orange /
 * Higgsfield-green accent runs, the two app icons top-right, result pills, a
 * "here are the steps" cue, and the persona photo emerging bottom-right.
 */
export function MethodCover({
  slide,
}: {
  slide: MethodCoverSlide;
  theme: Theme;
  handle: string;
}) {
  const W = 1080;
  const H = 1350;
  const PHOTO = 680;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: W,
        height: H,
        backgroundColor: MM.paper,
        position: "relative",
        fontFamily: MM.sans,
      }}
    >
      {/* App icons */}
      <div
        style={{
          position: "absolute",
          top: 58,
          right: 66,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            width: 62,
            height: 62,
            borderRadius: 16,
            backgroundColor: MM.orange,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Starburst size={32} color="#FFFFFF" thickness={3.6} />
        </div>
        <div style={{ display: "flex", fontSize: 34, fontWeight: 800, color: MM.muted }}>
          +
        </div>
        <div
          style={{
            display: "flex",
            width: 62,
            height: 62,
            borderRadius: 16,
            backgroundColor: MM.green,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Sparkle size={30} color="#FFFFFF" />
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          position: "absolute",
          top: 138,
          left: 74,
          width: 884,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {slide.headline.map((line, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 16,
              }}
            >
              {line.map((r, j) => (
                <div
                  key={j}
                  style={{
                    display: "flex",
                    fontSize: 82,
                    fontWeight: 800,
                    lineHeight: 1.12,
                    letterSpacing: -1.8,
                    color: runColor(r.accent),
                  }}
                >
                  {r.t}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Pills + steps cue */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 36,
            gap: 18,
          }}
        >
          {(slide.pills ?? []).map((p, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                backgroundColor: MM.tintGreen,
                borderRadius: 999,
                padding: "13px 24px",
                alignSelf: "flex-start",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: 14,
                  height: 14,
                  borderRadius: 999,
                  backgroundColor: MM.green,
                }}
              />
              <div
                style={{
                  display: "flex",
                  fontSize: 23,
                  fontWeight: 700,
                  letterSpacing: 0.4,
                  color: MM.ink,
                }}
              >
                {p}
              </div>
            </div>
          ))}
          {slide.stepsCue ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 27,
                  fontWeight: 600,
                  color: MM.inkSoft,
                }}
              >
                {slide.stepsCue}
              </div>
              <div style={{ display: "flex", fontSize: 30, color: MM.green }}>→</div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Persona photo */}
      {slide.photo ? (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: PHOTO,
            height: PHOTO,
            display: "flex",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mabs(slide.photo)}
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
              height: 210,
              backgroundImage:
                "linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 180,
              height: PHOTO,
              backgroundImage:
                "linear-gradient(90deg, #FFFFFF 0%, rgba(255,255,255,0) 100%)",
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
