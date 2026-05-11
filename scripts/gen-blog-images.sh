#!/usr/bin/env bash
# Generate editorial hero images for the 9 most recent articles via Pollinations.ai
# Style: editorial illustration, warm paper, single red accent, hand-drawn line art.

set -u
mkdir -p public/images/blog

declare -A PROMPTS=(
  [claude-mythos-found-firefox-bugs-the-real-story-is-the-triage]="minimalist editorial illustration, magnifying glass scrutinizing highlighted source code text, warm cream paper background, single red accent on magnifying glass rim, newsprint texture, hand-drawn line art, no gradients, no glassmorphism, editorial style"
  [openai-spud-gpt-5-5-cyber-defenders-rollout]="minimalist editorial illustration, antique steel vault door with binary code seam pattern, warm cream paper background, single red accent on the lock dial, newsprint texture, hand-drawn line art, no gradients, editorial publication style"
  [code-with-claude-2026-what-actually-shipped]="minimalist editorial illustration, branching tree diagram of code lines spawning smaller sub-branches each producing structured output, warm cream paper background, single red accent on the root node, hand-drawn line art, editorial style"
  [why-retail-algo-trading-systems-fail-at-month-four]="minimalist editorial illustration, hand-drawn financial equity curve climbing then sharply breaking down around the fourth time-marker, warm cream paper background, single red accent on the breakdown segment, newsprint texture, no gradients, editorial style"
  [why-habit-tracker-apps-dont-survive-the-third-month]="minimalist editorial illustration, calendar grid where checkmarks gradually fade and turn into slashes across the third month, warm cream paper background, single red accent on one critical missed day, hand-drawn line art, no gradients"
  [ai-trading-bots-beat-backtests-but-break-in-live]="minimalist editorial illustration, two side-by-side trading charts, the left smooth and ascending, the right jagged and underperforming, warm cream paper background, single red accent at the divergence, hand-drawn line art, editorial style"
  [the-discipline-app-paradox-why-downloading-more-doesnt-help]="minimalist editorial illustration, sketch of a phone home screen densely packed with self-improvement app icons of various styles, warm cream paper background, single red accent on one app, hand-drawn line art, no gradients"
  [how-institutional-desks-use-ict-where-retail-tools-fall-short]="minimalist editorial illustration, three stacked candlestick price charts at different timeframes connected by alignment lines, warm cream paper background, single red accent on a key convergence zone, hand-drawn line art"
  [what-every-recovery-app-gets-wrong-about-relapse]="minimalist editorial illustration, hand-drawn winding path with occasional dips and recoveries trending steadily upward over time, warm cream paper background, single red accent on a recovery upswing, no gradients, editorial style"
  [best-institutional-grade-trading-platforms-for-independent-traders]="minimalist editorial illustration, six trading workstation icons arranged in a sparse grid with comparison check marks, warm cream paper background, single red accent on one workstation, hand-drawn line art, editorial publication style, no gradients"
  [best-behavior-change-apps-for-breaking-compulsive-habits]="minimalist editorial illustration, five different phone screens shown side by side each displaying a different habit-tracker layout, warm cream paper background, single red accent on one screen, hand-drawn line art, no gradients, editorial style"
  [best-books-for-building-ai-agents-in-2026]="minimalist editorial illustration, six hardcover books arranged on a wooden library shelf with spines facing forward, titles partly visible, warm cream paper background, single red accent on one book spine, hand-drawn line art, no gradients, editorial publication style"
  [psychology-of-rule-based-decision-making-traders-habit-builders]="minimalist editorial illustration, two parallel decision trees on warm cream paper, one labeled trading the other behavior, converging at a single root node, single red accent on the convergence point, hand-drawn line art, no gradients, editorial style"
)

WIDTH=1536
HEIGHT=864
PIDS=()

urlencode() {
  python -c "import urllib.parse,sys; sys.stdout.write(urllib.parse.quote(sys.argv[1]))" "$1"
}

fetch_one() {
  local slug="$1"
  local prompt="$2"
  local seed=$(python -c "import hashlib,sys; print(int(hashlib.md5(sys.argv[1].encode()).hexdigest()[:8],16) % 1000000)" "$slug")
  local encoded
  encoded=$(urlencode "$prompt")
  local url="https://image.pollinations.ai/prompt/${encoded}?width=${WIDTH}&height=${HEIGHT}&model=flux&seed=${seed}&nologo=true&enhance=false&private=true"
  local out="public/images/blog/${slug}.png"

  if [[ -f "$out" ]]; then
    echo "  [skip] $slug (exists)"
    return
  fi

  curl --max-time 240 -s -o "$out" "$url"
  if [[ -f "$out" ]] && [[ $(wc -c < "$out") -gt 2000 ]]; then
    echo "  [ok]   $slug -> $(wc -c < "$out") bytes"
  else
    echo "  [FAIL] $slug (got $(wc -c < "$out" 2>/dev/null || echo 0) bytes)"
    rm -f "$out"
  fi
}

echo "Generating ${#PROMPTS[@]} hero images via Pollinations.ai (sequential, ~10s each)..."
echo

for slug in "${!PROMPTS[@]}"; do
  fetch_one "$slug" "${PROMPTS[$slug]}"
  sleep 2
done

echo
echo "Done. Images in public/images/blog/:"
ls -la public/images/blog/ | tail -n +2
