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
      const allAuctions = queryClient.getQueryData<Auction[]>(["auctions"]);

      return allAuctions?.find((a) => a.id === id);
    },
  });

  //I MADE THIS JUST FOR TESTING PURPOSES I KNOW ITS BAD IN THIS EXAMPLE (USER CAN HOVER OVER 20 AUCTION INSTANTLY AND MAKE IT LAG) AND I KNOW I CAN MAKE IT SO WHEN A USER IS HOVERING FOR X AMOUNT OF TIME AND THEN PREFETCH BUT I AINT DOIN THAT SHIT NOW :P
  const prefetchAuction = (auctionId: string) => {
    queryClient.prefetchQuery({
      queryKey: ["auction", auctionId],
      queryFn: () => getAuctionById(auctionId),
      staleTime: 60 * 1000,
    });
  };

  return {
    auction: data,
    error,
    loading: isLoading,
    refetch,
    prefetch: prefetchAuction,
  };
};
