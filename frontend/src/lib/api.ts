const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export async function fetchAnalytics(
  endpoint: string,
  password: string,
  params?: Record<string, string>
) {
  const qs = params
    ? "?" + new URLSearchParams(params).toString()
    : "";
  const res = await fetch(`${basePath}/api/analytics/${endpoint}${qs}`, {
    headers: { "X-Admin-Password": password },
  });
  if (!res.ok) {
    throw new Error(`Analytics API error: ${res.status}`);
  }
  return res.json();
}
