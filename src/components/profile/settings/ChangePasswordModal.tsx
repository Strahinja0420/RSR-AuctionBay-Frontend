import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useAuth } from "../../../hooks/useAuth";

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

  if (!isOpen) return null;
  return (
    <>
      {/*OVERLAY*/}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-md"
        onClick={isSubmitting ? onClose : undefined}
      ></div>

      {/*MODAL*/}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="w-full max-w-md rounded-2xl bg-gray-50 p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <h2 className="mb-1 text-xl font-semibold text-red-900 text-center">
            Password settings
          </h2>
          <p className="mb-6 text-sm text-gray-500 text-center">
            Update your password
          </p>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* CURRENT PASSWORD */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700" htmlFor="">
                  Current password
                </label>
                <input
                  type="password"
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                           focus:border-red-900 focus:outline-none
                           focus:ring-2 focus:ring-red-900/20"
                  {...register("currentPassword")}
                />
              </div>
              {errors.currentPassword && (
                <span className="text-xs text-red-600 text-end">
                  {errors.currentPassword.message}
                </span>
              )}
            </div>

            {/* NEW PASSWORD */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">
                  New password
                </label>
                <input
                  type="password"
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                           focus:border-red-900 focus:outline-none
                           focus:ring-2 focus:ring-red-900/20"
                  {...register("newPassword")}
                />
              </div>
              {errors.newPassword && (
                <span className="text-xs text-red-600 text-end">
                  {errors.newPassword.message}
                </span>
              )}
            </div>

            {/* CONFIRM NEW PASSWORD */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">
                  Confirm new password
                </label>
                <input
                  type="password"
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                           focus:border-red-900 focus:outline-none
                           focus:ring-2 focus:ring-red-900/20"
                  {...register("confirmNewPassword")}
                />
              </div>
              {errors.confirmNewPassword && (
                <span className="text-xs text-red-600 text-end">
                  {errors.confirmNewPassword.message}
                </span>
              )}
            </div>

            {/* FOOTER(BUTTONS) */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-sm text-gray-700
                           hover:bg-gray-200 hover:cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-lg bg-red-900 px-4 py-2 text-sm
                           font-medium text-white hover:bg-red-800 hover:cursor-pointer"
              >
                Save changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ChangePasswordModal;
