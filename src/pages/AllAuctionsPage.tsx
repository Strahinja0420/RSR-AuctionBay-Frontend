import { useAuction } from "../hooks/useAuctions";
import AuctionsGrid from "../components/auctions/AuctionsGrid";
import TopBar from "../components/layout/TopBar";

function AllAuctionsPage() {
  const { auctions } = useAuction();

  if (auctions.length === 0) return <p>No auctions available</p>;
  return (
    <>
      <TopBar />
      <AuctionsGrid auctions={auctions} />
    </>
  );
}

export default AllAuctionsPage;
