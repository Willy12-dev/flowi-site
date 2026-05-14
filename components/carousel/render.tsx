/**
 * render.tsx — dispatcher. Maps a Slide to its template component.
 *
 * Used by the /api/carousel route (which wraps this in next/og's ImageResponse)
 * and by the studio preview (which renders into a normal DOM).
 */

import * as React from "react";
import type { Slide } from "@/lib/carousel/types";
import type { Theme } from "@/lib/carousel/themes";

import { Cover } from "./templates/Cover";
import { CodeBlock } from "./templates/CodeBlock";
import { NumberedCard } from "./templates/NumberedCard";
import { DataTable } from "./templates/DataTable";
import { Grid } from "./templates/Grid";
import { StatPoster } from "./templates/StatPoster";
import { Diagram } from "./templates/Diagram";
import { Quote } from "./templates/Quote";
import { Letter } from "./templates/Letter";
import { CtaOutro } from "./templates/CtaOutro";
import { Bullets } from "./templates/Bullets";
import { Definition } from "./templates/Definition";
import { Step } from "./templates/Step";
import { Stats } from "./templates/Stats";
import { Audience } from "./templates/Audience";
import { Compare } from "./templates/Compare";
import { HighlightCover } from "./templates/HighlightCover";
import { PromptCard } from "./templates/PromptCard";
import { Badge } from "./templates/Badge";
import { FakeTweet } from "./templates/FakeTweet";
import { PhotoFrame } from "./templates/PhotoFrame";
import { ResultsPoster } from "./templates/ResultsPoster";

export function renderSlide(
  slide: Slide,
  theme: Theme,
  handle: string
): React.ReactElement {
  switch (slide.type) {
    case "cover":
      return <Cover slide={slide} theme={theme} handle={handle} />;
    case "code":
      return <CodeBlock slide={slide} theme={theme} handle={handle} />;
    case "numbered":
      return <NumberedCard slide={slide} theme={theme} handle={handle} />;
    case "table":
      return <DataTable slide={slide} theme={theme} handle={handle} />;
    case "grid":
      return <Grid slide={slide} theme={theme} handle={handle} />;
    case "stat":
      return <StatPoster slide={slide} theme={theme} handle={handle} />;
    case "diagram":
      return <Diagram slide={slide} theme={theme} handle={handle} />;
    case "quote":
      return <Quote slide={slide} theme={theme} handle={handle} />;
    case "letter":
      return <Letter slide={slide} theme={theme} handle={handle} />;
    case "cta":
      return <CtaOutro slide={slide} theme={theme} handle={handle} />;
    case "bullets":
      return <Bullets slide={slide} theme={theme} handle={handle} />;
    case "definition":
      return <Definition slide={slide} theme={theme} handle={handle} />;
    case "step":
      return <Step slide={slide} theme={theme} handle={handle} />;
    case "stats":
      return <Stats slide={slide} theme={theme} handle={handle} />;
    case "audience":
      return <Audience slide={slide} theme={theme} handle={handle} />;
    case "compare":
      return <Compare slide={slide} theme={theme} handle={handle} />;
    case "highlight-cover":
      return <HighlightCover slide={slide} theme={theme} handle={handle} />;
    case "prompt-card":
      return <PromptCard slide={slide} theme={theme} handle={handle} />;
    case "badge":
      return <Badge slide={slide} theme={theme} handle={handle} />;
    case "fake-tweet":
      return <FakeTweet slide={slide} theme={theme} handle={handle} />;
    case "photo-frame":
      return <PhotoFrame slide={slide} theme={theme} handle={handle} />;
    case "results":
      return <ResultsPoster slide={slide} theme={theme} handle={handle} />;
  }
}
