import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useAuth } from "../../../hooks/useAuth";
import api, { API_BASE_URL } from "../../../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, Mail, User as UserIcon, Lock } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (username: string, email: string) => Promise<void>;
  onOpenChangePassword: () => void;
};

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Enter a valid email address"),
});

type FormFields = z.infer<typeof schema>;

function ProfileSettingsForm({
  isOpen,
  onClose,
  onUpdate,
  onOpenChangePassword,
}: Props) {
  const { user, setUser } = useAuth();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const avatarSrc = user?.avatarUrl ? `${API_BASE_URL}${user.avatarUrl}` : null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      email: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        email: user.email,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: FormFields) => {
    await onUpdate(data.username, data.email);
    onClose();
  };

  const onPickAvatarClick = () => {
    setAvatarError(null);
    fileInputRef.current?.click();
  };

  const onAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarError(null);

    if (!file.type.startsWith("image/")) {
      setAvatarError("Please select an image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setAvatarError("Max image size is 2MB.");
      e.target.value = "";
      return;
    }

    try {
      setIsUploadingAvatar(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/users/me/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(res.data);
      e.target.value = "";
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Avatar upload failed.";
      setAvatarError(Array.isArray(msg) ? msg.join(", ") : msg);
      e.target.value = "";
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative p-6 text-center border-b border-gray-100">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 transition-colors hover:text-[#7A2E3A]"
                >
                  <X size={20} />
                </button>
                <h2 className="text-2xl font-bold text-[#3B0F19]">
                  Profile Settings
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your account and preferences
                </p>
              </div>

              <div className="p-8">
                <div className="flex flex-col items-center gap-4 mb-8">
                  <div className="group relative">
                    <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-md ring-1 ring-gray-200">
                      {avatarSrc ? (
                        <img
                          src={avatarSrc}
                          alt="avatar"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#7A2E3A]/5 to-[#7A2E3A]/10 text-3xl font-bold text-[#3B0F19]">
                          {user?.username?.slice(0, 1)?.toUpperCase() ?? "U"}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={onPickAvatarClick}
                      disabled={isUploadingAvatar}
                      className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#7A2E3A] text-white shadow-lg transition-transform hover:scale-110 disabled:opacity-50"
                    >
                      {isUploadingAvatar ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <Camera size={16} />
                      )}
                    </button>
                  </div>

                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">
                      Profile Picture
                    </p>
                    {avatarError && (
                      <p className="mt-1 text-xs font-medium text-red-600">
                        {avatarError}
                      </p>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onAvatarFileChange}
                  />
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <UserIcon size={16} className="text-gray-400" />
                      Username
                    </label>
                    <input
                      {...register("username")}
                      placeholder="Your username"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm transition-all focus:border-[#7A2E3A] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#7A2E3A]/10"
                    />
                    {errors.username && (
                      <p className="text-xs font-medium text-red-600">
                        {errors.username.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Mail size={16} className="text-gray-400" />
                      Email Address
                    </label>
                    <input
                      {...register("email")}
                      placeholder="your@email.com"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm transition-all focus:border-[#7A2E3A] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#7A2E3A]/10"
                    />
                    {errors.email && (
                      <p className="text-xs font-medium text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={onOpenChangePassword}
                      className="flex items-center gap-2 text-sm font-semibold text-[#7A2E3A] transition-colors hover:text-[#4A1622] hover:underline"
                    >
                      <Lock size={16} />
                      Change Password
                    </button>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 rounded-xl px-4 py-3 text-sm font-bold text-gray-600 transition-all hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 rounded-xl bg-[#7A2E3A] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#7A2E3A]/20 transition-all hover:bg-[#4A1622] hover:shadow-[#4A1622]/30 disabled:opacity-50"
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export default ProfileSettingsForm;
