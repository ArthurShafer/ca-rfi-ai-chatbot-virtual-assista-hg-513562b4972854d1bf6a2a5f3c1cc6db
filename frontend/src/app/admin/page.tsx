"use client";

import { useState, useEffect, useCallback } from "react";
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
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [days, setDays] = useState(7);

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
        <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-md">
          <h1 className="mb-6 text-xl font-semibold text-slate-800">
            {t("admin.title")}
          </h1>
          <label className="mb-2 block text-sm text-slate-600">
            {t("admin.passwordPrompt")}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="mb-4 w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
          <button
            onClick={handleLogin}
            className="w-full rounded bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {t("admin.login")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">
            {t("admin.title")}
          </h1>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="rounded border border-slate-300 px-3 py-1.5 text-sm"
          >
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>

        {/* Overview Cards */}
        {overview && (
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label={t("admin.totalConversations")}
              value={String(overview.total_conversations)}
            />
            <StatCard
              label={t("admin.totalMessages")}
              value={String(overview.total_messages)}
            />
            <StatCard
              label={t("admin.avgResponseTime")}
              value={`${overview.avg_response_time_ms}ms`}
            />
            <StatCard
              label={t("admin.satisfaction")}
              value={
                overview.avg_satisfaction
                  ? `${overview.avg_satisfaction}/5`
                  : "N/A"
              }
            />
          </div>
        )}

        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Department Breakdown */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-700">
              {t("admin.departmentBreakdown")}
            </h2>
            {departments.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departments}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={80} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-12 text-center text-sm text-slate-400">
                No data available
              </p>
            )}
          </div>

          {/* Language Breakdown */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-700">
              {t("admin.languageBreakdown")}
            </h2>
            {languages.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={languages}
                    dataKey="count"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(props) =>
                      `${props.name ?? ""} (${((props.percent ?? 0) * 100).toFixed(0)}%)`
                    }
                  >
                    {languages.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-12 text-center text-sm text-slate-400">
                No data available
              </p>
            )}
          </div>
        </div>

        {/* Top Questions */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-700">
            {t("admin.topQuestions")}
          </h2>
          {questions.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-slate-500">
                  <th className="pb-2">Question</th>
                  <th className="pb-2 text-right">Count</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-2 text-slate-700">{q.message}</td>
                    <td className="py-2 text-right font-medium">{q.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="py-6 text-center text-sm text-slate-400">
              No data available
            </p>
          )}
        </div>

        {/* Recent Conversations */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-700">
            {t("admin.recentConversations")}
          </h2>
          {conversations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-slate-500">
                    <th className="pb-2">First Message</th>
                    <th className="pb-2">Department</th>
                    <th className="pb-2">Lang</th>
                    <th className="pb-2 text-right">Messages</th>
                    <th className="pb-2 text-right">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {conversations.map((c) => (
                    <tr key={c.id} className="border-b last:border-0">
                      <td className="max-w-xs truncate py-2 text-slate-700">
                        {c.first_message || "—"}
                      </td>
                      <td className="py-2 text-slate-500">
                        {c.department || "—"}
                      </td>
                      <td className="py-2 uppercase text-slate-500">
                        {c.language}
                      </td>
                      <td className="py-2 text-right">{c.message_count}</td>
                      <td className="py-2 text-right">
                        {c.satisfaction_rating ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="py-6 text-center text-sm text-slate-400">
              No data available
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-800">{value}</p>
    </div>
  );
}
