import { useAuctions } from "../hooks/useAuctions";
import AuctionsGrid from "../components/auctions/AuctionsGrid";
import PageWithTopBar from "../components/layout/PageWithTopBar";
import { LoaderCircle } from "lucide-react";

function AllAuctionsPage() {
  const { auctions, loading, error, refetchAuctions } = useAuctions();

  const activeAuctions = auctions.filter((a) => a.status === "active");

  if (loading && auctions.length === 0) {
    return (
      <>
        <PageWithTopBar />
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <LoaderCircle className="w-12 h-12 animate-spin text-[#7A2E3A]" />
          <p className="text-xl font-medium text-[#3B0F19]">
            Loading auctions...
          </p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageWithTopBar />
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
          <p className="text-2xl font-bold text-red-600 mb-2">
            Oops! Something went wrong.
          </p>
          <p className="text-[#3B0F19] mb-6">
            {(error as any)?.message || "Failed to fetch auctions"}
          </p>
          <button
            onClick={() => refetchAuctions()}
            className="px-6 py-2 bg-[#3B0F19] text-white rounded-lg hover:bg-[#4d1421] transition-colors"
          >
            Try Again
          </button>
        </div>
      </>
    );
  }

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
