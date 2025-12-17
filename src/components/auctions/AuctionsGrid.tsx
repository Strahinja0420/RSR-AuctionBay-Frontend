import React from "react";
import type { Auction } from "../../types/Auction.type";
import AuctionCard from "./AuctionCard";

type Props = {
  auctions: Auction[];
};

function AuctionsGrid({ auctions }: Props) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {auctions.map((auction) => (
          <AuctionCard key={auction.id} auction={auction} />
        ))}
      </div>
    </>
  );
}

export default AuctionsGrid;
