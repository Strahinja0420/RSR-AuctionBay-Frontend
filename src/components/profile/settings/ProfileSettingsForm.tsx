import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useAuth } from "../../../hooks/useAuth";
import api, { API_BASE_URL } from "../../../api/axios";

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

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="w-full max-w-md p-6 shadow-2xl rounded-2xl bg-gray-50"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="mb-1 text-xl font-semibold text-center text-red-900">
            Profile settings
          </h2>
          <p className="mb-6 text-sm text-center text-gray-500">
            Update your account information
          </p>

          <div className="flex flex-col items-center gap-3 mb-5">
            <div className="flex items-center justify-center w-20 h-20 overflow-hidden bg-gray-200 rounded-full">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt="avatar"
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-sm font-semibold text-gray-700">
                  {user?.username?.slice(0, 1)?.toUpperCase() ?? "U"}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <button
                type="button"
                onClick={onPickAvatarClick}
                disabled={isUploadingAvatar}
                className="text-left text-red-900 hover:underline disabled:opacity-60"
              >
                {isUploadingAvatar ? "Uploading..." : "Change profile picture"}
              </button>

              {avatarError && (
                <span className="text-xs text-red-600">{avatarError}</span>
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                {...register("username")}
                className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:border-red-900 focus:outline-none focus:ring-2 focus:ring-red-900/20"
              />
              {errors.username && (
                <span className="text-xs text-red-600">
                  {errors.username.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                {...register("email")}
                className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:border-red-900 focus:outline-none focus:ring-2 focus:ring-red-900/20"
              />
              {errors.email && (
                <span className="text-xs text-red-600">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2 pt-2 text-sm">
              <button
                type="button"
                className="text-left text-red-900 hover:underline"
                onClick={onOpenChangePassword}
              >
                Change password
              </button>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-200 hover:cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-900 rounded-lg hover:bg-red-800 hover:cursor-pointer disabled:opacity-70"
              >
                {isSubmitting ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ProfileSettingsForm;
