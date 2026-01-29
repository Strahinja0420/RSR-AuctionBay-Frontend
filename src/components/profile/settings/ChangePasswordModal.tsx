import { zodResolver } from "@hookform/resolvers/zod";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useAuth } from "../../../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, ShieldCheck, Key } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onUpdatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
};

const schema = z
  .object({
    currentPassword: z.string().min(1, "This field is required"),
    newPassword: z.string().min(1, "This field is required"),
    confirmNewPassword: z.string().min(1, "This field is required"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "Your new password must be different from your old password",
    path: ["newPassword"],
  });

type FormFields = z.infer<typeof schema>;

function ChangePasswordModal({ isOpen, onClose, onUpdatePassword }: Props) {
  const { logout } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormFields) => {
    await onUpdatePassword(data.currentPassword, data.newPassword);
    logout();
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
            onClick={!isSubmitting ? onClose : undefined}
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
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#7A2E3A]/5 text-[#7A2E3A]">
                  <ShieldCheck size={24} />
                </div>
                <h2 className="text-2xl font-bold text-[#3B0F19]">
                  Secure Your Account
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Update your password to stay protected
                </p>
              </div>

              <div className="p-8">
                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Lock size={16} className="text-gray-400" />
                      Current Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm transition-all focus:border-[#7A2E3A] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#7A2E3A]/10"
                      {...register("currentPassword")}
                    />
                    {errors.currentPassword && (
                      <p className="text-xs font-medium text-red-600">
                        {errors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Key size={16} className="text-gray-400" />
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm transition-all focus:border-[#7A2E3A] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#7A2E3A]/10"
                      {...register("newPassword")}
                    />
                    {errors.newPassword && (
                      <p className="text-xs font-medium text-red-600">
                        {errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Key size={16} className="text-gray-400" />
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm transition-all focus:border-[#7A2E3A] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#7A2E3A]/10"
                      {...register("confirmNewPassword")}
                    />
                    {errors.confirmNewPassword && (
                      <p className="text-xs font-medium text-red-600">
                        {errors.confirmNewPassword.message}
                      </p>
                    )}
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
                      {isSubmitting ? "Updating..." : "Update Password"}
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

export default ChangePasswordModal;
