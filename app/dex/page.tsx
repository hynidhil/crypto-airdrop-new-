"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, TrendingUp, Zap, ExternalLink, Loader2, AlertCircle } from "lucide-react";

interface TokenProfile {
  tokenAddress: string;
  chainId: string;
  url: string;
  description: string;
  imgUrl: string;
  header: {
    status: string;
  };
}

interface TokenBoost {
  tokenAddress: string;
  chainId: string;
  amount: number;
  totalAmount: number;
  icon: string;
  header: {
    status: string;
  };
}

interface SearchResult {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceNative: string;
  priceUsd: string;
  txns: {
    m5: { buys: number; sells: number };
    h1: { buys: number; sells: number };
    h6: { buys: number; sells: number };
    h24: { buys: number; sells: number };
  };
  volume: {
    h24: number;
    h6: number;
    h1: number;
    m5: number;
  };
  priceChange: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  liquidity: {
    usd: number;
    base: number;
    quote: number;
  };
  fdv: number;
  marketCap: number;
  pairCreatedAt: number;
}

export default function DexPage() {
  const [tokenProfiles, setTokenProfiles] = useState<TokenProfile[]>([]);
  const [tokenBoosts, setTokenBoosts] = useState<TokenBoost[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profiles");

  const fetchTokenProfiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/dex-screener?endpoint=token-profiles");
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch token profiles");
      }
      
      setTokenProfiles(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTokenBoosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/dex-screener?endpoint=token-boosts");
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch token boosts");
      }
      
      setTokenBoosts(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/dex-screener?endpoint=search&q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to search tokens");
      }
      
      setSearchResults(data.pairs || []);
      setActiveTab("search");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokenProfiles();
    fetchTokenBoosts();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num?.toFixed(2) || '0';
  };

  const formatPercentage = (num: number) => {
    const formatted = num?.toFixed(2) || '0';
    return `${num > 0 ? '+' : ''}${formatted}%`;
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">DEX Screener</h1>
          <p className="text-xl text-muted-foreground">
            Discover trending tokens, boosted projects, and real-time DEX data
          </p>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Tokens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Search for tokens, pairs, or addresses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="mb-8 border-red-200">
            <CardContent className="py-4">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profiles">Token Profiles</TabsTrigger>
            <TabsTrigger value="boosts">Token Boosts</TabsTrigger>
            <TabsTrigger value="search">Search Results</TabsTrigger>
          </TabsList>

          <TabsContent value="profiles" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tokenProfiles.map((profile, index) => (
                <Card key={`${profile.tokenAddress}-${index}`} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      {profile.imgUrl && (
                        <img 
                          src={profile.imgUrl} 
                          alt="Token" 
                          className="w-10 h-10 rounded-full"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                      <div className="flex-1">
                        <CardTitle className="text-lg truncate">
                          {profile.tokenAddress.slice(0, 6)}...{profile.tokenAddress.slice(-4)}
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          Chain: {profile.chainId}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {profile.description || 'No description available'}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant={profile.header?.status === 'active' ? 'default' : 'secondary'}>
                        {profile.header?.status || 'Unknown'}
                      </Badge>
                      {profile.url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={profile.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="boosts" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tokenBoosts.map((boost, index) => (
                <Card key={`${boost.tokenAddress}-${index}`} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      {boost.icon && (
                        <img 
                          src={boost.icon} 
                          alt="Token" 
                          className="w-10 h-10 rounded-full"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                      <div className="flex-1">
                        <CardTitle className="text-lg truncate">
                          {boost.tokenAddress.slice(0, 6)}...{boost.tokenAddress.slice(-4)}
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          Chain: {boost.chainId}
                        </Badge>
                      </div>
                      <Zap className="w-5 h-5 text-yellow-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Boost Amount:</span>
                        <span className="font-medium">${formatNumber(boost.amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Amount:</span>
                        <span className="font-medium">${formatNumber(boost.totalAmount)}</span>
                      </div>
                      <Badge variant={boost.header?.status === 'active' ? 'default' : 'secondary'} className="w-full justify-center">
                        {boost.header?.status || 'Unknown'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            {searchResults.length > 0 ? (
              <div className="space-y-4">
                {searchResults.map((result, index) => (
                  <Card key={`${result.pairAddress}-${index}`} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-2">
                            {result.baseToken.symbol}/{result.quoteToken.symbol}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-1">
                            {result.baseToken.name}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {result.dexId}
                          </Badge>
                        </div>
                        
                        <div>
                          <div className="text-2xl font-bold mb-1">
                            ${parseFloat(result.priceUsd).toFixed(6)}
                          </div>
                          <div className={`text-sm ${result.priceChange.h24 > 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {formatPercentage(result.priceChange.h24)} (24h)
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Volume 24h: </span>
                            <span className="font-medium">${formatNumber(result.volume.h24)}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">Liquidity: </span>
                            <span className="font-medium">${formatNumber(result.liquidity.usd)}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">Market Cap: </span>
                            <span className="font-medium">${formatNumber(result.marketCap)}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Txns 24h: </span>
                            <span className="text-green-600">{result.txns.h24.buys}B</span>
                            <span className="mx-1">/</span>
                            <span className="text-red-500">{result.txns.h24.sells}S</span>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <a href={result.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              View on DEX
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Search Results</h3>
                    <p className="text-muted-foreground">
                      {searchQuery ? 'No results found for your search.' : 'Enter a search query to find tokens and pairs.'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}