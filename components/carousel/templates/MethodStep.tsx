import * as React from "react";
import type { Theme } from "@/lib/carousel/themes";
import type { MethodStepSlide } from "@/lib/carousel/types";
import { MM, Sparkle, Check, runColor, mabs } from "./method-shared";

/**
 * Method STEP — white paper. A "STEP N" pill, a heavy all-caps headline with
 * an accent run, optional intro line, green-checkmark bullets, a light-green
 * callout, and an optional persona photo on the right.
 */
export function MethodStep({
  slide,
}: {
  slide: MethodStepSlide;
  theme: Theme;
  handle: string;
}) {
  const W = 1080;
  const H = 1350;
  const hasPhoto = Boolean(slide.photo);
  const PHOTO = 560;

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
        justifyContent: "center",
      }}
    >
      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          paddingLeft: 78,
          paddingRight: 78,
          width: hasPhoto ? 620 : 940,
        }}
      >
        {/* Step pill */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 11,
            backgroundColor: MM.tintGreen,
            borderRadius: 999,
            padding: "11px 22px",
            alignSelf: "flex-start",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: 1.5,
              color: MM.ink,
            }}
          >
            {slide.stepLabel.toUpperCase()}
          </div>
          <div
            style={{
              display: "flex",
              width: 14,
              height: 14,
              borderRadius: 999,
              backgroundColor: MM.green,
            }}
          />
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: 24 }}>
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
                    fontSize: 88,
                    fontWeight: 800,
                    lineHeight: 1.04,
                    letterSpacing: -2,
                    color: runColor(r.accent),
                  }}
                >
                  {r.t}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Intro */}
        {slide.intro ? (
          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontSize: 30,
              fontWeight: 500,
              lineHeight: 1.4,
              color: MM.inkSoft,
              maxWidth: 620,
            }}
          >
            {slide.intro}
          </div>
        ) : null}

        {/* Bullets */}
        {slide.bullets && slide.bullets.length > 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              marginTop: 26,
            }}
          >
            {slide.bullets.map((b, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <Check d={34} />
                <div
                  style={{
                    display: "flex",
                    fontSize: 30,
                    fontWeight: 600,
                    color: MM.ink,
                    maxWidth: hasPhoto ? 500 : 760,
                  }}
                >
                  {b}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {/* Callout */}
        {slide.callout ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 18,
              marginTop: 30,
              backgroundColor: MM.tintGreen,
              borderRadius: 22,
              padding: "26px 28px",
              maxWidth: hasPhoto ? 600 : 780,
            }}
          >
            <Sparkle size={32} color={MM.green} />
            <div
              style={{
                display: "flex",
                fontSize: 27,
                fontWeight: 600,
                lineHeight: 1.4,
                color: MM.ink,
              }}
            >
              {slide.callout}
            </div>
          </div>
        ) : null}
      </div>

      {/* Persona photo */}
      {hasPhoto && slide.photo ? (
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
              height: 200,
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
