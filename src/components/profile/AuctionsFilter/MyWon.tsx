import { useAuth } from "../../../hooks/useAuth";
import { useAuctions } from "../../../hooks/useAuctions";
import AuctionsGrid from "../../auctions/AuctionsGrid";

const MyWon = () => {
  const { user } = useAuth();
  const { auctions } = useAuctions();

  if (!user) return null;

  const wonAuctions = auctions.filter(
    (auction) => auction.status === "ended" && auction.winnerId === user.id,
  );

  if (wonAuctions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full pt-6 text-center">
        <p className="text-center text-[32px] font-bold text-(--text-primary)">
          No won auctions yet!
        </p>
        <p className="text-center text-[16px] font-light text-(--text-gray)">
          Keep bidding and you’ll see your <br />
          won auctions here.
        </p>
      </div>
    );
  }

  return <AuctionsGrid auctions={wonAuctions} title="" onlyActive={false} />;
};

export default MyWon;
