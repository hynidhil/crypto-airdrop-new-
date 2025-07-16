@@ .. @@
   const fetchCoins = async () => {
-    setLoading(true);
+    if (!refreshing) setLoading(true);
     setError(null);
     try {
       const res = await fetch("/api/crypto");
-      if (!res.ok) throw new Error("Failed to fetch crypto data");
       const data = await res.json();
-      if (data.error) throw new Error(data.error);
+      
+      if (!res.ok || data.error) {
+        // Handle specific API errors
+        if (data.error && data.error.includes("API key")) {
+          throw new Error("CoinMarketCap API key not configured. Please check your environment variables.");
+        } else if (data.error && data.error.includes("rate limit")) {
+          throw new Error("API rate limit exceeded. Please try again later.");
+        } else {
+          throw new Error(data.error || "Failed to fetch crypto data");
+        }
+      }
+      
       const coinsArray = data.data || [];
       setCoins(coinsArray);
     } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };