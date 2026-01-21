import { useEffect, useState } from "react";
import type { Auction } from "../types/Auction.type";
import { getAuctions, getUserAuctions } from "../api/auctions.api";

export const useAuction = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [userAuctions, setUserAuctions] = useState<Auction[]>([]);

  const fetchAuctions = async () => {
    const data = await getAuctions();
    setAuctions(data);

    const usersAuctions = await getUserAuctions();
    setUserAuctions(usersAuctions);
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  return { auctions, userAuctions, refetch: fetchAuctions };
};
