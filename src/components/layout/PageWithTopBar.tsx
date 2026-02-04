import { useState } from "react";
import TopBar from "./TopBar";
import AddAuctionForm from "../auctions/AddAuctionFormModal";
import ProfileModals from "../ProfileModals";
import { useAuctions } from "../../hooks/useAuctions";

function PageWithTopBar() {
  const [openAuction, setOpenAuction] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const { refetch } = useAuctions();

  return (
    <>
      <TopBar
        onCreateAuction={() => setOpenAuction(true)}
        onOpenProfile={() => setOpenProfile(true)}
      />
      <div className="pt-2 bg-gray-50">
        <AddAuctionForm
          isOpen={openAuction}
          onClose={() => {
            (setOpenAuction(false), refetch());
          }}
        ></AddAuctionForm>
        <ProfileModals
          isOpen={openProfile}
          onClose={() => setOpenProfile(false)}
        ></ProfileModals>
      </div>
    </>
  );
}

export default PageWithTopBar;
