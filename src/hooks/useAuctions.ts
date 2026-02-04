import { useEffect, useState, useCallback } from "react";
import type { Auction } from "../types/Auction.type";
import { getAuctions, getUserAuctions } from "../api/auctions.api";

export const useAuctions = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [userAuctions, setUserAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAuctions = useCallback(async () => {
    setLoading(true);
    try {
      const [allData, userData] = await Promise.all([
        getAuctions(),
        getUserAuctions(),
      ]);
      setAuctions(allData);
      setUserAuctions(userData);
    } catch (err) {
      console.error("Failed to fetch auctions", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuctions();
  }, [fetchAuctions]);

  return { auctions, userAuctions, loading, refetch: fetchAuctions };
};
