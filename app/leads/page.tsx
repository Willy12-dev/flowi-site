"use client";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_LEADS_API || "";

function useAPI(path: string, interval = 30000) {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    const load = async () => {
      // Try live API first, fall back to static data
      if (API) {
        try {
          const r = await fetch(`${API}${path}`);
          if (r.ok) { setData(await r.json()); return; }
        } catch {}
      }
      // Fallback: load static JSON
      try {
        const r = await fetch('/leads-data.json');
        if (r.ok) {
          const all = await r.json();
          if (path.includes('stats')) setData(all.stats);
          else if (path.includes('gaps')) setData(all.leads.filter((l: any) => l.intent_score >= 40));
          else setData(all.leads);
        }
      } catch {}
    };
    load();
    const i = setInterval(load, interval);
    return () => clearInterval(i);
  }, [path, interval]);
  return data;
}

export default function LeadsDashboard() {
  const stats = useAPI("/api/stats", 10000);
  const leads = useAPI("/api/leads?min_score=1&limit=50", 15000);
  const gaps = useAPI("/api/gaps", 30000);
  const [filter, setFilter] = useState<"all" | "hot" | "warm" | "cold">("all");
  const [scanning, setScanning] = useState(false);

  const filtered = (leads || []).filter((l: any) => {
    if (filter === "hot") return l.intent_score >= 70;
    if (filter === "warm") return l.intent_score >= 40 && l.intent_score < 70;
    if (filter === "cold") return l.intent_score > 0 && l.intent_score < 40;
    return true;
  });

  const triggerScan = async () => {
    setScanning(true);
    try {
      await fetch(`${API}/api/scan`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(["ai_tools", "trading"]) });
    } catch {}
    setScanning(false);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-sm font-black">F</div>
            <span className="text-lg font-bold">Flowi <span className="text-emerald-400">Leads</span></span>
          </div>
          <button onClick={triggerScan} disabled={scanning}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-sm font-bold hover:bg-emerald-500 transition disabled:opacity-50">
            {scanning ? "Scanning..." : "Run Scan"}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
          {[
            { label: "Total Leads", value: stats?.total_leads ?? 0, color: "text-white" },
            { label: "Scored", value: stats?.scored ?? 0, color: "text-blue-400" },
            { label: "Hot", value: stats?.hot ?? 0, color: "text-red-400" },
            { label: "Warm", value: stats?.warm ?? 0, color: "text-amber-400" },
            { label: "Cold", value: stats?.cold ?? 0, color: "text-gray-400" },
            { label: "Contacted", value: stats?.contacted ?? 0, color: "text-purple-400" },
            { label: "Converted", value: stats?.converted ?? 0, color: "text-emerald-400" },
          ].map(s => (
            <div key={s.label} className="bg-white/[0.02] border border-white/5 rounded-xl p-4 text-center">
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Platform + Niche breakdown */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">By Platform</h3>
            <div className="space-y-2">
              {Object.entries(stats?.platforms || {}).map(([p, count]: any) => (
                <div key={p} className="flex justify-between items-center">
                  <span className="text-sm text-gray-300 capitalize">{p}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min((count / Math.max(stats?.total_leads || 1, 1)) * 100, 100)}%` }} />
                    </div>
                    <span className="text-sm font-bold text-white w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">By Niche</h3>
            <div className="space-y-2">
              {Object.entries(stats?.niches || {}).filter(([, c]: any) => c > 0).map(([n, count]: any) => (
                <div key={n} className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">{n.replace(/_/g, " ")}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min((count / Math.max(stats?.total_leads || 1, 1)) * 100, 100)}%` }} />
                    </div>
                    <span className="text-sm font-bold text-white w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl font-black mr-4">Leads</h2>
          {(["all", "hot", "warm", "cold"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${filter === f ? "bg-emerald-600 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}>
              {f} {f === "all" ? `(${(leads || []).length})` : ""}
            </button>
          ))}
        </div>

        {/* Lead list */}
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500">No leads matching this filter</div>
          ) : filtered.map((l: any) => (
            <div key={l.id} className={`border rounded-xl p-5 transition ${
              l.intent_score >= 70 ? "border-red-500/20 bg-red-500/[0.03]" :
              l.intent_score >= 40 ? "border-amber-500/20 bg-amber-500/[0.03]" :
              "border-white/5 bg-white/[0.02]"
            }`}>
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                      l.platform === "youtube" ? "bg-red-500/10 text-red-400" :
                      l.platform === "hackernews" ? "bg-orange-500/10 text-orange-400" :
                      l.platform === "discord" ? "bg-indigo-500/10 text-indigo-400" :
                      "bg-gray-500/10 text-gray-400"
                    }`}>{l.platform}</span>
                    <span className="text-sm text-gray-400">@{l.username}</span>
                    <span className="text-xs text-gray-600">{l.niche?.replace(/_/g, " ")}</span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{l.content}</p>
                  {l.pain_point && l.pain_point !== l.content?.slice(0, 200) && (
                    <p className="text-xs text-emerald-400 mt-2">Pain: {l.pain_point}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className={`text-2xl font-black ${
                    l.intent_score >= 70 ? "text-red-400" :
                    l.intent_score >= 40 ? "text-amber-400" :
                    "text-gray-500"
                  }`}>{l.intent_score}</div>
                  <span className="text-xs text-gray-500">{l.intent_type?.replace(/_/g, " ")}</span>
                  <span className={`text-xs font-bold uppercase ${
                    l.funnel_stage === "hot" ? "text-red-400" :
                    l.funnel_stage === "warm" ? "text-amber-400" :
                    "text-gray-500"
                  }`}>{l.funnel_stage}</span>
                  {l.post_url && (
                    <a href={l.post_url} target="_blank" rel="noopener" className="text-xs text-blue-400 hover:underline">View post</a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gap Opportunities */}
        {gaps && gaps.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-black mb-4">Gap Opportunities <span className="text-emerald-400">({gaps.length})</span></h2>
            <p className="text-sm text-gray-500 mb-6">Problems people have with NO existing solution = product opportunities</p>
            <div className="grid md:grid-cols-2 gap-3">
              {gaps.map((g: any) => (
                <div key={g.id} className="border border-emerald-500/10 bg-emerald-500/[0.02] rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">{g.niche?.replace(/_/g, " ")}</span>
                    <span className="text-xs text-gray-500">{g.platform}</span>
                    <span className="text-xs text-gray-500">Score: {g.intent_score}</span>
                  </div>
                  <p className="text-sm text-gray-300">{g.pain_point || g.content}</p>
                  <p className="text-xs text-gray-500 mt-2">by @{g.username}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
