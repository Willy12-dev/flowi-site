import * as React from "react";
import { Frame } from "../Frame";
import type { Theme } from "@/lib/carousel/themes";
import type { DataTableSlide } from "@/lib/carousel/types";

export function DataTable({
  slide,
  theme,
  handle,
}: {
  slide: DataTableSlide;
  theme: Theme;
  handle: string;
}) {
  return (
    <Frame theme={theme} index={slide.index} total={slide.total} handle={handle}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        {slide.eyebrow && (
          <div
            style={{
              display: "flex",
              fontFamily: theme.fonts.mono,
              fontSize: 20,
              color: theme.accent,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 24,
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
            fontSize: 84,
            lineHeight: 1.02,
            color: theme.ink,
            letterSpacing: "-0.025em",
            fontWeight: 700,
            marginBottom: 56,
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
            flexDirection: "column",
            backgroundColor: theme.card,
            borderRadius: 14,
            padding: "32px 36px",
            border: `1px solid ${theme.rule}`,
          }}
        >
          {/* Column headers */}
          <div
            style={{
              display: "flex",
              fontFamily: theme.fonts.mono,
              fontSize: 16,
              color: theme.muted,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              paddingBottom: 16,
              borderBottom: `1px solid ${theme.rule}`,
            }}
          >
            <div style={{ display: "flex", flex: 1 }}>
              {slide.columns.label}
            </div>
            <div style={{ display: "flex" }}>{slide.columns.metric}</div>
          </div>

          {/* Rows */}
          {slide.rows.map((row, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                fontFamily: theme.fonts.body,
                fontSize: 26,
                color: theme.cardInk,
                paddingTop: 20,
                paddingBottom: 20,
                borderBottom:
                  i === slide.rows.length - 1
                    ? "none"
                    : `1px solid ${theme.rule}`,
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontFamily: theme.fonts.mono,
                  fontSize: 20,
                  color: theme.muted,
                  marginRight: 24,
                  width: 50,
                }}
              >
                {row.index}
              </div>
              <div style={{ display: "flex", flex: 1 }}>{row.label}</div>
              <div
                style={{
                  display: "flex",
                  fontFamily: theme.fonts.mono,
                  fontSize: 26,
                  color: theme.accent,
                  fontWeight: 600,
                }}
              >
                {row.metric}
              </div>
            </div>
          ))}
        </div>

        {slide.footer && (
          <div
            style={{
              display: "flex",
              marginTop: 32,
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
