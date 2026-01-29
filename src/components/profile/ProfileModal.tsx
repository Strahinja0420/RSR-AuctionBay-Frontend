import { useRef } from "react";
import { createPortal } from "react-dom";
import { Settings, LogOut, User, X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "../../api/axios";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
};
function ProfileModal({ isOpen, onClose, onOpenSettings }: Props) {
  const { user, logout } = useAuth();
  const avatarSrc = user?.avatarUrl ? `${API_BASE_URL}${user.avatarUrl}` : null;
  const constraintsRef = useRef(null);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          ref={constraintsRef}
          className="fixed inset-0 z-50 pointer-events-none"
        >
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[2px] pointer-events-auto"
          />

          {/* Modal/Dropdown */}
          <motion.div
            drag
            dragConstraints={constraintsRef}
            dragElastic={0.2}
            initial={{ opacity: 0, scale: 0.95, y: -10, x: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10, x: 10 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed top-18 right-4 z-50 w-72 overflow-hidden rounded-2xl border border-white/20 bg-white/90 shadow-2xl backdrop-blur-xl pointer-events-auto cursor-grab active:cursor-grabbing"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / User Info */}
            <div className="relative p-6 pb-4">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 transition-colors hover:text-[#7A2E3A]"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col items-center">
                <div className="relative mb-3">
                  <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-white shadow-md bg-gradient-to-br from-[#7A2E3A]/5 to-[#7A2E3A]/10 flex items-center justify-center">
                    {avatarSrc ? (
                      <img
                        src={avatarSrc}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User size={40} className="text-[#7A2E3A]/30" />
                    )}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-[#3B0F19] leading-tight">
                  {user?.username || "Guest User"}
                </h3>
                <p className="text-sm text-gray-500 font-medium">
                  {user?.email || "No email provided"}
                </p>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-4" />

            {/* Actions */}
            <div className="p-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenSettings();
                }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-all hover:bg-[#7A2E3A]/5 hover:text-[#7A2E3A] group"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-400 transition-colors group-hover:bg-[#7A2E3A]/10 group-hover:text-[#7A2E3A]">
                  <Settings size={18} />
                </div>
                Profile Settings
              </button>

              <button
                onClick={logout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-all hover:bg-red-50 hover:text-[#7A2E3A] group"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-400 transition-colors group-hover:bg-[#7A2E3A]/10 group-hover:text-[#7A2E3A]">
                  <LogOut size={18} />
                </div>
                Logout
              </button>
            </div>

            {/* Footer / Role badge */}
            <div className="bg-gray-50/50 p-3 text-center border-t border-gray-100">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#E6C76E]">
                {user?.role === "admin" ? "🛡️ Admin Account" : "Standard User"}
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export default ProfileModal;
