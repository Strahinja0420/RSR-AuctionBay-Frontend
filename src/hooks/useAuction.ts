import { getAuctionById } from "../api/auctions.api";
import type { Auction } from "../types/Auction.type";
import { useEffect, useState } from "react";

export const useAuction = (id: string | undefined, initialData?: Auction) => {
  const [auction, setAuction] = useState<Auction | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<Error | null>(null);

  const fetchAuction = async () => {
    if (!id) {
      setAuction(null);
      setLoading(false);
    } else {
      try {
        if (!auction) setLoading(true);
        const data = await getAuctionById(id);
        setAuction(data);
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    setAuction(initialData || null);
    fetchAuction();
  }, [id, initialData]);

  return {
    auction,
    loading,
    error,
    refetch: fetchAuction,
  };
};
