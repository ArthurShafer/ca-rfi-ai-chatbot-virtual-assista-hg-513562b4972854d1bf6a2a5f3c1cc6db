"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import { fetchAnalytics } from "@/lib/api";
import { useLanguage } from "@/components/providers/LanguageProvider";

const COLORS = ["#2563eb", "#f59e0b", "#10b981", "#8b5cf6", "#ef4444", "#06b6d4", "#f97316"];

interface Overview {
  total_conversations: number;
  total_messages: number;
  avg_response_time_ms: number;
  avg_satisfaction: number | null;
  period_days: number;
}

interface DeptData {
  slug: string;
  name: string;
  count: number;
}

interface LangData {
  language: string;
  label: string;
  count: number;
}

interface QuestionData {
  message: string;
  count: number;
}

interface ConversationData {
  id: string;
  language: string;
  department: string | null;
  started_at: string | null;
  message_count: number;
  first_message: string | null;
  satisfaction_rating: number | null;
}

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [password, setPassword] = useState("demo2026");
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [days, setDays] = useState(30);

  const [overview, setOverview] = useState<Overview | null>(null);
  const [departments, setDepartments] = useState<DeptData[]>([]);
  const [languages, setLanguages] = useState<LangData[]>([]);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [conversations, setConversations] = useState<ConversationData[]>([]);

  const loadData = useCallback(
    async (pw: string) => {
      try {
        const params = { days: String(days) };
        const [ov, dep, lang, ques, conv] = await Promise.all([
          fetchAnalytics("overview", pw, params),
          fetchAnalytics("departments", pw, params),
          fetchAnalytics("languages", pw, params),
          fetchAnalytics("top-questions", pw, { ...params, limit: "10" }),
          fetchAnalytics("conversations", pw, { limit: "20" }),
        ]);
        setOverview(ov);
        setDepartments(dep.departments);
        setLanguages(lang.languages);
        setQuestions(ques.questions);
        setConversations(conv.conversations);
      } catch {
        setError("Failed to load analytics data");
      }
    },
    [days]
  );

  const handleLogin = async () => {
    setError("");
    try {
      await fetchAnalytics("overview", password);
      setAuthenticated(true);
      loadData(password);
    } catch {
      setError("Invalid password");
    }
  };

  useEffect(() => {
    if (authenticated) loadData(password);
  }, [days, authenticated, password, loadData]);

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-800 text-sm font-bold text-white">
              TC
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-800">
                {t("admin.title")}
              </h1>
              <p className="text-xs text-slate-500">County of Tulare, California</p>
            </div>
          </div>
          <p className="mb-4 text-sm text-slate-600">View chatbot analytics and conversation history.</p>
          {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
          <button
            onClick={handleLogin}
            className="w-full rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  const totalLangCount = languages.reduce((s, l) => s + l.count, 0) || 1;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
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
              <Link
                href="/"
                className="rounded-lg border border-slate-300 px-4 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
              >
                View Public Site
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-6">
        {/* Period selector */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">
            Overview &mdash; Last {days} Days
          </h2>
          <div className="flex gap-1 rounded-lg bg-white p-0.5 shadow-sm ring-1 ring-slate-200">
            {[7, 30, 90].map((p) => (
              <button
                key={p}
                onClick={() => setDays(p)}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  days === p
                    ? "bg-blue-700 text-white"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {p} Days
              </button>
            ))}
          </div>
        </div>

        {/* Stat cards */}
        {overview && (
          <div className="mb-6 grid grid-cols-4 gap-4">
            <StatCard
              label="Total Conversations"
              value={overview.total_conversations.toLocaleString()}
            />
            <StatCard
              label="Total Messages"
              value={overview.total_messages.toLocaleString()}
            />
            <StatCard
              label="Avg Response Time"
              value={overview.avg_response_time_ms ? `${(overview.avg_response_time_ms / 1000).toFixed(1)}s` : "N/A"}
            />
            <StatCard
              label="Satisfaction Score"
              value={overview.avg_satisfaction ? `${overview.avg_satisfaction}/5` : "N/A"}
            />
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          {/* Department breakdown */}
          <div className="col-span-2 rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h3 className="mb-4 text-sm font-semibold text-slate-700">
              {t("admin.departmentBreakdown")}
            </h3>
            {departments.length > 0 ? (
              <ResponsiveContainer width="100%" height={departments.length * 44 + 20}>
                <BarChart data={departments} layout="vertical" margin={{ left: 8, right: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={150}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2563eb" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-12 text-center text-sm text-slate-400">No data available</p>
            )}
          </div>

          {/* Language breakdown - donut style */}
          <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h3 className="mb-4 text-sm font-semibold text-slate-700">
              {t("admin.languageBreakdown")}
            </h3>
            {languages.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={languages}
                      dataKey="count"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {languages.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-2 space-y-2">
                  {languages.map((l, i) => (
                    <div key={l.language} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: COLORS[i % COLORS.length] }}
                        />
                        <span className="text-xs text-slate-600">{l.label}</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-700">
                        {((l.count / totalLangCount) * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="py-12 text-center text-sm text-slate-400">No data available</p>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          {/* Top questions */}
          <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h3 className="mb-3 text-sm font-semibold text-slate-700">
              {t("admin.topQuestions")}
            </h3>
            {questions.length > 0 ? (
              <div className="space-y-2.5">
                {questions.slice(0, 5).map((q, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-blue-100 text-[10px] font-bold text-blue-700">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs text-slate-700">{q.message}</p>
                      <p className="text-[10px] text-slate-400">{q.count} times asked</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-slate-400">No data available</p>
            )}
          </div>

          {/* Recent conversations */}
          <div className="col-span-2 rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h3 className="mb-3 text-sm font-semibold text-slate-700">
              {t("admin.recentConversations")}
            </h3>
            {conversations.length > 0 ? (
              <div className="space-y-2">
                {conversations.slice(0, 8).map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-slate-50"
                  >
                    <span className="w-40 flex-1 truncate text-xs text-slate-600">
                      {c.first_message || "—"}
                    </span>
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                      {c.department || "General"}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                        c.language === "es"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {c.language.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {c.message_count} msgs
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {c.satisfaction_rating ? `${c.satisfaction_rating}/5` : "—"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-slate-400">No data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
