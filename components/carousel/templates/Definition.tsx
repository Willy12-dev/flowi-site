import * as React from "react";
import { Frame } from "../Frame";
import type { Theme } from "@/lib/carousel/themes";
import type { DefinitionSlide } from "@/lib/carousel/types";

export function Definition({
  slide,
  theme,
  handle,
}: {
  slide: DefinitionSlide;
  theme: Theme;
  handle: string;
}) {
  return (
    <Frame theme={theme} index={slide.index} total={slide.total} handle={handle}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "center",
        }}
      >
        {slide.eyebrow && (
          <div
            style={{
              display: "flex",
              fontFamily: theme.fonts.mono,
              fontSize: 20,
              color: theme.accent,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 32,
            }}
          >
            {slide.eyebrow}
          </div>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            marginBottom: 32,
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: theme.fonts.display,
              fontSize: 96,
              fontWeight: 700,
              color: theme.ink,
              letterSpacing: "-0.025em",
              lineHeight: 1,
              marginRight: 18,
            }}
          >
            {slide.term}
          </div>
          {slide.partOfSpeech && (
            <div
              style={{
                display: "flex",
                fontFamily: theme.fonts.italic,
                fontStyle: "italic",
                fontSize: 38,
                color: theme.accent,
              }}
            >
              {slide.partOfSpeech}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: theme.fonts.body,
            fontSize: 30,
            lineHeight: 1.45,
            color: theme.inkSoft,
            maxWidth: 880,
            marginBottom: 32,
          }}
        >
          {slide.definition}
        </div>

        {slide.example && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              borderLeft: `3px solid ${theme.accent}`,
              paddingLeft: 24,
              fontFamily: theme.fonts.italic,
              fontStyle: "italic",
              fontSize: 26,
              lineHeight: 1.4,
              color: theme.inkSoft,
              maxWidth: 820,
            }}
          >
            <div style={{ display: "flex" }}>{`"${slide.example}"`}</div>
          </div>
        )}
      </div>
    </Frame>
  );
}
