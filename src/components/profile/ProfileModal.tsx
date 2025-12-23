import { Settings } from "lucide-react";
import { Activity, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import ProfileSettingsForm from "./settings/ProfileSettingsForm";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser: (username: string, email: string) => Promise<void>;
};

function ProfileModal({ isOpen, onClose, onUpdateUser }: Props) {
  const { logout } = useAuth();

  const [openSettings, setOpenSettings] = useState(false);
  return (
    <>
      <Activity mode={isOpen ? "visible" : "hidden"}>
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => onClose()}
        >
          <div
            className="bg-red-200 rounded-2xl h-30 w-40 z-10 absolute top-17 right-2 border-black border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center justify-center m-auto h-full w-full">
              <div className="flex items-center gap-1">
                <Settings size={16} />
                <button
                  className="hover:cursor-pointer"
                  onClick={() => {
                    setOpenSettings(true);
                    onClose();
                  }}
                >
                  Profile settings
                </button>
                {openSettings && (
                  <ProfileSettingsForm
                    onUpdate={onUpdateUser}
                    onClose={() => setOpenSettings(false)}
                    isOpen={openSettings}
                  />
                )}
              </div>
              <button
                className="border rounded-2xl p-1 px-5 text-m text-black hover:cursor-pointer"
                onClick={logout}
              >
                Logout
              </button>
              <button
                className="text-m text-black border rounded-2xl p-1 px-5 mt-1 hover:cursor-pointer"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Activity>
    </>
  );
}

export default ProfileModal;
