"use client";

import { useState, useEffect } from "react";

interface Topic {
  id: number;
  title: string;
  category: string;
  trending_score: number;
  source_type: string;
  status: string;
  created_at: string;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  category: string;
  word_count: number;
  status: string;
  published_at: string | null;
}

interface EbookItem {
  id: number;
  title: string;
  category: string;
  chapter_count: number;
  price: number;
  gumroad_url: string | null;
  status: string;
}

type Tab = "topics" | "posts" | "ebooks";

const STATUS_COLORS: Record<string, string> = {
  queued: "bg-yellow-500/20 text-yellow-400",
  writing: "bg-blue/20 text-blue-light",
  written: "bg-purple-500/20 text-purple-400",
  ready: "bg-orange-500/20 text-orange-400",
  published: "bg-green-500/20 text-green-400",
  draft: "bg-gray-500/20 text-gray-400",
  generating: "bg-blue/20 text-blue-light",
  ready_for_listing: "bg-orange-500/20 text-orange-400",
  listed: "bg-green-500/20 text-green-400",
};

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("topics");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [ebooks, setEbooks] = useState<EbookItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchData(type: Tab) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/topics/list?type=${type}`);
      const data = await res.json();
      const items = Array.isArray(data) ? data : data.items || [];
      if (type === "topics") setTopics(items);
      if (type === "posts") setPosts(items);
      if (type === "ebooks") setEbooks(items);
    } catch {
      setError("Failed to fetch — is the API running on port 8001?");
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData(tab);
  }, [tab]);

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "topics", label: "Topics", count: topics.length },
    { key: "posts", label: "Posts", count: posts.length },
    { key: "ebooks", label: "Ebooks", count: ebooks.length },
  ];

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Dashboard</h2>
        <button
          onClick={() => fetchData(tab)}
          className="text-sm text-muted hover:text-blue-light transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.key
                ? "bg-blue text-white"
                : "bg-surface text-muted hover:bg-surface-light"
            }`}
          >
            {t.label}
            {t.count > 0 && (
              <span className="ml-2 text-xs opacity-70">({t.count})</span>
            )}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

      {loading ? (
        <p className="text-muted text-sm py-8 text-center">Loading...</p>
      ) : (
        <>
          {/* Topics Tab */}
          {tab === "topics" && (
            <div className="space-y-3">
              {topics.length === 0 ? (
                <p className="text-muted text-sm py-8 text-center">No topics yet</p>
              ) : (
                topics.map((t) => (
                  <div
                    key={t.id}
                    className="rounded-xl border border-border bg-surface p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-foreground truncate">
                          {t.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted">
                          <span>{t.category}</span>
                          <span>Score: {t.trending_score}</span>
                          <span
                            className={`rounded-full px-2 py-0.5 ${
                              t.source_type === "manual"
                                ? "bg-accent/20 text-accent-light"
                                : "bg-surface-light text-muted"
                            }`}
                          >
                            {t.source_type}
                          </span>
                          {t.created_at && (
                            <span>
                              {new Date(t.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${
                          STATUS_COLORS[t.status] || "bg-surface-light text-muted"
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Posts Tab */}
          {tab === "posts" && (
            <div className="space-y-3">
              {posts.length === 0 ? (
                <p className="text-muted text-sm py-8 text-center">No posts yet</p>
              ) : (
                posts.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-xl border border-border bg-surface p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-foreground truncate">
                          {p.status === "published" ? (
                            <a
                              href={`/blog/${p.slug}`}
                              target="_blank"
                              className="hover:text-blue-light transition-colors"
                            >
                              {p.title}
                            </a>
                          ) : (
                            p.title
                          )}
                        </h3>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted">
                          <span>{p.category}</span>
                          <span>{p.word_count} words</span>
                          {p.published_at && (
                            <span>
                              Published{" "}
                              {new Date(p.published_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${
                          STATUS_COLORS[p.status] || "bg-surface-light text-muted"
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Ebooks Tab */}
          {tab === "ebooks" && (
            <div className="space-y-3">
              {ebooks.length === 0 ? (
                <p className="text-muted text-sm py-8 text-center">
                  No ebooks yet — need 5+ published posts in the same category
                </p>
              ) : (
                ebooks.map((e) => (
                  <div
                    key={e.id}
                    className="rounded-xl border border-border bg-surface p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-foreground truncate">
                          {e.gumroad_url ? (
                            <a
                              href={e.gumroad_url}
                              target="_blank"
                              className="hover:text-blue-light transition-colors"
                            >
                              {e.title}
                            </a>
                          ) : (
                            e.title
                          )}
                        </h3>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted">
                          <span>{e.category}</span>
                          <span>{e.chapter_count} chapters</span>
                          <span>${e.price}</span>
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${
                          STATUS_COLORS[e.status] || "bg-surface-light text-muted"
                        }`}
                      >
                        {e.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
