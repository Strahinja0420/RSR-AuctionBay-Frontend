import { useAuction } from "../hooks/useAuctions";
import AuctionsGrid from "../components/auctions/AuctionsGrid";
import TopBar from "../components/layout/TopBar";
import AddAuctionForm from "../components/auctions/AddAuctionFormModal";
import { useState } from "react";
import ProfileModal from "../components/profile/ProfileModal";
import { useAuth } from "../hooks/useAuth";

function AllAuctionsPage() {
  const { auctions, refetch } = useAuction();
  const [openAuction, setOpenAuction] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const { updateUser } = useAuth();

  const handleUserUpdate = async (username: string, email: string) => {
    try {
      await updateUser(username, email);
    } catch (error) {
      console.log(error);
    }
  };

  if (auctions.length === 0) return <p>No auctions available</p>;
  return (
    <>
      <TopBar
        onCreateAuction={() => setOpenAuction(true)}
        onOpenProfile={() => setOpenProfile(true)}
      />
      <AuctionsGrid auctions={auctions} />
      <AddAuctionForm
        isOpen={openAuction}
        onClose={() => {
          setOpenAuction(false), refetch();
        }}
      ></AddAuctionForm>
      <ProfileModal
        onUpdateUser={handleUserUpdate}
        isOpen={openProfile}
        onClose={() => {
          setOpenProfile(false);
        }}
      ></ProfileModal>
    </>
  );
}

export default AllAuctionsPage;
