import {
  CircleDollarSign,
  LayoutDashboard,
  Plus,
  User,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { API_BASE_URL } from "../../api/axios";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  onCreateAuction: () => void;
  onOpenProfile: () => void;
};

function TopBar({ onCreateAuction, onOpenProfile }: Props) {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Determine avatar source or fallback
  const avatarSrc = user?.avatarUrl ? `${API_BASE_URL}${user.avatarUrl}` : null;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const navLinks = [
    { to: "/auctions", label: "Auctions", icon: CircleDollarSign },
    ...(user?.role === "admin"
      ? [
          {
            to: "/admin/categories",
            label: "Categories",
            icon: LayoutDashboard,
          },
        ]
      : []),
    { to: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="relative z-50 bg-neutral-950 rounded-b-xl md:rounded-b-2xl shadow-lg border-b border-white/5">
      <div className="flex items-center justify-between px-4 py-3 md:px-8 md:py-4">
        {/* LOGO */}
        <NavLink to="/" onClick={logout} className="shrink-0">
          <img
            src="/logo.png"
            alt="Auction Bay"
            className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl transition hover:opacity-80"
          />
        </NavLink>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden md:flex items-center gap-2 px-1 py-1 bg-[#4A1622] rounded-full border border-[#7A2E3A] mx-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-4 py-2 rounded-full text-sm transition font-medium
                ${
                  isActive
                    ? "bg-[#E6C76E] text-[#3B0F19]"
                    : "text-neutral-300 hover:text-[#E6C76E] hover:bg-white/5"
                }`
              }
            >
              <link.icon size={16} />
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-2 md:gap-4 ml-auto">
          {/* CREATE AUCTION BUTTON (HIDDEN ON VERY SMALL SCREENS) */}
          <button
            onClick={onCreateAuction}
            className="hidden sm:flex items-center gap-1.5 bg-[#E6C76E] text-[#3B0F19] px-4 py-2 rounded-lg text-sm font-bold hover:brightness-105 transition shadow-sm active:scale-95"
          >
            <Plus size={18} />
            <span className="hidden lg:inline">Create Auction</span>
            <span className="lg:hidden">Create</span>
          </button>

          {/* USER AVATAR / PROFILE BUTTON */}
          <button
            onClick={onOpenProfile}
            className="group relative h-10 w-10 md:h-12 md:w-12 rounded-full overflow-hidden bg-neutral-800 flex items-center justify-center border-2 border-[#7A2E3A] hover:border-[#E6C76E] transition-all duration-300 active:scale-90"
          >
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt="avatar"
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-sm md:text-base font-bold text-[#E6C76E]">
                {user?.username?.slice(0, 1)?.toUpperCase() ?? "U"}
              </span>
            )}
          </button>

          {/* MOBILE MENU TOGGLE */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-neutral-400 hover:text-white transition-colors"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DRAWER */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-neutral-900 border-t border-white/5"
          >
            <div className="flex flex-col p-4 gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-3 rounded-xl text-base transition font-semibold
                    ${
                      isActive
                        ? "bg-[#E6C76E] text-[#3B0F19]"
                        : "text-neutral-400 hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  <link.icon size={20} />
                  {link.label}
                </NavLink>
              ))}

              <div className="h-px bg-white/5 my-2" />

              <button
                onClick={onCreateAuction}
                className="flex items-center gap-4 px-4 py-3 rounded-xl text-base font-bold text-[#E6C76E] hover:bg-white/5 transition sm:hidden"
              >
                <Plus size={20} />
                Create Auction
              </button>

              <button
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="flex items-center gap-4 px-4 py-3 rounded-xl text-base font-bold text-rose-500 hover:bg-rose-500/10 transition"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default TopBar;
