import api from "./axios";
import type { Bid } from "../types/Bid.type";

export const fetchBidsByAuction = async (auctionId: string): Promise<Bid[]> => {
  const res = await api.get(`/auctions/${auctionId}/bids`);
  return res.data;
};
