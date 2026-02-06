import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuctionById } from "../api/auctions.api";
import type { Auction } from "../types/Auction.type";

export const useAuction = (id: string | undefined) => {
  const queryClient = useQueryClient();

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["auction", id],
    queryFn: () => getAuctionById(id!),
    enabled: !!id,
    placeholderData: () => {
      // 1. Peek into the cache where ['auctions'] is stored
      const allAuctions = queryClient.getQueryData<Auction[]>(["auctions"]);

      // 2. Try to find the specific auction by ID
      return allAuctions?.find((a) => a.id === id);
    },
  });

  return { auction: data, error, loading: isLoading, refetch };
};
