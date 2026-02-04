import { useState, useEffect, useCallback } from "react";
import { fetchBidsByAuction } from "../api/bids.api";
import { bidOnAuction } from "../api/auctions.api";
import { useBidders } from "./useBidders";
import type { Bid } from "../types/Bid.type";

export const useBids = (auctionId: string | undefined) => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { bidders, loading: loadingBidders } = useBidders(bids);

  const fetchBids = useCallback(async () => {
    if (!auctionId) return;

    setLoading(true);
    try {
      const data = await fetchBidsByAuction(auctionId);
      setBids(data);
      setError(null);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [auctionId]);

  const placeBid = async (amount: number) => {
    if (!auctionId) return;

    try {
      await bidOnAuction(amount, auctionId);
      await fetchBids();
    } catch (error: any) {
      throw error;
    }
  };

  useEffect(() => {
    fetchBids();
  }, [fetchBids]);

  return {
    bids,
    bidders,
    loading: loading || loadingBidders,
    error,
    placeBid,
    refetch: fetchBids,
  };
};
