import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import TopBar from "../components/layout/TopBar";
import AddAuctionForm from "../components/auctions/AddAuctionFormModal";
import { useAuction } from "../hooks/useAuctions";
import Profiles from "../components/ProfileModals";
import ProfileModals from "../components/ProfileModals";

function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { refetch } = useAuction();

  const [openAuction, setOpenAuction] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const handleUserUpdate = async (username: string, email: string) => {
    try {
      await updateUser(username, email);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <TopBar
        onCreateAuction={() => setOpenAuction(true)}
        onOpenProfile={() => setOpenProfile(true)}
      />
      <p>Email:{user?.email}</p>
      <p>Role:{user?.role}</p>
      <p>Username:{user?.username}</p>
      <Link to="/auctions">Browse Auctions</Link>

      <AddAuctionForm
        isOpen={openAuction}
        onClose={() => {
          setOpenAuction(false), refetch();
        }}
      ></AddAuctionForm>
      <ProfileModals
        isOpen={openProfile}
        onClose={() => setOpenProfile(false)}
      ></ProfileModals>
    </>
  );
}

export default ProfilePage;
