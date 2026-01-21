import type { AuctionImage } from "./AuctionImage.type";
import type { Bid } from "./Bid.type";

export type AuctionStatus = "draft" | "active" | "ended" | "cancelled";

export interface Auction {
  id: string;
  title: string;
  description: string;
  startingPrice: number;
  buyNowPrice?: number;
  currentPrice: number;
  status: AuctionStatus;
  startDate: string;
  endDate: string;
  winnerId: string;
  images: AuctionImage[];
  owner: {
    id: string;
    username: string;
  };
  bids:Bid[];
}
