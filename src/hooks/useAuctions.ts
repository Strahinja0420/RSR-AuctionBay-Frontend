import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuctions, getUserAuctions } from "../api/auctions.api";
import { useAuth } from "./useAuth";
import type { Auction } from "../types/Auction.type";

export const useAuctions = () => {
  const { user } = useAuth();

  const queryClient = useQueryClient();

  const allAuctionsQuery = useQuery({
    queryKey: ["auctions"],
    queryFn: getAuctions,
  });

  const userAuctionsQuery = useQuery({
    queryKey: ["auctions", "user"],
    queryFn: getUserAuctions,
    enabled: !!user,
    placeholderData: () => {
      const allAuctions = queryClient.getQueryData<Auction[]>(["auctions"]);

      return allAuctions?.filter((a) => a.owner.id === user?.id);
    },
  });

  return {
    auctions: allAuctionsQuery.data ?? [],
    userAuctions: userAuctionsQuery.data ?? [],
    loading: allAuctionsQuery.isLoading || userAuctionsQuery.isLoading,
    refetchAuctions: allAuctionsQuery.refetch,
    refetchUserAuctions: userAuctionsQuery.refetch,
    error: allAuctionsQuery.error || userAuctionsQuery.error,
  };
};

const testLoadingAllAuctions = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  throw new Error("Simulated Error");
  return getAuctions();
};

const testLoadingUserAuctions = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return getUserAuctions();
};
