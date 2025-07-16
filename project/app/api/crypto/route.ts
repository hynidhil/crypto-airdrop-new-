import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=50&convert=USD";
  const apiKey = process.env.COINAPI_KEY || "";
  const res = await fetch(url, {
    headers: {
      "X-CMC_PRO_API_KEY": apiKey,
      "Accept": "application/json"
    } as Record<string, string>
  });

  const data = await res.json();

  // If CoinMarketCap returns an error, forward it to the frontend
  if (res.status !== 200) {
    console.error("CoinMarketCap error:", data);
    return new Response(JSON.stringify({ error: data.status?.error_message || data.error || data.message || 'Unknown error from CoinMarketCap', status: res.status }), {
      status: res.status,
      headers: { "Content-Type": "application/json" }
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
} 