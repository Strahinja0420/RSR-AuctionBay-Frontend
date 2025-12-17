import { useEffect, useState } from "react";
import type { Auction } from "../types/Auction.type";
import {  getAuctions } from "../api/auctions.api";

export const useAuction = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);

  useEffect(() => {
    getAuctions().then(setAuctions)

  }, []);

  return {auctions};
};
