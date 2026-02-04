import { useAuction } from "../hooks/useAuctions";
import AuctionsGrid from "../components/auctions/AuctionsGrid";
import PageWithTopBar from "../components/layout/PageWithTopBar";

function AllAuctionsPage() {
  const { auctions } = useAuction();

  const activeAuctions = auctions.filter((a) => a.status === "active");

  return (
    <>
      <PageWithTopBar />
      {activeAuctions.length === 0 ? (
        <p className="text-center text-3xl mt-10 font-bold text-[#3B0F19]">
          No auctions available currently.
          <br />
          Check back soon!
        </p>
      ) : (
        <AuctionsGrid auctions={activeAuctions} title="Auctions" />
      )}
    </>
  );
}

export default AllAuctionsPage;
