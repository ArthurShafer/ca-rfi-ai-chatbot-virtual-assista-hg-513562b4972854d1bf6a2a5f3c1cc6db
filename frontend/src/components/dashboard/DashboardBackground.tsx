"use client";

import Link from "next/link";

const MOCK_STATS = [
  { label: "Total Conversations", value: "1,247", change: "+12.3%", up: true },
  { label: "Messages Processed", value: "8,432", change: "+18.7%", up: true },
  { label: "Avg Response Time", value: "1.2s", change: "-0.3s", up: true },
  { label: "Satisfaction Score", value: "4.6/5", change: "+0.2", up: true },
];

const DEPT_DATA = [
  { name: "Health & Human Services", count: 412, pct: 33 },
  { name: "Resource Management", count: 287, pct: 23 },
  { name: "Clerk-Recorder", count: 198, pct: 16 },
  { name: "Tax Collector", count: 156, pct: 13 },
  { name: "Animal Services", count: 112, pct: 9 },
  { name: "General Services", count: 82, pct: 6 },
];

const LANG_DATA = [
  { lang: "English", pct: 68, color: "bg-blue-500" },
  { lang: "Spanish", pct: 32, color: "bg-amber-500" },
];

const TOP_QUESTIONS = [
  { q: "How do I apply for CalFresh benefits?", count: 89 },
  { q: "What do I need for a building permit?", count: 67 },
  { q: "How do I get a birth certificate?", count: 54 },
  { q: "When are property taxes due?", count: 48 },
  { q: "Where is the animal shelter?", count: 41 },
];

const RECENT_ACTIVITY = [
  { time: "2 min ago", event: "New conversation started", dept: "HHSA", lang: "ES" },
  { time: "5 min ago", event: "Conversation resolved", dept: "RMA", lang: "EN" },
  { time: "8 min ago", event: "Escalated to live agent", dept: "Tax Collector", lang: "EN" },
  { time: "12 min ago", event: "New conversation started", dept: "Clerk", lang: "EN" },
  { time: "15 min ago", event: "Conversation resolved", dept: "HHSA", lang: "ES" },
  { time: "18 min ago", event: "New conversation started", dept: "Animal Services", lang: "EN" },
];

function StatCard({ label, value, change, up }: { label: string; value: string; change: string; up: boolean }) {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
      <p className={`mt-1 text-xs font-medium ${up ? "text-green-600" : "text-red-600"}`}>
        {up ? "\u2191" : "\u2193"} {change} vs last month
      </p>
    </div>
  );
}

export default function DashboardBackground() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dashboard Header */}
      <div className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-800 text-xs font-bold text-white">
                TC
              </div>
              <div>
                <h1 className="text-base font-semibold text-slate-900">AI Assistant Dashboard</h1>
                <p className="text-xs text-slate-500">County of Tulare, California</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-xs text-green-600">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                System Online
              </span>
              <span className="text-xs text-slate-400">Last updated: just now</span>
              <Link
                href="/admin"
                className="rounded-lg bg-blue-700 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-6">
        {/* Period selector */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">Overview &mdash; Last 30 Days</h2>
          <div className="flex gap-1 rounded-lg bg-white p-0.5 shadow-sm ring-1 ring-slate-200">
            {["7 Days", "30 Days", "90 Days"].map((p, i) => (
              <button
                key={p}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  i === 1
                    ? "bg-blue-700 text-white"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Stat cards */}
        <div className="mb-6 grid grid-cols-4 gap-4">
          {MOCK_STATS.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Department breakdown */}
          <div className="col-span-2 rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h3 className="mb-4 text-sm font-semibold text-slate-700">Conversations by Department</h3>
            <div className="space-y-3">
              {DEPT_DATA.map((d) => (
                <div key={d.name} className="flex items-center gap-3">
                  <span className="w-40 truncate text-xs text-slate-600">{d.name}</span>
                  <div className="flex-1">
                    <div className="h-5 w-full rounded-full bg-slate-100">
                      <div
                        className="h-5 rounded-full bg-blue-600"
                        style={{ width: `${d.pct}%` }}
                      />
                    </div>
                  </div>
                  <span className="w-12 text-right text-xs font-medium text-slate-700">{d.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Language breakdown */}
          <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h3 className="mb-4 text-sm font-semibold text-slate-700">Language Breakdown</h3>
            {/* Donut visual */}
            <div className="mb-4 flex justify-center">
              <div className="relative h-32 w-32">
                <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                  <circle cx="18" cy="18" r="14" fill="none" strokeWidth="5" stroke="#e2e8f0" />
                  <circle
                    cx="18" cy="18" r="14" fill="none" strokeWidth="5" stroke="#3b82f6"
                    strokeDasharray={`${68 * 0.88} ${100 * 0.88}`} strokeLinecap="round"
                  />
                  <circle
                    cx="18" cy="18" r="14" fill="none" strokeWidth="5" stroke="#f59e0b"
                    strokeDasharray={`${32 * 0.88} ${100 * 0.88}`}
                    strokeDashoffset={`-${68 * 0.88}`} strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-slate-900">1,247</span>
                  <span className="text-[10px] text-slate-500">total</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {LANG_DATA.map((l) => (
                <div key={l.lang} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${l.color}`} />
                    <span className="text-xs text-slate-600">{l.lang}</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-700">{l.pct}%</span>
                </div>
              ))}
            </div>

            {/* Bilingual impact */}
            <div className="mt-4 rounded-md bg-amber-50 p-3">
              <p className="text-[11px] font-medium text-amber-800">32% of conversations in Spanish</p>
              <p className="mt-0.5 text-[10px] text-amber-600">
                Serving Tulare County&apos;s 64% Hispanic/Latino population
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          {/* Top questions */}
          <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h3 className="mb-3 text-sm font-semibold text-slate-700">Top Questions</h3>
            <div className="space-y-2.5">
              {TOP_QUESTIONS.map((q, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-blue-100 text-[10px] font-bold text-blue-700">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs text-slate-700">{q.q}</p>
                    <p className="text-[10px] text-slate-400">{q.count} times asked</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className="col-span-2 rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h3 className="mb-3 text-sm font-semibold text-slate-700">Recent Activity</h3>
            <div className="space-y-2">
              {RECENT_ACTIVITY.map((a, i) => (
                <div key={i} className="flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-slate-50">
                  <span className="w-16 shrink-0 text-[10px] text-slate-400">{a.time}</span>
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                      a.event.includes("started")
                        ? "bg-green-400"
                        : a.event.includes("resolved")
                          ? "bg-blue-400"
                          : "bg-amber-400"
                    }`}
                  />
                  <span className="flex-1 text-xs text-slate-600">{a.event}</span>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                    {a.dept}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                      a.lang === "ES"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {a.lang}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
