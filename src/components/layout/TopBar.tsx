import { CircleDollarSign, LayoutDashboard, Plus, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { API_BASE_URL } from "../../api/axios";

type Props = {
  onCreateAuction: () => void;
  onOpenProfile: () => void;
};

function TopBar({ onCreateAuction, onOpenProfile }: Props) {
  const { user, logout } = useAuth();

  // Determine avatar source or fallback
  const avatarSrc = user?.avatarUrl ? `${API_BASE_URL}${user.avatarUrl}` : null;

  return (
    <div className="flex items-center px-5 pt-2 pb-2 rounded-b-md bg-neutral-950">
      {/* LOGO */}
      <NavLink to="/" onClick={logout}>
        <img
          src="/logo.png"
          alt="Auction Bay"
          className="w-15 h-15 rounded-2xl"
        />
      </NavLink>

      {/* NAVIGATION LINKS */}
      <div className="flex h-12 p-1 my-auto ml-5 bg-[#4A1622] rounded-full border border-[#7A2E3A]">
        <div className="flex">
          {/* Link to the auctions page */}
          <NavLink
            to="/auctions"
            className={({ isActive }) =>
              `flex items-center gap-1 px-4 rounded-full text-sm transition
              ${
                isActive
                  ? "bg-[#E6C76E] text-[#3B0F19] font-semibold"
                  : "text-[#E5E7EB] hover:text-[#E6C76E]"
              }`
            }
          >
            <CircleDollarSign size={16} />
            Auctions
          </NavLink>

          {/* Admin-only Categories Link */}
          {/* Displays only if the logged-in user has an 'admin' role */}
          {user?.role === "admin" && (
            <NavLink
              to="/admin/categories"
              className={({ isActive }) =>
                `flex items-center gap-1 px-4 rounded-full text-sm transition
                ${
                  isActive
                    ? "bg-[#E6C76E] text-[#3B0F19] font-semibold"
                    : "text-[#E5E7EB] hover:text-[#E6C76E]"
                }`
              }
            >
              <LayoutDashboard size={16} />
              Categories
            </NavLink>
          )}

          {/* Link to the user profile page */}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-1 px-4 rounded-full text-sm transition
              ${
                isActive
                  ? "bg-[#E6C76E] text-[#3B0F19] font-semibold"
                  : "text-[#E5E7EB] hover:text-[#E6C76E]"
              }`
            }
          >
            <User size={16}></User>
            Profile
          </NavLink>
        </div>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* CREATE AUCTION BUTTON */}
        <button
          onClick={onCreateAuction}
          className="flex items-center gap-1 bg-[#E6C76E] text-[#3B0F19] px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-95 transition"
        >
          <Plus size={16} />
          Create auction
        </button>

        {/* OPEN PROFILE BUTTON */}
        <button
          onClick={onOpenProfile}
          className="h-15 w-15 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border border-[#7A2E3A] hover:ring-2 hover:ring-[#E6C76E]/60 transition"
        >
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt="avatar"
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="text-sm font-semibold text-gray-800">
              {user?.username?.slice(0, 1)?.toUpperCase() ?? "U"}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

export default TopBar;
