"use client";

import { useState } from "react";

const CATEGORIES = [
  "ai_automation",
  "prompting",
  "ai_tools",
  "ai_business",
  "ai_coding",
  "ai_trends",
];

export default function AdminForm() {
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [isEbook, setIsEbook] = useState(false);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || !password) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          category,
          isEbookMaterial: isEbook,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.title) {
        setStatus("success");
        setMessage(`Topic queued: "${data.title}" (score: ${data.score})`);
        setContent("");
        setIsEbook(false);
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to submit");
      }
    } catch {
      setStatus("error");
      setMessage("Network error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Paste from X, a link, or your own insight
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          placeholder="Paste a tweet, link, or write your insight here..."
          className="w-full rounded-xl border border-border bg-surface p-4 text-foreground placeholder:text-muted/50 focus:border-blue focus:outline-none resize-none"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-foreground mb-2">
            Category (optional)
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface p-3 text-foreground focus:border-blue focus:outline-none"
          >
            <option value="">Auto-detect</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-foreground mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="w-full rounded-xl border border-border bg-surface p-3 text-foreground placeholder:text-muted/50 focus:border-blue focus:outline-none"
          />
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={isEbook}
          onChange={(e) => setIsEbook(e.target.checked)}
          className="rounded border-border bg-surface"
        />
        <span className="text-sm text-muted">Flag as ebook material (fast-track to ebook)</span>
      </label>

      <button
        type="submit"
        disabled={status === "loading" || !content.trim() || !password}
        className="w-full rounded-xl bg-blue py-3 text-sm font-medium text-white hover:bg-blue-dark transition-colors disabled:opacity-50"
      >
        {status === "loading" ? "Submitting..." : "Add to Topic Queue"}
      </button>

      {status === "success" && (
        <p className="text-sm text-green-400">{message}</p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-400">{message}</p>
      )}
    </form>
  );
}
