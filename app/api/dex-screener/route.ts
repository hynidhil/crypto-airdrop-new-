import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const endpoint = searchParams.get('endpoint') || 'token-profiles';
  const chainId = searchParams.get('chainId');
  const tokenAddress = searchParams.get('tokenAddress');
  const query = searchParams.get('q');

  let url = 'https://api.dexscreener.com';

  try {
    switch (endpoint) {
      case 'token-profiles':
        url += '/token-profiles/latest/v1';
        break;
      case 'token-boosts':
        url += '/token-boosts/latest/v1';
        break;
      case 'token-boosts-top':
        url += '/token-boosts/top/v1';
        break;
      case 'search':
        url += '/latest/dex/search';
        if (query) url += `?q=${encodeURIComponent(query)}`;
        break;
      case 'pairs':
        if (!chainId || !tokenAddress) {
          return new Response(JSON.stringify({ error: 'chainId and tokenAddress required for pairs endpoint' }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }
        url += `/latest/dex/pairs/${chainId}/${tokenAddress}`;
        break;
      case 'token-pairs':
        if (!chainId || !tokenAddress) {
          return new Response(JSON.stringify({ error: 'chainId and tokenAddress required for token-pairs endpoint' }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }
        url += `/token-pairs/v1/${chainId}/${tokenAddress}`;
        break;
      case 'tokens':
        if (!chainId || !tokenAddress) {
          return new Response(JSON.stringify({ error: 'chainId and tokenAddress required for tokens endpoint' }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }
        url += `/tokens/v1/${chainId}/${tokenAddress}`;
        break;
      default:
        return new Response(JSON.stringify({ error: 'Invalid endpoint' }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
    }

    const res = await fetch(url, {
      headers: {
        "Accept": "application/json"
      }
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("DEX Screener error:", data);
      return new Response(JSON.stringify({ 
        error: data.error || data.message || 'Unknown error from DEX Screener', 
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
    console.error("DEX Screener API error:", error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to fetch from DEX Screener',
      status: 500 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}