import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const apiKey = process.env.NEXT_PUBLIC_TOKEN_METRICS_API;
  
  if (!apiKey) {
    console.error("NEXT_PUBLIC_TOKEN_METRICS_API environment variable is not set");
    return new Response(JSON.stringify({ error: "API key not configured", status: 500 }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const url = "https://api.tokenmetrics.com/v1/coins";
    const res = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Accept": "application/json"
      }
    });

    const data = await res.json();

    // If Token Metrics returns an error, forward it to the frontend
    if (!res.ok) {
      console.error("Token Metrics error:", data);
      return new Response(JSON.stringify({ 
        error: data.message || data.error || 'Unknown error from Token Metrics', 
        status: res.status 
      }), {
        status: res.status,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: any) {
    console.error("Token Metrics API error:", error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to fetch from Token Metrics',
      status: 500 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}