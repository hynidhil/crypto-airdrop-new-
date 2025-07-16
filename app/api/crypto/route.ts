export async function GET(req: NextRequest) {
  const apiKey = process.env.COINAPI_KEY;
  const apiKey = process.env.COINAPI_KEY;
  
  if (!apiKey) {
    console.error("COINAPI_KEY environment variable is not set");
    return new Response(JSON.stringify({ error: "API key not configured", status: 500 }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
  
  // Check if API key is configured
  if (!apiKey || apiKey === "your_coinmarketcap_api_key_here") {
    return new Response(JSON.stringify({ 
      error: "CoinMarketCap API key not configured. Please add COINAPI_KEY to your environment variables.",
      status: 401 
    }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  const url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=50&convert=USD";
  const res = await fetch(url, {
    headers: {
      "X-CMC_PRO_API_KEY": apiKey,
    }
  });
}