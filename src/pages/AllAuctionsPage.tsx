import { useAuction } from "../hooks/useAuctions";
import AuctionsGrid from "../components/auctions/AuctionsGrid";
import PageWithTopBar from "../components/layout/PageWithTopBar";

function AllAuctionsPage() {
  const { auctions} = useAuction();

  if (auctions.length === 0) return <p>No auctions available</p>;
  return (
    <>
    <PageWithTopBar/>
      <AuctionsGrid auctions={auctions} title="Auctions" onlyActive ={true} />
    </>
  );
}

export default AllAuctionsPage;
