/**
 * Today's Top 10 — sample data.
 *
 * This is a static module for now. Wire to the live FlowiLeads API
 * (`http://localhost:8001/api/reports/today`) when it's running so the
 * homepage shows real data:
 *
 *   const r = await fetch(process.env.FLOWI_LEADS_API_URL + '/api/reports/today');
 *   const json = await r.json();
 *   return shape(json);
 */

export interface BriefItem {
  rank: number;
  source: string;        // e.g. OPENAI · ANTHROPIC · DEEPMIND
  headline: string;
  href: string;
  when: string;          // HH:MM
}

export interface DailyBrief {
  edition_label: string; // "Issue 09 — May 9, 2026"
  date_iso: string;      // 2026-05-09
  items: BriefItem[];
}

export function getTodaysBrief(): DailyBrief {
  return {
    edition_label: "Issue 09 — May 9, 2026",
    date_iso: "2026-05-09",
    items: [
      { rank: 1,  source: "OpenAI",       headline: "Voice Intelligence API ships — real-time transcription, translation, and speech reasoning.",     href: "https://openai.com/index/advancing-voice-intelligence-with-new-models-in-the-api", when: "09:14" },
      { rank: 2,  source: "Anthropic",    headline: "Claude Mythos identifies 271 Firefox vulnerabilities at near-zero false-positive rate.",         href: "https://hacks.mozilla.org/2026/05/behind-the-scenes-hardening-firefox/",          when: "08:42" },
      { rank: 3,  source: "DeepMind",     headline: "AlphaEvolve coding agent expands — Gemini-powered, scales across multiple problem domains.",     href: "https://deepmind.google/blog/alphaevolve-impact/",                                 when: "08:11" },
      { rank: 4,  source: "OpenAI",       headline: "GPT-5.5-Cyber granted to verified security researchers via the new Trusted Access program.",     href: "https://openai.com/index/gpt-5-5-with-trusted-access-for-cyber",                  when: "07:52" },
      { rank: 5,  source: "Perplexity",   headline: "Personal Computer rolls out to all Mac users — desktop-task automation via natural language.",   href: "https://techcrunch.com/2026/05/07/perplexitys-personal-computer-is-now-available-everyone-on-mac/", when: "07:30" },
      { rank: 6,  source: "Anthropic",    headline: "Natural-language autoencoders convert Claude's hidden activations into readable English.",        href: "https://www.anthropic.com/research/natural-language-autoencoders",                when: "07:14" },
      { rank: 7,  source: "Github",       headline: "Agent_Memory_Techniques — 30 runnable notebooks covering buffer, vector, graph, MemGPT.",        href: "https://github.com/NirDiamant/Agent_Memory_Techniques",                           when: "06:48" },
      { rank: 8,  source: "Github",       headline: "claude-code-memory-setup — 71.5x token reduction with Obsidian + Graphify on Claude Code.",      href: "https://github.com/lucasrosati/claude-code-memory-setup",                         when: "06:30" },
      { rank: 9,  source: "Github",       headline: "OpenMythos — first-principles reconstruction of Anthropic's Mythos vulnerability research.",     href: "https://github.com/kyegomez/openmythos",                                          when: "06:18" },
      { rank: 10, source: "Github",       headline: "antivibe — turns AI-generated code into educational deep-dives, runs as a Claude Code skill.",   href: "https://github.com/mohi-devhub/antivibe",                                         when: "06:04" },
    ],
  };
}
