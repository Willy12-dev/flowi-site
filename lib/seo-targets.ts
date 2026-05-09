/**
 * SEO keyword targets per vertical.
 *
 * The content engine isn't just an AI publication. It's a three-domain SEO
 * play — articles in each vertical rank for the keywords that matter for
 * the product they funnel to:
 *
 *   ai_general    -> Books               (AI builder keywords)
 *   ai_trading    -> FlowiAI Trader      (algo trading keywords)
 *   ai_behavior   -> Woyuduin            (behavior change / recovery keywords)
 *
 * When writing or auto-generating articles, target the high-intent
 * keywords listed below. Each article picks 1 primary + 2-3 secondary.
 *
 * High-intent = the searcher has a problem and is actively shopping.
 * "Why X fails" / "best X for Y" / "X vs Y" patterns convert.
 */

export interface SEOTarget {
  vertical: string;
  primaryKeywords: string[];      // 1 per article
  secondaryKeywords: string[];     // 2-3 per article
  questionFormats: string[];       // article title patterns
  avoidKeywords: string[];         // generic terms to skip (low intent)
}

export const SEO_TARGETS: Record<string, SEOTarget> = {
  ai_trading: {
    vertical: "ai_trading",
    primaryKeywords: [
      "algorithmic trading",
      "ai trading bot",
      "automated forex trading",
      "ict trading strategy",
      "smart money concepts",
      "retail algo trading",
      "trading bot reliability",
      "ai forex bot",
      "institutional trading ai",
      "trading agent architecture",
    ],
    secondaryKeywords: [
      "metatrader ai",
      "ninjatrader bot",
      "tradingview script",
      "order block detection",
      "fair value gap",
      "liquidity sweep",
      "trading drawdown management",
      "risk per trade",
      "expected value trading",
      "claude trading agent",
      "gpt trading strategy",
      "ai market analysis",
    ],
    questionFormats: [
      "Why most {keyword} systems fail at month four",
      "{Keyword} vs manual trading: the only honest comparison",
      "The {keyword} mistake that costs retail traders their first $10K",
      "How institutional desks use {keyword} (and where retail tools fall short)",
      "What I learned running {keyword} for 12 months in production",
    ],
    avoidKeywords: ["finance", "investing", "stocks", "crypto"], // too broad, low intent
  },

  ai_behavior: {
    vertical: "ai_behavior",
    primaryKeywords: [
      "habit tracker app",
      "behavior change app",
      "ai accountability app",
      "discipline app",
      "focus app",
      "self-control app",
      "addiction recovery app",
      "porn recovery app",
      "habit formation",
      "behavioral ai",
    ],
    secondaryKeywords: [
      "habit streak",
      "habit replacement",
      "trigger and routine",
      "ai coach app",
      "accountability partner app",
      "blocking app",
      "screen time control",
      "self-monitoring app",
      "cognitive behavioral therapy app",
      "atomic habits app",
      "discipline app for men",
    ],
    questionFormats: [
      "Why {keyword} apps don't survive the third month",
      "The {keyword} pattern that 90% of apps miss",
      "{Keyword} vs willpower: what the research actually says",
      "What every {keyword} app gets wrong about relapse",
      "The behavioral science behind {keyword} apps that actually work",
    ],
    avoidKeywords: ["mental health", "therapy", "wellness"], // too broad, also regulated
  },

  ai_general: {
    vertical: "ai_general",
    primaryKeywords: [
      "ai agent memory",
      "agent architecture",
      "claude code patterns",
      "production ai patterns",
      "mcp server",
      "rag in production",
      "ai agent reliability",
      "multi-agent coordination",
      "ai eval framework",
      "open source llm production",
    ],
    secondaryKeywords: [
      "claude code skills",
      "agent sdk patterns",
      "tool use llm",
      "function calling production",
      "vector database choice",
      "agent failure mode",
      "llm context window strategy",
      "llm cost optimization",
      "anthropic api production",
      "openai api production",
    ],
    questionFormats: [
      "The {keyword} pattern that actually ships",
      "Why most {keyword} demos break in production",
      "{Keyword} vs the alternative: what to use when",
      "The {keyword} failure mode nobody warns you about",
      "What I learned shipping {keyword} for {N} months",
    ],
    avoidKeywords: ["ai overview", "ai trends", "future of ai"], // too broad
  },
};

export function getSEOTarget(vertical: string): SEOTarget | undefined {
  return SEO_TARGETS[vertical];
}
