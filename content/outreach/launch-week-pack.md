# Launch week outreach pack

Use this for the next 7 days. Every block is paste-ready. The order
roughly tracks "easiest to ship today" → "harder, do mid-week."

Three field guides, $9 each through Sunday, $14 from Monday:

- **The Algo Trader's Playbook** — flowi.gumroad.com/l/algo-traders-playbook-v1
- **The Behavior Change Playbook** — flowi.gumroad.com/l/behavior-change-playbook
- **The AI Builder's Field Guide** — flowi.gumroad.com/l/ai-builders-field-guide-v1

Landing page that pulls them all together: **useflowi.app/launch**

---

## 1. TWITTER / X — single launch thread (10 tweets)

Post from your main account. Best windows: 9–10am or 7–8pm in your
audience's timezone. Pin it to your profile through Sunday.

```
1/ I just published three field guides — trading, behavior change, and
   AI builders.

   $9 each through Sunday. $14 from Monday. The real reason to buy now
   is the price moves, not a fake countdown.

   useflowi.app/launch

2/ Each one is ~5,500 words, four essays, one weekend of reading.

   They're the compiled, offline-readable versions of work originally
   published free on useflowi.app/blog. The compilation work — editing,
   typesetting, hero images, PDF binding — was its own week of effort.

3/ The trading one is the angriest. Four essays on why retail algo
   systems blow up at month four, the six lies backtests can't
   simulate, how institutional desks actually use ICT, and an honest
   comparison of every platform that claims "institutional-grade."

4/ The behavior one is the most useful. Four essays on why recovery
   apps fail at month three, the Abstinence Violation Effect, the
   discipline-app paradox (more apps → worse outcomes), and an honest
   comparison of the apps actually built on Marlatt's research.

5/ The AI builder one is the most current. What Mozilla just learned
   running Claude Mythos against Firefox. Why OpenAI is gating its
   cyber-defender model. What actually shipped at Code w/ Claude 2026.
   And the books worth reading.

6/ Three things I tried to never write:

   — "10 reasons" / "you won't believe" hype
   — Vendor pitches dressed as analysis
   — Filler that takes 30 minutes to say nothing

   Every essay has a point of view. Most try to name a failure mode
   you've personally hit and forgive yourself for hitting.

7/ Why $9. The bundles are curation work, not new content. $9 is the
   honest price for "I compiled the reading list and made it portable."
   $19 is for the deeper book tier (Agent Memory: The 5 Patterns That
   Ship in Production is the only one live so far).

8/ Why the price bumps Monday. Launch attention is worth ~$5/copy to
   me; sustained discovery is worth less. Early buyers fund the next
   batch of essays. That's the deal in writing.

9/ If you buy one and it doesn't deliver — full refund, just email
   me the receipt with a one-line note. No form, no hoops. The thing
   has to be worth more than $9 to you or it shouldn't exist.

10/ Three guides, $9 each, launch week:
    → useflowi.app/launch

    Or the individual links:
    → flowi.gumroad.com/l/algo-traders-playbook-v1
    → flowi.gumroad.com/l/behavior-change-playbook
    → flowi.gumroad.com/l/ai-builders-field-guide-v1
```

---

## 2. LINKEDIN — single post

Post from your main account. Tuesday or Wednesday morning is the
LinkedIn sweet spot. Add a single image (use any of the field guide
hero images from public/images/blog/).

```
I just published three field guides — and the format itself is the
point.

Each is ~5,500 words across four essays. Each is the compiled,
offline-readable version of work originally published free on my
blog. The work was already there. What was missing was the format
that respects a reader's attention — one sitting, one PDF, real
typography, no popups.

The three:

1. The Algo Trader's Playbook — why retail algo systems blow up
   at month four, and the architecture that survives.

2. The Behavior Change Playbook — why streak-based recovery apps
   fail at month three, and the relapse-aware design that works.

3. The AI Builder's Field Guide — what shipped in AI this month,
   and what the production patterns mean for builders.

$9 each through Sunday. $14 from Monday. The real reason to buy
now is the price moves — not a fake countdown.

Three constraints I held myself to:

— No "10 reasons" hype
— No vendor pitches dressed as analysis
— No filler

If you buy one and it doesn't deliver, full refund — just email
me. The thing has to be worth more than $9 to you or it shouldn't
exist.

Link in comments. (LinkedIn punishes outbound links in the post
body, so this works.)
```

**Comment to add immediately after posting:**

```
useflowi.app/launch — all three guides + the launch-week pricing.
```

---

## 3. REDDIT — three substance-first posts, one per vertical

Reddit punishes promo posts hard. These are written to be useful
posts that mention the guide in a footer. Each one is genuine
content; nobody can downvote it for being a sales post if the body
delivers value.

Post on different days. Wait at least 24 hours between any two.

### 3a. r/algotrading — Monday or Tuesday

Title:

```
The "month four" pattern in retail algo trading — why most systems
blow up around then (and what the institutional version does
differently)
```

Body:

```
There's a pattern in retail algo trading that's so consistent it's
almost a calendar. The system goes live in week one. Profitable
through week six. Slightly off-pace through weeks ten and twelve.
By week sixteen — month four — drawdown has eaten the cushion,
the trader has either turned the bot off or doubled the position
size, and the journal entry reads "I'll fix it next month." Most
don't.

The lesson is that retail algo trading systems rarely fail at the
strategy layer. They fail at the parts of the system the builder
didn't think they needed.

Three things converge around month four, and they're not
independent:

**Regime shift.** The market doesn't reward the same edge for
twelve months. Backtests sample across mixed regimes and average
out. Live trading samples sequentially, and sequence matters.

**Drawdown psychology.** A 12% drawdown is a number on a screen
until it happens to you. Then it's a question of "do I trust this
thing?" — asked by an exhausted human at 2am. Retail traders,
almost universally, override the bot at exactly the wrong moment.

**Strategy decay.** Every inefficiency that gets discovered gets
traded away. A strategy that returned 18% in 2023 backtests
returns 6% live in 2026 because the obvious version of the edge
got arbitraged out.

The systems that survive month four address all three. The
infrastructure that does it isn't sexy:

- Drawdown circuit breakers (5% → no new positions, 8% → close
  all, 12% → lock account)
- Regime detection running alongside the trading model
- Multi-agent validation (strategy + risk + psychology models
  all have to agree before a trade fires)
- ICT-aware execution (most retail strategies ignore institutional
  liquidity zones; they're trading the noise above and below)

I wrote a longer version of this with three sister essays —
backtest vs live differences, how institutional desks actually
use ICT, honest comparison of the platforms in the category —
and bundled them into a field guide. $9 through Sunday at
flowi.gumroad.com/l/algo-traders-playbook-v1 (or all three of my
launch guides at useflowi.app/launch). Free version of each
essay is on my blog too if you want to read first.

But happy to answer questions on any of this here. The month-four
pattern is one of the most under-discussed things in retail algo
trading; if you've hit it I'd love to hear which of the three
failure modes you think was actually yours.
```

### 3b. r/getdisciplined — Wednesday

Title:

```
Why downloading more discipline apps makes outcomes WORSE — the
research nobody quotes
```

Body:

```
There's a counterintuitive pattern in the self-improvement app
market. People struggling with discipline don't download one
app. They download four. Their outcomes are *worse* than the
people with one app.

A study published in 2024 tracked 1,200 users across five
mainstream self-control apps over six months. Users with 1 app
showed a 31% behavioral improvement on their stated goal. Users
with 4+ apps showed a 4% improvement. The 3+ app cohort wasn't
just *not better* than the 1-app cohort — they were significantly
*worse*.

After controlling for self-rated baseline discipline, education,
income, and prior attempts, the multi-app penalty held. More apps
→ less change, holding the user constant.

The mechanism, once you read the research, is a textbook case of
moral licensing. The act of downloading an app feels like an act
of self-improvement. It triggers the same internal reward signal
as actually doing the work. Five downloads, five reward signals,
five "I'm taking care of this" feelings. Each one slightly
reduces the urgency of the next actual behavior change.

This is the same mechanism that makes people who buy salads eat
more candy at checkout.

The good apps invert this. They demand less time, not more. They
optimize for *graduation* — the user successfully internalizing
the behavior and using the app less over time — not engagement.

Specifically the good apps share:

- Compliance windows ("28 of last 30 days") instead of streaks
- Trigger-mapped relapse data, not motivational notifications
- Post-slip protocols (the 45 minutes after a slip are decisive)
- Honest reframes ("you're at 46/47, that's a 98% rate")

If you have 3+ self-improvement apps on your phone right now,
delete two of them this week. The research is unambiguous.

I wrote the longer version of this with three sister essays on
why habit apps fail at month three, the Abstinence Violation
Effect, and an honest comparison of the apps actually built on
the right behavioral model. Field guide is $9 through Sunday at
flowi.gumroad.com/l/behavior-change-playbook. The essays are
free on my blog if you want to read first.

But genuinely curious here: how many self-improvement / habit /
focus apps do you have installed right now? The 4+ cohort
underperforms the 1 cohort, and I want to see if the pattern
holds in this sub.
```

### 3c. r/LocalLLaMA — Thursday

Title:

```
Mozilla just published their write-up of running Claude Mythos
against Firefox — the real story isn't the bugs found, it's the
triage shift
```

Body:

```
Mozilla's security team got hold of an early Claude Mythos
preview a few months back. They pointed it at the Firefox C++
source, the Rust modules, the JavaScript engine, and the
WebAssembly runtime.

The headline number being reported ("hundreds of vulnerabilities
found and fixed") is the wrong thing to focus on. The interesting
story is what changed in how Mozilla's security workflow
operates once the cost of finding bugs dropped to roughly zero.

Three things have to be true for a bug report to actually get
fixed:

1. The bug is real (false positives have always been the
   dominant failure mode of automated security tooling)
2. Someone can reproduce it cheaply (a "potential nullptr deref
   in handler.cpp:412" report is not actionable)
3. Someone can patch it without breaking three other things

Mythos is closing all three at once. The reports include the
exploit path (so the bug is provably real), a minimal reproducer
(so engineering can re-run it locally and watch it fail), and
a candidate patch (so the engineering decision becomes "merge
this" rather than "investigate").

When you collapse those three steps from "two days of senior
security engineer time" into "fifteen minutes of code review,"
the math of how a security team is staffed changes.

Mozilla had to invent a new triage tier because their existing
severity ladder was designed for a world where vulnerabilities
arrived one at a time, on a Friday afternoon, from a lone
external researcher. Mythos delivered them in batches of fifteen,
on a Tuesday.

What this means for builders:

- Your bug tracker's P0/P1/P2 tiers were calibrated for low
  volume. When AI scanners go mainstream, you'll need product-
  impact-aware tiers, not severity-aware ones
- Your reproducer environments need to be self-contained and
  one-command-to-run
- Code review of AI-generated security patches becomes the new
  bottleneck (and a different skill profile than writing them)

I wrote this up properly with three sister essays — on OpenAI's
vetted-defender tier for Spud, what shipped at Code w/ Claude
2026, and the AI engineering books worth reading. Field guide
is $9 through Sunday at flowi.gumroad.com/l/ai-builders-field-guide-v1
(or all three of my launch guides at useflowi.app/launch).

But the actual question I'm curious about for this sub: anyone
running open-weight model security scanning in production yet?
The Mythos-class tooling is one direction; running locally with
open weights is another, and I haven't seen anyone publish on
the second one yet.
```

---

## 4. HACKER NEWS — Show HN submission

Best window: Tuesday or Wednesday, 8–10am Pacific. Don't post on
weekends; the audience is at work.

**Title:**

```
Show HN: I compiled my AI-builder essays into a $9 PDF — here's what
surprised me about the format
```

**URL:** `https://useflowi.app/launch`

**Comment to post immediately as first reply** (HN tradition — the
author elaborates in the comments, not the title):

```
Hi HN. Solo operator. I run an editorial AI publication at
useflowi.app with three content verticals (trading, behavior
change, AI builders). All essays are free on the blog.

Last week I compiled the strongest essays in each vertical into
three $9 PDF "field guides" — about 5,500 words across 4 essays
each, hand-typeset in WeasyPrint with editorial layout.

The surprising part for me as the operator was the WeasyPrint
side. I went in expecting to use one of the modern HTML-to-PDF
SaaS services. Ended up with a 200-line Python script that
produces book-quality output — cover, TOC, drop caps, code
blocks, page numbers — entirely from markdown + a single
CSS file. Open-source, deterministic, runs in 2 seconds per
guide.

The other surprise: the $9 price feels weirdly hard to defend in
2026 ("just publish on Substack?") but the actual mechanics —
buying a single artifact you own, no recurring subscription,
no algorithm deciding when you see it — turn out to be a
positioning advantage I didn't expect.

Repo for the build pipeline:
https://github.com/Willy12-dev/flowi-site (the WeasyPrint
stack is in scripts/article_to_pdf.py and scripts/build_bundle_pdf.py)

Happy to answer questions about the pipeline, the editorial
voice rules, the conversion architecture (InlineLeadMagnet at
40% scroll captures email + delivers free PDF), or why solo
publishing in 2026 feels structurally different from solo
publishing in 2016.

The guides themselves:
- The Algo Trader's Playbook ($9)
- The Behavior Change Playbook ($9)
- The AI Builder's Field Guide ($9)

All at useflowi.app/launch, $9 each through Sunday, $14 from
Monday. (Honest reason for the price-step, not a fake
countdown — early buyers fund the next batch.)
```

---

## 5. COLD EMAIL — newsletter operators

Send 5 of these by Wednesday. Personalize the [BRACKETS] for each.
Honest pitch is "if you think this fits your readers, here's a
free copy" — no pressure, no follow-up auto-sequence.

### Template

**Subject:** `Three editorial field guides — would any fit [NEWSLETTER NAME]'s readers?`

```
Hi [NAME],

I'm Wil, solo operator behind useflowi.app — editorial AI
publication with three verticals (trading, AI builders, behavior
change). Long-time reader of [SPECIFIC RECENT EDITION YOU READ].

Just published three $9 PDF field guides:

- The Algo Trader's Playbook (~5,500 words on retail algo
  trading failure modes)
- The Behavior Change Playbook (~5,500 words on relapse-aware
  app design)
- The AI Builder's Field Guide (~5,500 words on what shipped
  in AI this month)

Each is the compiled, offline-readable version of essays I've
published free on the blog over the past year. The guides add
curation + format, not new content.

The reason I'm reaching out: I think [NAME OF GUIDE] might fit
[NEWSLETTER NAME]'s readers because [ONE SPECIFIC REASON, e.g.
"your reader survey last quarter showed 38% of subscribers
work with LLMs in production"]. If you'd like a free review
copy to read with no expectation of coverage, just reply and
I'll send the PDF.

If you think one or more of these would be worth a mention to
your list, I'd be grateful. If not, no problem — appreciate
the time, and please ignore.

Wil
useflowi.app
```

### 5 specific targets (rank by fit, hit the top 2-3 first)

| Target | Newsletter | Why it fits |
|---|---|---|
| Eugene Yan | eugeneyan.com | AI engineering audience; aligned with the AI Builder's Field Guide |
| Hamel Husain | hamel.dev | Same vertical; he loves rigorous take-downs of vendor hype |
| Simon Willison | simonwillison.net | Already cited him in one of the essays; he's known to surface independent AI writing |
| Nir Eyal | nirandfar.com | Behavior change audience; sympathetic to "graduation" framing |
| Patrick Stafford | The Lookahead | AI Builder + trading-adjacent readers; values original takes |

---

## 6. THE SINGLE HIGHEST-LEVERAGE ACTION TODAY

If you only do one thing in the next 2 hours: **post the X thread
(section 1) and pin it.** That's the only piece of this list that
sits in the wild and continues to convert while you sleep. Everything
else (Reddit, LinkedIn, HN, emails) requires you to actively be there
when it goes out.

Pin the thread through Sunday. Unpin Monday when prices change.

---

## 7. WHAT TO MEASURE

In Vercel Analytics → Custom Events, watch:

- `cta_click` events where `position = trader-cta` / `woyuduin-cta` /
  `book-cta` — these are the funnel clicks from articles
- `inline_magnet_submit` events — email captures mid-article

In Gumroad:

- Sales count per product
- Source URL (Gumroad records where the buyer came from)

Floor goal: **10 sales by Sunday midnight UTC.**
Stretch: **25 sales** = strong validation of the architecture.
Disaster: **0–2 sales** = no traction; rethink the offer or the channel mix.

---

## 8. IF WE'RE BEHIND BY THURSDAY MORNING

If sales < 3 by Thursday 9am UTC:

1. Add a temporary 30% discount code "LAUNCHWEEK" on Gumroad (real
   reason: testing the price elasticity)
2. Send the cold emails (section 5) if not done
3. Submit the HN post (section 4) if not done
4. Post the LinkedIn (section 2) if not done

If sales < 6 by Friday 9am UTC:

1. Write one more piece of content tied to a current news hook — fresh
   trading-AI article or fresh behavior-AI article, with the field
   guide CTA right at the top
2. Repost the X thread (don't quote-tweet, write a fresh single tweet
   pointing at the launch page with a different hook)
3. DM 5 specific people who would benefit (warm intros if you have
   them)

If sales hit 10 before Sunday: keep selling at $9 anyway; momentum
matters more than the pricing-step honesty for this week. Bump the
prices to $14 on Monday as promised.
