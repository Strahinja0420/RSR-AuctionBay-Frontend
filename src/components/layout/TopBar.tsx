import { CircleDollarSign, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import AddAuctionForm from "../auctions/AddAuctionForm";
import ProfileModal from "../profile/ProfileModal";

function TopBar() {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="flex ml-2 mr-2 mb-10 mt-10">
        <div>
          <NavLink to={"/"} onClick={logout}>
            Logo goes here
          </NavLink>
        </div>
        <div className="flex ml-5 gap-2">
          <NavLink
            to="/auctions"
            className={({ isActive }) =>
              `flex items-center ${
                isActive ? `bg-black text-white` : `bg-white text-black`
              }`
            }
          >
            <CircleDollarSign size={16} />
            <p>Auctions</p>
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center ${
                isActive ? `bg-black text-white` : `bg-white text-black`
              }`
            }
          >
            <User size={16} />
            <p>Profile</p>
          </NavLink>
        </div>

        <div className="flex ml-auto gap-2">
          <button onClick={() => setOpen(true)}>Add auction goes here</button>
          <AddAuctionForm
            isOpen={open}
            onClose={() => setOpen(false)}
          ></AddAuctionForm>
          <button onClick={() => setOpen(true)}>Profile goes here</button>
          <ProfileModal
            isOpen={open}
            onClose={() => setOpen(false)}
          ></ProfileModal>
        </div>
      </div>
    </>
  );
}

export default TopBar;
