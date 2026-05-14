import * as React from "react";
import { Frame } from "../Frame";
import type { Theme } from "@/lib/carousel/themes";
import type { DiagramSlide } from "@/lib/carousel/types";

export function Diagram({
  slide,
  theme,
  handle,
}: {
  slide: DiagramSlide;
  theme: Theme;
  handle: string;
}) {
  return (
    <Frame theme={theme} index={slide.index} total={slide.total} handle={handle}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontFamily: theme.fonts.display,
            fontSize: 64,
            lineHeight: 1.05,
            color: theme.ink,
            letterSpacing: "-0.02em",
            fontWeight: 700,
            marginBottom: 48,
          }}
        >
          <div style={{ display: "flex" }}>{slide.title}</div>
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

        <div
          style={{
            display: "flex",
            flex: 1,
            gap: 24,
          }}
        >
          {slide.tiers.map((tier, ti) => (
            <div
              key={ti}
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                backgroundColor: theme.card,
                borderRadius: 14,
                padding: 28,
                border: `1px solid ${theme.rule}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontFamily: theme.fonts.mono,
                  fontSize: 18,
                  color: theme.accent,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 24,
                }}
              >
                {tier.label}
              </div>
              {tier.nodes.map((node, ni) => (
                <div
                  key={ni}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginBottom: 18,
                    paddingBottom: 14,
                    borderBottom:
                      ni === tier.nodes.length - 1
                        ? "none"
                        : `1px dashed ${theme.rule}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      fontFamily: theme.fonts.body,
                      fontSize: 24,
                      color: theme.cardInk,
                      fontWeight: 600,
                      marginBottom: node.sub ? 6 : 0,
                    }}
                  >
                    {node.title}
                  </div>
                  {node.sub && (
                    <div
                      style={{
                        display: "flex",
                        fontFamily: theme.fonts.body,
                        fontSize: 18,
                        color: theme.muted,
                        lineHeight: 1.35,
                      }}
                    >
                      {node.sub}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {slide.footer && (
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontFamily: theme.fonts.body,
              fontSize: 22,
              color: theme.muted,
              fontStyle: "italic",
            }}
          >
            {slide.footer}
          </div>
        )}
      </div>
    </Frame>
  );
}
