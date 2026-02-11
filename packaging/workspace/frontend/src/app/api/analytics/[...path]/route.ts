import { NextRequest } from "next/server";

const API_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const endpoint = path.join("/");
  const search = req.nextUrl.searchParams.toString();
  const url = `${API_URL}/api/analytics/${endpoint}${search ? `?${search}` : ""}`;

  const upstream = await fetch(url, {
    headers: {
      "X-Admin-Password": req.headers.get("X-Admin-Password") || "",
    },
  });

  return new Response(upstream.body, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
}
