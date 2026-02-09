import { useAuth } from "../hooks/useAuth";
import PageWithTopBar from "../components/layout/PageWithTopBar";
import { useState } from "react";
import { useAuctions } from "../hooks/useAuctions";
import StatCard from "../components/profile/StatCard";
import MyAuctions from "../components/profile/AuctionsFilter/MyAuctions";
import MyBidding from "../components/profile/AuctionsFilter/MyBidding";
import MyWon from "../components/profile/AuctionsFilter/MyWon";

function ProfilePage() {
  const { user } = useAuth();
  const { userAuctions, auctions } = useAuctions();
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
      <div className="w-full min-h-screen pt-6 md:pt-10 px-4 md:px-8 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#3B0F19] mb-8">
            Welcome back,{" "}
            <span className="text-[#7A2E3A]">{user?.username}</span>
          </h2>

          {/* STAT CARDS SECTION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
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
              value={`€${totalSpent.toLocaleString()}`}
            />
          </div>

          {/* TAB NAVIGATION SECTION */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex p-1.5 bg-neutral-900 rounded-2xl shadow-xl overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab("myAuctions")}
                className={`whitespace-nowrap px-4 md:px-6 py-2.5 text-sm md:text-base font-bold rounded-xl transition-all duration-300 ${
                  activeTab === "myAuctions"
                    ? "bg-[#E6C76E] text-[#3B0F19] shadow-inner"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                My Auctions
              </button>
              <button
                onClick={() => setActiveTab("bidding")}
                className={`whitespace-nowrap px-4 md:px-6 py-2.5 text-sm md:text-base font-bold rounded-xl transition-all duration-300 ${
                  activeTab === "bidding"
                    ? "bg-[#E6C76E] text-[#3B0F19] shadow-inner"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Bidding
              </button>
              <button
                onClick={() => setActiveTab("won")}
                className={`whitespace-nowrap px-4 md:px-6 py-2.5 text-sm md:text-base font-bold rounded-xl transition-all duration-300 ${
                  activeTab === "won"
                    ? "bg-[#E6C76E] text-[#3B0F19] shadow-inner"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Won
              </button>
            </div>
          </div>

          {/* TAB CONTENT */}
          <div className="pb-20">
            {activeTab === "myAuctions" ? (
              <MyAuctions />
            ) : activeTab === "bidding" ? (
              <MyBidding />
            ) : activeTab === "won" ? (
              <MyWon />
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
