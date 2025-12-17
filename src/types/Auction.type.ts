import type { AuctionImage } from "./AuctionImage.type";

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
  images: AuctionImage[];
  owner: {
    id: string;
    username: string;
  };
}
