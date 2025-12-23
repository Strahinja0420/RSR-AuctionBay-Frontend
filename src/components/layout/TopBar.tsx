import { CircleDollarSign, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

type Props = {
  onCreateAuction: () => void;
  onOpenProfile: () => void;
};

function TopBar({ onCreateAuction,onOpenProfile }: Props) {
  const { logout } = useAuth();
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
          <button
            className="hover:cursor-pointer"
            onClick={() => onCreateAuction()}
          >
            Add auction goes here
          </button>

          <button
            className="hover:cursor-pointer"
            onClick={() => onOpenProfile()}
          >
            Profile goes here
          </button>
        </div>
      </div>
    </>
  );
}

export default TopBar;
