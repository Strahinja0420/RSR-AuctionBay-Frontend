import { useAuctions } from "../../../hooks/useAuctions";
import { useAuth } from "../../../hooks/useAuth";
import AuctionsGrid from "../../auctions/AuctionsGrid";

const MyAuctions = () => {
  const { user } = useAuth();
  const { auctions } = useAuctions();

  //console.log(userAuctions);
  //console.log(user?.id);
  //console.log(userAuctions.map(auction => auction.bids.map(bid => bid.placedById)));

  if (!user) return null;

  const biddingAuctions = auctions.filter(
    (auction) =>
      auction.status === "active" &&
      auction.bids?.some((bid) => bid.placedById === user.id),
  );

  //console.log(biddingAuctions);

  if (biddingAuctions.length == 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full pt-6 text-center">
        <p className="text-center text-[32px] font-bold text-(--text-primary)">
          No bidding in progress!
        </p>
        <p className="text-center text-[16px] font-light text-(--text-gray)">
          Start bidding by finding new items you <br />
          like on "Auction" page! <br />
        </p>
      </div>
    );
  }

  return <AuctionsGrid auctions={biddingAuctions} title="" onlyActive={true} />;
};

export default MyAuctions;
