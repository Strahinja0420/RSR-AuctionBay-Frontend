import React from "react";
import { useAuction } from "../hooks/useAuctions";

function AllAuctionsPage() {
  const { auctions } = useAuction();

  if (auctions.length === 0) return <p>No auctions available</p>;
  return (
    <>
      {auctions.map((auction) => (
        <>
        <p>{auction.title}</p>
        <p>{auction.buyNowPrice}</p>
        </>
      ))}
    </>
  );
}

export default AllAuctionsPage;
