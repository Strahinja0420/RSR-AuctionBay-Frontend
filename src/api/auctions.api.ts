import type { Auction } from "../types/Auction.type";
import api from "./axios";

export const getAuctions = async (): Promise<Auction[]> => {
  const response = await api.get(`/auctions`);
  return response.data;
};

export const getUserAuctions = async (): Promise<Auction[]> => {
  const response = await api.get(`/auctions/me`);
  return response.data;
};

export const createAuction = async (data: FormData) => {
  const res = await api.post("/auctions", data);
  return res.data;
};

export const getAuctionById = async (id: string) => {
  const response = await api.get(`/auctions/${id}`);
  return response.data;
};

export const bidOnAuction = async (bid: number, id: string) => {
  const res = await api.post(`/auctions/${id}/bids`, { amount: bid });
  return res.data;
};

export const deleteAuction = async (id: string) => {
  const response = await api.delete(`/auctions/${id}`);
  return response.data;
};

export const updateAuction = async (id: string, data: any) => {
  const response = await api.patch(`/auctions/${id}`, data);
  return response.data;
};
