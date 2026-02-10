const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchAnalytics(
  endpoint: string,
  password: string,
  params?: Record<string, string>
) {
  const url = new URL(`${API_URL}/api/analytics/${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const res = await fetch(url.toString(), {
    headers: { "X-Admin-Password": password },
  });
  if (!res.ok) {
    throw new Error(`Analytics API error: ${res.status}`);
  }
  return res.json();
}

export { API_URL };
