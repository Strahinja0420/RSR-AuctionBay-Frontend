import { useQuery } from "@tanstack/react-query";
import { getAuctions, getUserAuctions } from "../api/auctions.api";
import { useAuth } from "./useAuth";

export const useAuctions = () => {
  const { user } = useAuth();

  const allAuctionsQuery = useQuery({
    queryKey: ["auctions"],
    queryFn: getAuctions,
  });

  const userAuctionsQuery = useQuery({
    queryKey: ["auctions", "user"],
    queryFn: getUserAuctions,
    enabled: !!user,
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
