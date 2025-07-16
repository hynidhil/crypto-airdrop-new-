// DEX Screener API utility functions

export interface DexScreenerToken {
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

export interface TokenProfile {
  tokenAddress: string;
  chainId: string;
  url: string;
  description: string;
  imgUrl: string;
  header: {
    status: string;
  };
}

export interface TokenBoost {
  tokenAddress: string;
  chainId: string;
  amount: number;
  totalAmount: number;
  icon: string;
  header: {
    status: string;
  };
}

// API client functions
export const dexScreenerApi = {
  async searchTokens(query: string): Promise<{ pairs: DexScreenerToken[] }> {
    const response = await fetch(`/api/dex-screener?endpoint=search&q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search tokens');
    }
    return response.json();
  },

  async getTokenProfiles(): Promise<TokenProfile[]> {
    const response = await fetch('/api/dex-screener?endpoint=token-profiles');
    if (!response.ok) {
      throw new Error('Failed to fetch token profiles');
    }
    return response.json();
  },

  async getTokenBoosts(): Promise<TokenBoost[]> {
    const response = await fetch('/api/dex-screener?endpoint=token-boosts');
    if (!response.ok) {
      throw new Error('Failed to fetch token boosts');
    }
    return response.json();
  },

  async getTopTokenBoosts(): Promise<TokenBoost[]> {
    const response = await fetch('/api/dex-screener?endpoint=token-boosts-top');
    if (!response.ok) {
      throw new Error('Failed to fetch top token boosts');
    }
    return response.json();
  },

  async getPairInfo(chainId: string, pairAddress: string): Promise<DexScreenerToken> {
    const response = await fetch(`/api/dex-screener?endpoint=pairs&chainId=${chainId}&tokenAddress=${pairAddress}`);
    if (!response.ok) {
      throw new Error('Failed to fetch pair info');
    }
    return response.json();
  },

  async getTokenPairs(chainId: string, tokenAddress: string): Promise<{ pairs: DexScreenerToken[] }> {
    const response = await fetch(`/api/dex-screener?endpoint=token-pairs&chainId=${chainId}&tokenAddress=${tokenAddress}`);
    if (!response.ok) {
      throw new Error('Failed to fetch token pairs');
    }
    return response.json();
  },

  async getTokens(chainId: string, tokenAddresses: string[]): Promise<{ pairs: DexScreenerToken[] }> {
    const addresses = tokenAddresses.join(',');
    const response = await fetch(`/api/dex-screener?endpoint=tokens&chainId=${chainId}&tokenAddress=${addresses}`);
    if (!response.ok) {
      throw new Error('Failed to fetch tokens');
    }
    return response.json();
  }
};

// Utility functions
export const formatNumber = (num: number): string => {
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num?.toFixed(2) || '0';
};

export const formatPercentage = (num: number): string => {
  const formatted = num?.toFixed(2) || '0';
  return `${num > 0 ? '+' : ''}${formatted}%`;
};

export const getChainName = (chainId: string): string => {
  const chains: Record<string, string> = {
    'ethereum': 'Ethereum',
    'bsc': 'BSC',
    'polygon': 'Polygon',
    'arbitrum': 'Arbitrum',
    'optimism': 'Optimism',
    'avalanche': 'Avalanche',
    'fantom': 'Fantom',
    'cronos': 'Cronos',
    'solana': 'Solana',
  };
  return chains[chainId] || chainId.toUpperCase();
};