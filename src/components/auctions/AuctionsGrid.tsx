import type { Auction } from "../../types/Auction.type";
import AuctionCard from "./AuctionCard";
import { NavLink } from "react-router-dom";

type Props = {
  auctions: Auction[];
  title?: String;
  onlyActive?: boolean;
};

//.filter((auction) => auction.status === "active")     IN CASE U WANT ONLY ACTIVE AUCTIONS ADD THIS BEFORE .MAP

function AuctionsGrid({ auctions, title, onlyActive = false }: Props) {
  const filtered = onlyActive
    ? auctions.filter((a) => a.status === "active")
    : auctions;

  const sortedAuctions = [...filtered].sort((a, b) => {
    const isAActive = a.status === "active";
    const isBActive = b.status === "active";

    // 1. Active auctions first
    if (isAActive && !isBActive) return -1;
    if (!isAActive && isBActive) return 1;

    // 2. If both are active, sort by end date ascending (soonest first)
    if (isAActive && isBActive) {
      return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
    }

    // 3. If both are non-active (ended, draft, cancelled), sort by end date descending (most recent first)
    return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
  });


  //console.log(auctions);
  

  return (
    <div className="mx-5 mt-2 mb-10">
      {/* Optional section heading */}
      <h2 className="mb-4 text-3xl font-bold  text-[#3B0F19] text-center">
        {title}
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6">
        {sortedAuctions
          .map((auction) => (
            <NavLink
              key={auction.id}
              to={`/auction/${auction.id}`}
              state={{ auction }}
            >
              <AuctionCard auction={auction} />
            </NavLink>
          ))}
      </div>
    </div>
  );
}

export default AuctionsGrid;
