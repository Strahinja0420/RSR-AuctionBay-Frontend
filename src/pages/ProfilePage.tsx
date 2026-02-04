import { useAuth } from "../hooks/useAuth";
import PageWithTopBar from "../components/layout/PageWithTopBar";
import { useState } from "react";
import { useAuction } from "../hooks/useAuctions";
import StatCard from "../components/profile/StatCard";
import MyAuctions from "../components/profile/AuctionsFilter/MyAuctions";
import MyBidding from "../components/profile/AuctionsFilter/MyBidding";
import MyWon from "../components/profile/AuctionsFilter/MyWon";

function ProfilePage() {
  const { user } = useAuth();
  const { userAuctions, auctions } = useAuction();
  const [activeTab, setActiveTab] = useState<"myAuctions" | "bidding" | "won">(
    "myAuctions",
  );
  //console.log(user);

  const totalAuctions = userAuctions.length;

  const activeBids = userAuctions.filter((x) => x.status === "active").length;

  const wonAuctions = auctions.filter(
    (x) => x.status === "ended" && x.winnerId === user?.id,
  ).length;

  const totalSpent = auctions
    .filter((x) => x.winnerId === user?.id)
    .reduce((sum, x) => sum + Number(x.currentPrice ?? 0), 0);

  return (
    <>
      <PageWithTopBar />

      {/* MAIN CONTENT AREA */}
      <div className="w-full min-h-screen pt-10 pl-5 overflow-hidden bg-gray-50">
        <p className="text-2xl font-semibold text-[#7A2E3A] mb-5">
          <span className="font-bold">Welcome : </span>{" "}
          <span className="text-black">{user?.username}</span>
        </p>
        {/* STAT CARDS SECTION */}
        <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="My Auctions"
            subtitle="Total created"
            value={totalAuctions}
          />

          <StatCard
            title="Active Auctions"
            subtitle="Currently running"
            value={activeBids}
          />

          <StatCard
            title="Won Auctions"
            subtitle="Successfully won"
            value={wonAuctions}
          />

          <StatCard
            title="Total Spent"
            subtitle="All time"
            value={`€${totalSpent}`}
          />
        </div>

        {/* TAB NAVIGATION SECTION */}
        <div className="flex items-center justify-center mx-auto my-10 space-x-8 overflow-auto bg-neutral-800 w-fit rounded-2xl">
          <div className="px-1 py-1 bg-neutral-800 rounded-4xl">
            <button
              onClick={() => setActiveTab("myAuctions")}
              className={`px-4 py-2 font-bold rounded-2xl transition-all duration-200 ease-in-out ${
                activeTab === "myAuctions"
                  ? "bg-[#E6C76E] text-white "
                  : "text-[#ac1111]  hover:ring-[#E6C76E] hover:ring-2"
              }`}
            >
              My auctions
            </button>
            <button
              onClick={() => setActiveTab("bidding")}
              className={`px-4 py-2 font-bold rounded-2xl transition-all duration-200 ease-in-out  ${
                activeTab === "bidding"
                  ? "bg-[#E6C76E] text-white"
                  : "text-[#ac1111]  hover:ring-[#E6C76E] hover:ring-2 "
              }`}
            >
              Bidding
            </button>
            <button
              onClick={() => setActiveTab("won")}
              className={`px-4 py-2 font-bold rounded-2xl transition-all duration-200 ease-in-out ${
                activeTab === "won"
                  ? "bg-[#E6C76E] text-white"
                  : "text-[#ac1111]  hover:ring-[#E6C76E] hover:ring-2"
              }`}
            >
              Won
            </button>
          </div>
        </div>
        {/* TAB CONTENT */}
        {activeTab === "myAuctions" ? (
          <MyAuctions />
        ) : activeTab === "bidding" ? (
          <MyBidding />
        ) : activeTab === "won" ? (
          <MyWon />
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default ProfilePage;
