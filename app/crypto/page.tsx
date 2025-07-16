const fetchCoins = async () => {
    if (!refreshing) setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tokenmetrics");
      const data = await res.json();
      
      if (!res.ok || data.error) {
        // Handle specific API errors
        if (data.error && data.error.includes("API key")) {
          throw new Error("Token Metrics API key not configured. Please check your environment variables.");
        } else if (data.error && data.error.includes("rate limit")) {
          throw new Error("API rate limit exceeded. Please try again later.");
        } else {
          throw new Error(data.error || "Failed to fetch crypto data");
        }
      }
      
      // Map Token Metrics API response to expected format
      const coinsArray = (data.coins || data || []).map((coin: any, index: number) => ({
        id: coin.id || index,
        symbol: coin.symbol || coin.ticker || '',
        name: coin.name || coin.title || '',
        image: coin.image_url || coin.logo || `https://via.placeholder.com/32x32?text=${coin.symbol || 'N/A'}`,
        current_price: coin.price || coin.current_price || 0,
        market_cap: coin.market_cap || coin.marketCap || 0,
        price_change_percentage_24h: coin.price_change_24h || coin.change_24h || 0,
      }));
      
      setCoins(coinsArray);
    } catch (err) {
     setError(err.message);
   } finally {
     setLoading(false);
   }
 };

  useEffect(() => {
    fetchCoins();
    const interval = setInterval(fetchCoins, 3600000); // Refresh every 60 minutes
    return () => clearInterval(interval);
  }, []);