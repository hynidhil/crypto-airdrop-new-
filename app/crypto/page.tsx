"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
}

export default function CryptoLivePage() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const prevPositions = useRef<{ [id: string]: number }>({});
  const [refreshing, setRefreshing] = useState(false);

  const fetchCoins = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/crypto");
      if (!res.ok) throw new Error("Failed to fetch crypto data");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const coinsArray = data.data || [];
      setCoins(
        coinsArray
          .filter((coin: any) => coin.quote && coin.quote.USD && coin.circulating_supply)
          .slice(0, 50)
          .map((coin: any) => ({
            id: coin.id,
            symbol: coin.symbol,
            name: coin.name,
            image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`,
            current_price: coin.quote.USD.price,
            market_cap: coin.quote.USD.market_cap,
            price_change_percentage_24h: coin.quote.USD.percent_change_24h,
          }))
      );
    } catch (err: any) {
      setError(err.message || "Failed to fetch crypto data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCoins();
    const interval = setInterval(fetchCoins, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (coins.length > 0) {
      const newPositions: { [id: string]: number } = {};
      coins.forEach((coin, idx) => {
        newPositions[coin.id] = idx;
      });
      prevPositions.current = newPositions;
    }
  }, [coins]);

  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await fetchCoins();
    setRefreshing(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Chart of Top 10 Coins */}
        {!loading && !error && coins.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Top 10 Coins Price Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={coins.slice(0, 10)}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-30} textAnchor="end" height={60} interval={0} />
                    <YAxis tickFormatter={(v) => `$${v.toLocaleString()}`}/>
                    <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`}/>
                    <Legend />
                    <Line type="monotone" dataKey="current_price" name="Price (USD)" stroke="#6366f1" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Live Crypto Prices</CardTitle>
            <div className="flex justify-end mt-2">
              <button
                onClick={handleManualRefresh}
                disabled={refreshing}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50 text-sm"
              >
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search coin by name or symbol..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-4 max-w-xs"
            />
            {loading ? (
              <div className="text-center py-12">Loading...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-12">{error}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-2 text-left">#</th>
                      <th className="py-2 px-2 text-left">Coin</th>
                      <th className="py-2 px-2 text-right">Price</th>
                      <th className="py-2 px-2 text-right">24h Change</th>
                      <th className="py-2 px-2 text-right">Market Cap</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCoins.map((coin, idx) => {
                      const prevIdx = prevPositions.current[coin.id];
                      let arrow = null;
                      if (prevIdx !== undefined) {
                        if (idx < prevIdx) {
                          arrow = <span style={{ color: 'green', marginLeft: 4 }}>▲</span>;
                        } else if (idx > prevIdx) {
                          arrow = <span style={{ color: 'red', marginLeft: 4 }}>▼</span>;
                        }
                      }
                      return (
                        <tr key={coin.id} className="border-b hover:bg-muted/30 transition-colors">
                          <td className="py-2 px-2">
                            {idx + 1}
                            {arrow}
                          </td>
                          <td className="py-2 px-2 flex items-center gap-2">
                            <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
                            <span className="font-medium">{coin.name}</span>
                            <span className="uppercase text-xs text-muted-foreground">{coin.symbol}</span>
                          </td>
                          <td className="py-2 px-2 text-right font-mono">${coin.current_price.toLocaleString()}</td>
                          <td className={`py-2 px-2 text-right font-mono ${coin.price_change_percentage_24h > 0 ? "text-green-600" : "text-red-500"}`}>
                            {coin.price_change_percentage_24h.toFixed(2)}%
                          </td>
                          <td className="py-2 px-2 text-right font-mono">${coin.market_cap.toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredCoins.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">No coins found.</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 