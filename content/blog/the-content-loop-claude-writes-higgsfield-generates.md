---
title: "The content loop: Claude writes, Higgsfield generates"
description: "The engine that turns an avatar and a persona into daily content without filming anything. The exact pipeline, the content-plan prompt, and how to write prompts that render clean."
date: "2026-05-21"
category: "ai_builder"
tags:
  - "content-automation"
  - "claude"
  - "higgsfield"
  - "ai-ugc"
keywords:
  - "AI content pipeline"
  - "Claude content prompts"
  - "Higgsfield"
  - "content automation"
  - "AI video workflow"
author: "Flowi Editorial"
image: "/images/posts/maya-ugc/step1.jpg"
---
You have a face that holds and a persona that gives it a mind. Now the engine — the loop that turns those two assets into content, every day, without you filming anything.

The loop has two halves. Claude is the writers' room. Higgsfield is the studio. Your job is the desk in between: you brief, you review, you post.

## The pipeline, end to end

One full cycle:

1. **Claude plans and writes.** Working from the persona doc, it produces the content plan — hooks, scripts, captions — and, critically, the *image and video prompts* for each piece.
2. **Higgsfield generates.** You take Claude's visual prompts into Higgsfield, paired with your Soul Character, and it renders the actual images and clips — the same face, in the scene Claude described.
3. **You review.** Approve, tweak, or reject. Rejections cost cents; bad posts cost reach.
4. **You post.** Or schedule. The cycle resets.

The leverage is that steps 1 and 2 scale almost for free. Briefing Claude for seven days of content takes the same effort as briefing it for one.

## The content-plan prompt

This is the workhorse. Give Claude the persona doc, then:

> "Using the persona above, plan 7 days of short-form content. For each day give me:
> - the content pillar it belongs to
> - a scroll-stopping hook (the first line / first two seconds)
> - a 20–30 second script in her voice
> - the caption, written to her tone
> - a detailed image-generation prompt for the visual — describe the scene, framing, lighting and mood; do NOT describe her face or identity
> Optimise for watch time, shares and saves. Vary the hooks — never reuse a hook pattern twice."

Note the instruction on the image-prompt line: *do not describe her face or identity.* That is deliberate — and skipping it is the most common mistake.

## How to write prompts Higgsfield renders well

The image prompt describes the **scene**. The Soul Character supplies the **person**. Keep those jobs separate.

A weak prompt: "a beautiful young woman with brown hair in a kitchen." You are now fighting your own Soul Character — re-describing a face the trained character already defines, which invites drift.

A strong prompt: "a bright modern kitchen, soft morning light through a window, she is mid-sentence holding a coffee mug, warm and candid, shot on 35mm, shallow depth of field." Scene, light, action, mood, camera. The character handles who she is; the prompt handles where she is and what is happening.

Three rules that hold up:

- **Always generate with the Soul Character attached.** Every single time. The consistency guarantee from Chapter 2 only works if you use it on every render.
- **Describe light and camera, not just objects.** "Soft window light, 35mm, shallow depth of field" is the difference between a render that looks like content and one that looks like a stock-photo generator.
- **One idea per image.** Cramming five elements into a prompt produces mush. Simple scene, executed cleanly.

## The review gate is not optional

Once the loop runs, it is tempting to auto-post. Do not.

AI generation has a failure rate. A hand reads wrong. The lighting jumps. An expression lands as uncanny. One bad image in a feed of good ones does disproportionate damage — it is the post that makes someone think "this is fake" about *everything* you have made.

So there is one human gate: you, looking at every render before it goes out. It takes minutes a day. It is the cheapest insurance in the system — and it is the part "fully automated" marketing quietly skips. Run the loop automated; keep the gate human.

That is the engine. Claude briefs, Higgsfield renders, you approve. In the final chapter: how to run this at volume, across more than one avatar, and how it actually makes money.
