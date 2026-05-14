"use client";

import { useState } from "react";
import type { PromptTemplate } from "@/lib/carousel/image-prompts";

export default function PromptCard({
  template,
  prompt,
}: {
  template: PromptTemplate;
  prompt: string;
}) {
  const [copied, setCopied] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState(prompt);

  async function copy() {
    await navigator.clipboard.writeText(editedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="border border-[var(--rule)] rounded bg-[var(--bg-elevated)]">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 px-5 pt-5 pb-3 border-b border-[var(--rule)]">
        <div>
          <p className="meta uppercase tracking-[0.08em] mb-1">
            {template.id}
          </p>
          <h3 className="text-[1.0625rem] font-semibold">{template.title}</h3>
        </div>
        <div className="flex flex-col items-end text-[0.8125rem] text-[var(--ink-soft)]">
          <span className="tabular">
            {template.size} · {template.aspect}
          </span>
          <code className="tabular text-[0.75rem]">{template.asset_path}</code>
        </div>
      </div>

      <div className="px-5 py-4">
        <p className="text-[0.8125rem] text-[var(--ink-soft)] italic mb-3">
          {template.uses}
        </p>

        <textarea
          className="w-full font-mono text-[12.5px] bg-[var(--bg)] border border-[var(--rule)] rounded p-3 h-[200px] resize-none whitespace-pre-wrap"
          value={editedPrompt}
          onChange={(e) => setEditedPrompt(e.target.value)}
          spellCheck={false}
        />

        {template.variables.length > 0 && (
          <p className="text-[0.75rem] text-[var(--muted)] italic mt-2">
            Editable variables: {template.variables.map((v) => v.name).join(", ")} — tweak inline above before copying.
          </p>
        )}

        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={copy}
            className="px-4 py-2 bg-[var(--ink)] text-[var(--paper)] text-[13px] tracking-[0.04em] uppercase"
          >
            {copied ? "✓ copied" : "Copy prompt"}
          </button>
          <button
            onClick={() => setEditedPrompt(prompt)}
            className="text-[13px] underline opacity-70 hover:opacity-100"
          >
            reset
          </button>
        </div>
      </div>
    </div>
  );
}
