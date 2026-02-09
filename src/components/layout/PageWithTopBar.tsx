import { useState } from "react";
import TopBar from "./TopBar";
import AddAuctionForm from "../auctions/AddAuctionFormModal";
import ProfileModals from "../ProfileModals";
import { useAuctions } from "../../hooks/useAuctions";

function PageWithTopBar() {
  const [openAuction, setOpenAuction] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const { refetchAuctions } = useAuctions();

  return (
    <>
      <TopBar
        onCreateAuction={() => setOpenAuction(true)}
        onOpenProfile={() => setOpenProfile(true)}
      />
      {/* GLOBAL MODALS */}
      <AddAuctionForm
        isOpen={openAuction}
        onClose={() => {
          setOpenAuction(false);
          refetchAuctions();
        }}
      />
      <ProfileModals
        isOpen={openProfile}
        onClose={() => setOpenProfile(false)}
      />
    </>
  );
}

export default PageWithTopBar;
