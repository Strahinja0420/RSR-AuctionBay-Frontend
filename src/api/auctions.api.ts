import { useNavigate } from "react-router-dom";
import type { Auction } from "../types/Auction.type";
import api from "./axios";

export const getAuctions = async (): Promise<Auction[]> => {
  const response = await api.get(`/auctions`);
  //console.log(response);

  return response.data;
};

export const getUserAuctions = async (): Promise<Auction[]> => {
  const response = await api.get(`/auctions/me`);
  //console.log(response);

  return response.data;
};

export const createAuction = async (data: FormData) => {
  try {
    const res = await api.post("/auctions", data);
    return res.data;
  } catch (error: any) {
    console.error("Bid error status:", error.response?.status);
    console.error("Bid error data:", error.response?.data);
    console.error("Bid error message:", error.message);
    throw error;
  }
};

export const getAuctionById = async (id: string) => {
  const response = await api.get(`/auctions/${id}`);
  let navigate = useNavigate();

  navigate(`/auction/${id}`);
  return response.data;
};

export const bidOnAuction = async (bid: number, id: string) => {
  try {
    console.log(bid);
    
    const res = await api.post(`/auctions/${id}/bids`, { amount: bid });
    return res.data;
  } catch (error: any) {
    console.error("Bid error status:", error.response?.status);
    console.error("Bid error data:", error.response?.data);
    console.error("Bid error message:", error.message);
    throw error;
  }
};
