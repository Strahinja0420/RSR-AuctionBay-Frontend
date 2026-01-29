import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import ProfileModal from "./profile/ProfileModal";
import ProfileSettingsForm from "./profile/settings/ProfileSettingsForm";
import ChangePasswordModal from "./profile/settings/ChangePasswordModal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

function ProfileModals({ isOpen, onClose }: Props) {
  const { updateUser, updatePassword } = useAuth();

  const [openSettings, setOpenSettings] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);

  //TODO change the name to modal and then make the form that goes into the modal a separate file (FOR ALL THE MODALS HERE!!!)

  return (
    <>
      {/* PROFILE MENU */}
      <ProfileModal
        isOpen={isOpen}
        onClose={onClose}
        onOpenSettings={() => {
          onClose(), setOpenSettings(true);
        }}
      />

      {/* PROFILE SETTINGS */}

      <ProfileSettingsForm
        isOpen={openSettings}
        onClose={() => setOpenSettings(false)}
        onUpdate={updateUser}
        onOpenChangePassword={() => {
          setOpenSettings(false), setOpenChangePassword(true);
        }}
      />

      {/* CHANGE PASSWORD */}
      <ChangePasswordModal
        isOpen={openChangePassword}
        onClose={() => {
          setOpenChangePassword(false), setOpenSettings(true);
        }}
        onUpdatePassword={updatePassword}
      />
    </>
  );
}

export default ProfileModals;
