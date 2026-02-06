import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchBidsByAuction } from "../api/bids.api";
import { bidOnAuction } from "../api/auctions.api";

export const useBids = (auctionId: string | undefined) => {
  const queryClient = useQueryClient();

  const allBidsQuery = useQuery({
    queryKey: ["bids", auctionId],
    queryFn: () => fetchBidsByAuction(auctionId!),
    enabled: !!auctionId,
  });

  const placeBidMutation = useMutation({
    mutationFn: (amount: number) => bidOnAuction(amount, auctionId!),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bids", auctionId] });

      queryClient.invalidateQueries({ queryKey: ["auction", auctionId] });

      queryClient.invalidateQueries({ queryKey: ["auctions"] });
    },
  });

  return {
    placeBid: placeBidMutation.mutateAsync,
    bids: allBidsQuery.data ?? [],
    loading: allBidsQuery.isLoading || placeBidMutation.isPending,
  };
};
