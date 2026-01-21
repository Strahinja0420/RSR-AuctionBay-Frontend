import { useEffect, useState, useCallback } from "react";
import { fetchUser } from "../api/user.api";
import type { User } from "../types/User.type";
import type { Bid } from "../types/Bid.type";

export function useBidders(bids: Bid[]) {
  const [bidders, setBidders] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);


  const loadBidders = useCallback(async () => {
    if (!bids?.length) {
      setBidders([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const bidderIds = Array.from(new Set(bids.map((bid) => bid.placedById)));

      const users = await Promise.all(bidderIds.map((id) => fetchUser(id)));

      setBidders(users);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [bids]);

  useEffect(() => {
    loadBidders();
  }, [loadBidders]);

  return {
    bidders,
    loading,
    error,
    refetch: loadBidders,
  };
}
